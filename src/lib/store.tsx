"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { requests as seedRequests } from "@/data/requests";
import { clampGift, liveItems, requestTotals } from "./fulfillment";
import type { DemoContribution } from "./types";

const KEY = "meridian-demo-v1";

type DemoState = {
  contributions: DemoContribution[];
  role: "neighbor" | "teacher";
  teacherId: string;
  shippingOpen: boolean;
  lastGift: DemoContribution | null;
};

const initial: DemoState = {
  contributions: [],
  role: "neighbor",
  teacherId: "teacher-maria",
  shippingOpen: false,
  lastGift: null,
};

let memory = load();
const listeners = new Set<() => void>();

function load(): DemoState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as DemoState;
    return { ...initial, ...parsed };
  } catch {
    return initial;
  }
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

function setState(patch: Partial<DemoState>) {
  memory = { ...memory, ...patch };
  emit();
}

export function resetDemo() {
  memory = { ...initial };
  emit();
}

export function useDemoStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const contribute = useCallback(
    (requestId: string, itemId: string, quantity: number) => {
      const request = seedRequests.find((r) => r.id === requestId);
      if (!request) return { ok: false, message: "Request not found." };
      if (!request.accepting) return { ok: false, message: "This classroom is not accepting contributions." };
      const items = liveItems(request, memory.contributions);
      const item = items.find((i) => i.id === itemId);
      if (!item) return { ok: false, message: "Item not found." };
      const gift = clampGift(item.remaining, quantity);
      if (!gift.quantity) return { ok: false, message: gift.error ?? "Could not apply that amount." };
      const row: DemoContribution = {
        requestId,
        itemId,
        quantity: gift.quantity,
        at: new Date().toISOString(),
      };
      setState({
        contributions: [...memory.contributions, row],
        lastGift: row,
        shippingOpen: true,
      });
      return {
        ok: true,
        message: gift.clamped ? gift.error : `Recorded ${gift.quantity} toward ${item.name}.`,
        quantity: gift.quantity,
      };
    },
    [],
  );

  const closeShipping = useCallback(() => setState({ shippingOpen: false }), []);
  const setRole = useCallback((role: DemoState["role"]) => setState({ role }), []);

  const liveByRequest = useMemo(() => {
    const map = new Map<string, ReturnType<typeof requestTotals>>();
    for (const request of seedRequests) {
      map.set(request.id, requestTotals(liveItems(request, state.contributions)));
    }
    return map;
  }, [state.contributions]);

  return {
    ...state,
    contribute,
    closeShipping,
    setRole,
    resetDemo,
    liveByRequest,
    extras: state.contributions,
  };
}

const DemoContext = createContext<ReturnType<typeof useDemoStore> | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const store = useDemoStore();
  return <DemoContext.Provider value={store}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
