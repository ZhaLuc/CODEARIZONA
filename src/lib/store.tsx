"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { seededAccounts } from "@/data/accounts";
import { requests as seedRequests } from "@/data/requests";
import { wishlists } from "@/data/wishlists";
import { schools } from "@/data/schools";
import { teachers } from "@/data/teachers";
import { clampGift, liveItems, liveWishlist, requestTotals } from "./fulfillment";
import type { Account, EvidenceFile, FulfillmentStatus, LastAction, LiveFulfillment, Role } from "./types";

const KEY = "meridian-session-v3";

type AppState = {
  accounts: Account[];
  sessionUserId: string | null;
  events: LiveFulfillment[];
  noticeOpen: boolean;
  lastAction: LastAction | null;
};

const initial: AppState = {
  accounts: seededAccounts,
  sessionUserId: null,
  events: [],
  noticeOpen: false,
  lastAction: null,
};

let memory = load();
const listeners = new Set<() => void>();

function load(): AppState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...initial,
      ...parsed,
      accounts: mergeAccounts(parsed.accounts),
      events: parsed.events ?? [],
      lastAction: parsed.lastAction ?? null,
    };
  } catch {
    return initial;
  }
}

function mergeAccounts(saved?: Account[]) {
  const extras = (saved ?? []).filter((a) => !seededAccounts.some((s) => s.email === a.email));
  return [...seededAccounts, ...extras];
}

function emit() {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(memory));
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return memory;
}

function getServerSnapshot() {
  return initial;
}

function setState(patch: Partial<AppState>) {
  memory = { ...memory, ...patch };
  emit();
}

export function resetSession() {
  memory = { ...initial, accounts: mergeAccounts(memory.accounts) };
  emit();
}

function campusDestination(teacherId: string) {
  const teacher = teachers.find((t) => t.id === teacherId);
  const school = teacher ? schools.find((s) => s.id === teacher.schoolId) : undefined;
  return school ? `${school.name} campus fulfillment, ${school.city}` : "School campus fulfillment";
}

