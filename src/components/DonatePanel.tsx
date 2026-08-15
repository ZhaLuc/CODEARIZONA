"use client";

import { useState } from "react";
import { useDemo } from "@/lib/store";
import type { LiveItem } from "@/lib/fulfillment";
import { ItemLedger } from "./ItemLedger";

export function ClosePanel({
  requestId,
  items,
  accepting,
}: {
  requestId: string;
  items: LiveItem[];
  accepting: boolean;
}) {
  const open = items.filter((i) => i.remaining > 0);
  const [itemId, setItemId] = useState(open[0]?.id ?? items[0]?.id);
  const [qty, setQty] = useState(5);
  const [message, setMessage] = useState<string | null>(null);
  const { contribute } = useDemo();
  const selected = items.find((i) => i.id === itemId);

  function close(n?: number) {
    if (!selected) return;
    const amount = n ?? qty;
    const result = contribute(requestId, selected.id, amount);
    setMessage(result.message);
    if (result.ok && selected.remaining - (result.quantity ?? 0) <= 0) {
      const next = items.find((i) => i.id !== selected.id && i.remaining > 0);
      if (next) setItemId(next.id);
    }
  }

  if (!accepting) {
    return (
      <div className="rounded-3xl border border-line p-6">
        <p className="display text-2xl">Not accepting items</p>
        <p className="mt-2 text-sm text-ink-soft">This classroom is not taking new items right now.</p>
      </div>
    );
  }

  if (open.length === 0) {
    return (
      <div className="rounded-3xl border border-juniper/30 bg-[color:var(--mist)] p-6">
        <p className="display text-2xl">Every line is closed</p>
        <p className="mt-2 text-sm text-ink-soft">Reset the demo to walk 8 / 20 → 13 / 20 again.</p>
      </div>
    );
  }

  return (
    <div id="close" className="rounded-3xl border border-line bg-[color:var(--paper)] p-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Demo fulfillment</p>
      <h3 className="display mt-1 text-3xl">Close part of the remaining need</h3>
      <p className="mt-2 text-sm text-ink-soft">
        No payment in this prototype. The ledger updates immediately. Excess quantity is clamped to what is still needed.
      </p>
      <label className="mt-5 block text-sm">
        Item still open
        <select
          className="mt-1 w-full rounded-2xl border border-line bg-transparent px-3 py-2"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
        >
          {items.map((i) => (
            <option key={i.id} value={i.id} disabled={i.remaining === 0}>
              {i.name} — {i.remaining} remaining
            </option>
          ))}
        </select>
      </label>
      {selected && (
        <div className="mt-4">
          <ItemLedger item={selected} />
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {[1, 5, selected?.remaining ?? 0]
          .filter((n, i, a) => n > 0 && a.indexOf(n) === i)
          .map((n) => (
            <button
              key={n}
              onClick={() => {
                setQty(n);
                close(n);
              }}
              className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-sand"
            >
              {n === selected?.remaining ? `Close remaining ${n}` : `Close ${n} of ${selected?.remaining}`}
            </button>
          ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={selected?.remaining ?? 1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-24 rounded-2xl border border-line bg-transparent px-3 py-2"
        />
        <button onClick={() => close()} className="rounded-full bg-ink px-5 py-2 text-sm text-[color:var(--paper)]">
          Close this many
        </button>
      </div>
      {message && <p className="mt-3 text-sm text-juniper">{message}</p>}
    </div>
  );
}

export function FulfillmentNotice() {
  const { noticeOpen, closeNotice, lastAction } = useDemo();
  if (!noticeOpen || !lastAction) return null;
  return (
    <div className="fixed bottom-24 left-1/2 z-[60] w-[min(92vw,420px)] -translate-x-1/2 rounded-3xl border border-line bg-[color:var(--paper)] p-4 shadow-[var(--shadow)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Need updated · simulated shipping</p>
      <p className="display mt-1 text-2xl">
        {lastAction.before} / {lastAction.needed} → {lastAction.after} / {lastAction.needed}
      </p>
      <p className="mt-1 text-sm">
        You closed {lastAction.quantity} {lastAction.itemName.toLowerCase()}. {lastAction.remainingAfter} remaining.
      </p>
      <p className="mt-2 text-xs text-ink-soft">
        Shipping would go to the school fulfillment path, never a home address. No real order was placed.
      </p>
      <button onClick={closeNotice} className="mt-3 rounded-full bg-ink px-4 py-1.5 text-sm text-[color:var(--paper)]">
        Keep looking at the ledger
      </button>
    </div>
  );
}
