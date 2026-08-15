import type {
  ClassroomRequest,
  FulfillmentStatus,
  LiveFulfillment,
  RequestItem,
  Wishlist,
  WishlistItem,
} from "./types";

export type LiveItem = RequestItem & {
  verified: number;
  pending: number;
  remaining: number;
  remainingAfterPending: number;
  fulfilled: number;
  status: "open" | "partial" | "fulfilled";
  pct: number;
};

export const pendingStatuses: FulfillmentStatus[] = ["submitted", "under_review"];

export function isPending(status: FulfillmentStatus) {
  return pendingStatuses.includes(status);
}

export function qtyFor(
  events: LiveFulfillment[],
  match: (e: LiveFulfillment) => boolean,
  statusCheck: (e: LiveFulfillment) => boolean,
) {
  return events.filter((e) => match(e) && statusCheck(e)).reduce((sum, e) => sum + e.quantity, 0);
}

export function itemProgress(item: RequestItem, verifiedExtra = 0, pendingExtra = 0): LiveItem {
  const verified = Math.min(item.quantityNeeded, item.quantitySeedFulfilled + verifiedExtra);
  const pending = Math.max(0, Math.min(item.quantityNeeded - verified, pendingExtra));
  const remaining = Math.max(0, item.quantityNeeded - verified);
  const remainingAfterPending = Math.max(0, remaining - pending);
  const pct = item.quantityNeeded === 0 ? 100 : Math.round((verified / item.quantityNeeded) * 100);
  const status = remaining === 0 ? "fulfilled" : verified === 0 ? "open" : "partial";
  return {
    ...item,
    verified,
    pending,
    remaining,
    remainingAfterPending,
    fulfilled: verified,
    status,
    pct,
  };
}

function itemMatch(requestId: string, itemId: string) {
  return (e: LiveFulfillment) => e.requestId === requestId && e.itemId === itemId;
}

export function liveItems(request: ClassroomRequest, events: LiveFulfillment[]): LiveItem[] {
  return request.items.map((item) =>
    itemProgress(
      item,
      qtyFor(events, itemMatch(request.id, item.id), (e) => e.status === "verified"),
      qtyFor(events, itemMatch(request.id, item.id), (e) => isPending(e.status)),
    ),
  );
}

export function requestTotals(items: LiveItem[]) {
  const needed = items.reduce((s, i) => s + i.quantityNeeded, 0);
  const fulfilled = items.reduce((s, i) => s + i.verified, 0);
  const pending = items.reduce((s, i) => s + i.pending, 0);
  const remaining = items.reduce((s, i) => s + i.remaining, 0);
  const remainingAfterPending = items.reduce((s, i) => s + i.remainingAfterPending, 0);
  const allFilled = items.length > 0 && items.every((i) => i.status === "fulfilled");
  const noneFilled = items.every((i) => i.verified === 0);
  const pct = needed === 0 ? 0 : Math.round((fulfilled / needed) * 100);
  const status = allFilled ? "fulfilled" : noneFilled ? "open" : "partial";
  return {
    needed,
    fulfilled,
    pending,
    remaining,
    remainingAfterPending,
    pct,
    status,
    itemCount: items.length,
    filledItems: items.filter((i) => i.status === "fulfilled").length,
  };
}

export type LiveWishItem = WishlistItem & {
  verified: number;
  pending: number;
  remaining: number;
  remainingAfterPending: number;
};

export function liveWishlist(list: Wishlist, events: LiveFulfillment[]): LiveWishItem[] {
  return list.items.map((item) => {
    const match = (e: LiveFulfillment) => e.wishlistId === list.id && e.itemId === item.id;
    const verified = qtyFor(events, match, (e) => e.status === "verified");
    const pending = qtyFor(events, match, (e) => isPending(e.status));
    const remaining = Math.max(0, item.quantity - verified);
    return {
      ...item,
      verified,
      pending,
      remaining,
      remainingAfterPending: Math.max(0, remaining - pending),
    };
  });
}

export type LedgerState = "not-started" | "partial" | "almost" | "complete";

export function ledgerState(verified: number, needed: number): LedgerState {
  if (needed <= 0 || verified >= needed) return "complete";
  if (verified <= 0) return "not-started";
  const remaining = needed - verified;
  if (remaining <= 5 || remaining / needed <= 0.2) return "almost";
  return "partial";
}

export function isAlmostThere(remaining: number, needed: number) {
  return remaining > 0 && (remaining <= 5 || remaining / needed <= 0.2);
}

export const ledgerStateLabel: Record<LedgerState, string> = {
  "not-started": "Not started",
  partial: "Partially closed",
  almost: "Almost there",
  complete: "Closed",
};

export const fulfillmentStatusLabel: Record<FulfillmentStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  verified: "Verified",
  needs_attention: "Needs attention",
};

export function clampGift(remaining: number, requested: number) {
  if (!Number.isFinite(requested) || requested < 1) {
    return { quantity: 0, error: "Enter a whole number of 1 or more." };
  }
  const whole = Math.floor(requested);
  if (remaining <= 0) {
    return { quantity: 0, error: "This item is already closed." };
  }
  if (whole > remaining) {
    return {
      quantity: 0,
      error: `Only ${remaining} remain.`,
    };
  }
  return { quantity: whole };
}

export function priorityScore(remaining: number, urgency: string, region: string, daysOpen: number) {
  const rural =
    region.includes("Navajo") ||
    region.includes("Northern") ||
    region.includes("Rim") ||
    region.includes("Northwest") ||
    region.includes("Southwest") ||
    region.includes("Southern");
  const urgencyW = urgency === "urgent" ? 3 : urgency === "needed" ? 2 : 1;
  const ruralW = rural ? 2 : 0;
  const openW = Math.min(3, Math.floor(daysOpen / 14));
  const remainW = remaining > 20 ? 2 : remaining > 0 ? 1 : 0;
  return urgencyW + ruralW + openW + remainW;
}
