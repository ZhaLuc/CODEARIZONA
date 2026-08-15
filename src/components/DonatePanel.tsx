"use client";

import { useState } from "react";
import { useDemo } from "@/lib/store";
import type { LiveItem } from "@/lib/fulfillment";
import { LedgerBar } from "./ui";

export function DonatePanel({
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

  function give(n?: number) {
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
        <p className="display text-2xl">Not accepting contributions</p>
        <p className="mt-2 text-sm text-ink-soft">This classroom is not taking new items right now.</p>
      </div>
    );
  }

  if (open.length === 0) {
    return (
      <div className="rounded-3xl border border-juniper/30 bg-[color:var(--mist)] p-6">
        <p className="display text-2xl">This request is fulfilled</p>
        <p className="mt-2 text-sm text-ink-soft">Every listed item has been matched. Reset the demo to walk the flow again.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-[color:var(--paper)] p-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Demo contribution</p>
      <h3 className="display mt-1 text-3xl">Close part of the gap</h3>
      <p className="mt-2 text-sm text-ink-soft">
        No payment in this prototype. Choosing a quantity updates remaining need immediately, the way a real contribution would.
      </p>
      <label className="mt-5 block text-sm">
        Item
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
          <LedgerBar fulfilled={selected.fulfilled} needed={selected.quantityNeeded} />
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {[1, 5, 8, selected?.remaining ?? 0].filter((n, i, a) => n > 0 && a.indexOf(n) === i).map((n) => (
          <button
            key={n}
            onClick={() => {
              setQty(n);
              give(n);
            }}
            className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-sand"
          >
            {n === selected?.remaining ? `Give remaining ${n}` : `Give ${n}`}
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
        <button onClick={() => give()} className="rounded-full bg-ink px-5 py-2 text-sm text-[color:var(--paper)]">
          Record demo gift
        </button>
      </div>
      {message && <p className="mt-3 text-sm text-juniper">{message}</p>}
    </div>
  );
}

export function ShippingModal() {
  const { shippingOpen, closeShipping, lastGift } = useDemo();
  if (!shippingOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[color:var(--ink)]/40 p-4">
      <div className="max-w-md rounded-3xl bg-[color:var(--paper)] p-6 shadow-[var(--shadow)]">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Simulated fulfillment</p>
        <h3 className="display mt-1 text-3xl">Ship through the school, not the teacher’s home</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          In production, Meridian would collect shipping privately and send to the verified school fulfillment path. The public never sees a home address. This prototype does not place a real order
          {lastGift ? ` · demo quantity ${lastGift.quantity}` : ""}.
        </p>
        <button onClick={closeShipping} className="mt-5 rounded-full bg-ink px-4 py-2 text-sm text-[color:var(--paper)]">
          Continue
        </button>
      </div>
    </div>
  );
}
