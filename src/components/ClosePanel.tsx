"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import type { LiveItem } from "@/lib/fulfillment";
import { FieldLabel } from "./ui";

export function ClosePanel({
  requestId,
  items,
  accepting,
}: {
  requestId: string;
  items: LiveItem[];
  accepting: boolean;
}) {
  const open = items.filter((i) => i.remainingAfterPending > 0);
  const [itemId, setItemId] = useState(open.find((i) => i.id === "item-markers")?.id ?? open[0]?.id ?? items[0]?.id);
  const selected = items.find((i) => i.id === itemId);
  const defaultQty = selected && selected.remainingAfterPending >= 5 ? 5 : 1;
  const [qty, setQty] = useState(defaultQty);
  const { user } = useApp();
  const router = useRouter();
  const max = selected?.remainingAfterPending ?? 0;
  const next = `/requests/${requestId}/fulfill?item=${itemId}&qty=${qty}`;

  if (!accepting) {
    return (
      <div className="rounded-[22px] border border-line bg-surface p-6">
        <p className="display text-2xl">Not accepting items</p>
        <p className="mt-2 text-sm text-ink-soft">This classroom is not taking new items right now.</p>
      </div>
    );
  }

  if (items.every((i) => i.remaining === 0)) {
    return (
      <div className="rounded-[22px] border border-line bg-surface p-6">
        <p className="display text-2xl">Every line is closed</p>
        <p className="mt-2 text-sm text-ink-soft">Verified fulfillment has closed this request.</p>
      </div>
    );
  }

  return (
    <div id="close" className="rounded-[22px] border border-line bg-surface p-6">
      <h3 className="display text-3xl">Close part of this need</h3>
      <p className="mt-2 text-sm text-ink-soft">Choose an item. Fulfillment is counted only after the classroom confirms it.</p>
      <FieldLabel htmlFor="close-item">Item</FieldLabel>
      <select
        id="close-item"
        className="field mt-1"
        value={itemId}
        onChange={(e) => {
          setItemId(e.target.value);
          const nextItem = items.find((i) => i.id === e.target.value);
          setQty(nextItem && nextItem.remainingAfterPending >= 5 ? 5 : 1);
        }}
      >
        {items.map((i) => (
          <option key={i.id} value={i.id} disabled={i.remainingAfterPending === 0}>
            {i.name} - {i.verified} / {i.quantityNeeded} verified
          </option>
        ))}
      </select>
      {selected && (
        <p className="mt-3 text-sm text-ink-soft">
          {selected.verified} / {selected.quantityNeeded} verified
          {selected.pending > 0 ? ` · ${selected.pending} pending` : ""} · {selected.remaining} still needed
        </p>
      )}
      <div className="mt-4">
        <FieldLabel htmlFor="close-qty">How many can you close?</FieldLabel>
        <input
          id="close-qty"
          type="number"
          min={1}
          max={Math.max(1, max)}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="field mt-1 w-32"
        />
      </div>
      {user?.role === "teacher" ? (
        <p className="mt-4 text-sm text-ink-soft">Teacher accounts confirm incoming items. Use a community account to submit.</p>
      ) : user ? (
        <button type="button" className="btn btn-primary mt-4 w-full" disabled={max <= 0} onClick={() => router.push(next)}>
          Continue
        </button>
      ) : (
        <Link href={`/signin?next=${encodeURIComponent(next)}`} className="btn btn-primary mt-4 w-full">
          Sign in to close this need
        </Link>
      )}
    </div>
  );
}

export function FulfillmentNotice() {
  const { noticeOpen, closeNotice, lastAction } = useApp();
  if (!noticeOpen || !lastAction) return null;
  const verified = lastAction.kind === "verified";
  return (
    <div
      role="status"
      className="fixed bottom-5 left-1/2 z-[70] w-[min(92vw,420px)] -translate-x-1/2 rounded-[22px] border border-line bg-surface p-4 shadow-[var(--shadow-2)]"
    >
      <p className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">{verified ? "Fulfillment verified" : "Needs attention"}</p>
      <p className="display mt-1 text-2xl">
        {verified ? `${lastAction.quantity} ${lastAction.itemName.toLowerCase()} verified.` : lastAction.itemName}
      </p>
      <p className="mt-1 text-sm text-ink-soft">
        {lastAction.verified} / {lastAction.needed} verified · {lastAction.remaining} still needed
      </p>
      <button type="button" onClick={closeNotice} className="btn btn-primary mt-3 !min-h-10 text-sm">
        Keep looking at the ledger
      </button>
    </div>
  );
}
