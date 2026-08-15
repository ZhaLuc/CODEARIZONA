import type { ClassroomRequest, DemoContribution, RequestItem } from "./types";

export type LiveItem = RequestItem & {
  fulfilled: number;
  remaining: number;
  status: "open" | "partial" | "fulfilled";
  pct: number;
};

export function itemProgress(item: RequestItem, extra = 0): LiveItem {
  const fulfilled = Math.min(item.quantityNeeded, item.quantitySeedFulfilled + extra);
  const remaining = Math.max(0, item.quantityNeeded - fulfilled);
  const pct = item.quantityNeeded === 0 ? 100 : Math.round((fulfilled / item.quantityNeeded) * 100);
  const status = remaining === 0 ? "fulfilled" : fulfilled === 0 ? "open" : "partial";
  return { ...item, fulfilled, remaining, status, pct };
}

export function extrasFor(contributions: DemoContribution[], requestId: string, itemId: string) {
  return contributions
    .filter((c) => c.requestId === requestId && c.itemId === itemId)
    .reduce((sum, c) => sum + c.quantity, 0);
}

export function liveItems(request: ClassroomRequest, contributions: DemoContribution[]): LiveItem[] {
  return request.items.map((item) => itemProgress(item, extrasFor(contributions, request.id, item.id)));
}

export function requestTotals(items: LiveItem[]) {
  const needed = items.reduce((s, i) => s + i.quantityNeeded, 0);
  const fulfilled = items.reduce((s, i) => s + i.fulfilled, 0);
  const remaining = items.reduce((s, i) => s + i.remaining, 0);
  const allFilled = items.length > 0 && items.every((i) => i.status === "fulfilled");
  const noneFilled = items.every((i) => i.fulfilled === 0);
  const pct = needed === 0 ? 0 : Math.round((fulfilled / needed) * 100);
  const status = allFilled ? "fulfilled" : noneFilled ? "open" : "partial";
  return { needed, fulfilled, remaining, pct, status, itemCount: items.length, filledItems: items.filter((i) => i.status === "fulfilled").length };
}

export function clampGift(remaining: number, requested: number) {
  if (!Number.isFinite(requested) || requested < 1) {
    return { quantity: 0, error: "Enter a whole number of 1 or more." };
  }
  const whole = Math.floor(requested);
  if (remaining <= 0) {
    return { quantity: 0, error: "This item is already fulfilled." };
  }
  if (whole > remaining) {
    return {
      quantity: remaining,
      error: `Only ${remaining} still needed. We'll apply ${remaining}.`,
      clamped: true,
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