export function useAppStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const user = state.accounts.find((a) => a.id === state.sessionUserId) ?? null;

  const signIn = useCallback((email: string, password: string) => {
    const account = memory.accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
    if (!account || account.password !== password) {
      return { ok: false, message: "Email or password does not match." };
    }
    setState({ sessionUserId: account.id });
    return { ok: true, message: `Signed in as ${account.name}.` };
  }, []);

  const signInAs = useCallback((accountId: string) => {
    const account = memory.accounts.find((a) => a.id === accountId);
    if (!account) return { ok: false, message: "Account not found." };
    setState({ sessionUserId: account.id });
    return { ok: true, message: `Signed in as ${account.name}.` };
  }, []);

  const signOut = useCallback(() => setState({ sessionUserId: null }), []);

  const signUp = useCallback((input: { name: string; email: string; password: string; role: Role }) => {
    const email = input.email.trim().toLowerCase();
    if (!input.name.trim()) return { ok: false, message: "Enter your name." };
    if (!email.includes("@")) return { ok: false, message: "Enter a valid email." };
    if (input.password.length < 6) return { ok: false, message: "Password must be at least 6 characters." };
    if (memory.accounts.some((a) => a.email.toLowerCase() === email)) {
      return { ok: false, message: "An account with that email already exists." };
    }
    const account: Account = {
      id: `user-${Date.now()}`,
      email,
      name: input.name.trim(),
      password: input.password,
      role: input.role,
    };
    setState({ accounts: [...memory.accounts, account], sessionUserId: account.id });
    return { ok: true, message: "Account created." };
  }, []);

  const submitInPerson = useCallback((requestId: string, itemId: string, quantity: number) => {
    const actor = memory.accounts.find((a) => a.id === memory.sessionUserId);
    if (!actor) return { ok: false, message: "Sign in to submit fulfillment." };
    if (actor.role === "teacher") {
      return { ok: false, message: "Teacher accounts verify fulfillment. Sign in as a community member to submit." };
    }
    const request = seedRequests.find((r) => r.id === requestId);
    if (!request) return { ok: false, message: "Need not found." };
    if (!request.accepting) return { ok: false, message: "This classroom is not accepting items." };
    const items = liveItems(request, memory.events);
    const item = items.find((i) => i.id === itemId);
    if (!item) return { ok: false, message: "Item not found." };
    const gift = clampGift(item.remainingAfterPending, quantity);
    if (!gift.quantity) return { ok: false, message: gift.error ?? "Could not apply that amount." };
    const event: LiveFulfillment = {
      id: `ev-${Date.now()}`,
      actorId: actor.id,
      actorName: actor.name,
      teacherId: request.teacherId,
      requestId,
      itemId,
      itemName: item.name,
      quantity: gift.quantity,
      channel: "in_person",
      status: "under_review",
      at: new Date().toISOString(),
      destination: campusDestination(request.teacherId),
    };
    const nextEvents = [...memory.events, event];
    const after = liveItems(request, nextEvents).find((i) => i.id === itemId)!;
    const action: LastAction = {
      eventId: event.id,
      itemName: item.name,
      quantity: gift.quantity,
      needed: item.quantityNeeded,
      verified: after.verified,
      pending: after.pending,
      remaining: after.remaining,
      remainingAfterPending: after.remainingAfterPending,
      kind: "submitted",
    };
    setState({ events: nextEvents, lastAction: action, noticeOpen: true });
    return {
      ok: true,
      message: `${gift.quantity} ${item.name.toLowerCase()} submitted. Pending teacher verification. Verified count stays ${after.verified} / ${item.quantityNeeded}.`,
    };
  }, []);

  const submitWishlist = useCallback(
    (wishlistId: string, itemId: string, quantity: number, evidence: EvidenceFile) => {
      const actor = memory.accounts.find((a) => a.id === memory.sessionUserId);
      if (!actor) return { ok: false, message: "Sign in to submit fulfillment." };
      if (actor.role === "teacher") {
        return { ok: false, message: "Teacher accounts verify fulfillment. Sign in as a community member to submit." };
      }
      const list = wishlists.find((w) => w.id === wishlistId);
      if (!list) return { ok: false, message: "Wishlist not found." };
      const live = liveWishlist(list, memory.events);
      const item = live.find((i) => i.id === itemId);
      if (!item) return { ok: false, message: "Item not found." };
      const gift = clampGift(item.remainingAfterPending, quantity);
      if (!gift.quantity) return { ok: false, message: gift.error ?? "Could not apply that amount." };
      const event: LiveFulfillment = {
        id: `ev-${Date.now()}`,
        actorId: actor.id,
        actorName: actor.name,
        teacherId: list.teacherId,
        wishlistId,
        itemId,
        itemName: item.name,
        quantity: gift.quantity,
        channel: "wishlist_shipment",
        status: "under_review",
        at: new Date().toISOString(),
        destination: campusDestination(list.teacherId),
        evidence,
      };
      const nextEvents = [...memory.events, event];
      const after = liveWishlist(list, nextEvents).find((i) => i.id === itemId)!;
      const action: LastAction = {
        eventId: event.id,
        itemName: item.name,
        quantity: gift.quantity,
        needed: item.quantity,
        verified: after.verified,
        pending: after.pending,
        remaining: after.remaining,
        remainingAfterPending: after.remainingAfterPending,
        kind: "submitted",
      };
      setState({ events: nextEvents, lastAction: action, noticeOpen: true });
      return {
        ok: true,
        message: `Shipment submitted for ${gift.quantity} ${item.name.toLowerCase()}. Pending verification. Verified count stays ${after.verified} / ${item.quantity}.`,
      };
    },
    [],
  );

  const reviewEvent = useCallback((eventId: string, status: Extract<FulfillmentStatus, "verified" | "needs_attention">, note?: string) => {
    const actor = memory.accounts.find((a) => a.id === memory.sessionUserId);
    if (!actor) return { ok: false, message: "Sign in to review fulfillment." };
    const event = memory.events.find((e) => e.id === eventId);
    if (!event) return { ok: false, message: "Fulfillment not found." };
    const canReview =
      actor.role === "admin" || (actor.role === "teacher" && actor.teacherId === event.teacherId);
    if (!canReview) return { ok: false, message: "Only the classroom teacher can verify this fulfillment." };
    const next = memory.events.map((e) =>
      e.id === eventId ? { ...e, status, teacherNote: note } : e,
    );
    const request = event.requestId ? seedRequests.find((r) => r.id === event.requestId) : undefined;
    const live = request ? liveItems(request, next).find((i) => i.id === event.itemId) : undefined;
    const action: LastAction = {
      eventId,
      itemName: event.itemName,
      quantity: event.quantity,
      needed: live?.quantityNeeded ?? event.quantity,
      verified: live?.verified ?? 0,
      pending: live?.pending ?? 0,
      remaining: live?.remaining ?? 0,
      remainingAfterPending: live?.remainingAfterPending ?? 0,
      kind: status === "verified" ? "verified" : "rejected",
    };
    setState({ events: next, lastAction: action, noticeOpen: true });
    return {
      ok: true,
      message:
        status === "verified"
          ? `Verified ${event.quantity} ${event.itemName.toLowerCase()}. Ledger updated.`
          : `Marked as needs attention. Verified count did not change.`,
    };
  }, []);

  const closeNotice = useCallback(() => setState({ noticeOpen: false }), []);

  const liveByRequest = useMemo(() => {
    const map = new Map<string, ReturnType<typeof requestTotals>>();
    for (const request of seedRequests) {
      map.set(request.id, requestTotals(liveItems(request, state.events)));
    }
    return map;
  }, [state.events]);

  const pendingForTeacher = useMemo(() => {
    if (!user?.teacherId && user?.role !== "admin") return [];
    return state.events.filter((e) => {
      if (!isOpenReview(e.status)) return false;
      if (user.role === "admin") return true;
      return e.teacherId === user.teacherId;
    });
  }, [state.events, user]);

  const myEvents = useMemo(
    () => (user ? state.events.filter((e) => e.actorId === user.id) : []),
    [state.events, user],
  );

  return {
    ...state,
    extras: state.events,
    user,
    signIn,
    signInAs,
    signOut,
    signUp,
    submitInPerson,
    submitWishlist,
    reviewEvent,
    closeNotice,
    resetSession,
    liveByRequest,
    pendingForTeacher,
    myEvents,
  };
}

function isOpenReview(status: FulfillmentStatus) {
  return status === "submitted" || status === "under_review";
}

const AppContext = createContext<ReturnType<typeof useAppStore> | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const store = useAppStore();
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
