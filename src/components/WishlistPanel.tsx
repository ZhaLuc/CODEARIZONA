"use client";

import { useState } from "react";
import Link from "next/link";
import { ShippingUpload } from "@/components/ShippingUpload";
import { Badge, FieldLabel, StatusChip } from "@/components/ui";
import { liveWishlist } from "@/lib/catalog";
import { useApp } from "@/lib/store";
import type { EvidenceFile, Wishlist } from "@/lib/types";

export function WishlistPanel({ list }: { list: Wishlist }) {
  const { extras, user, submitWishlist } = useApp();
  const items = liveWishlist(list, extras);
  const [itemId, setItemId] = useState(items[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [evidence, setEvidence] = useState<EvidenceFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const selected = items.find((i) => i.id === itemId);

  function submit() {
    if (!selected) return;
    if (!evidence) {
      setError("Upload a shipping label to submit verification.");
      return;
    }
    const result = submitWishlist(list.id, selected.id, qty, evidence);
    if (result.ok) {
      setError(null);
      setMessage(result.message);
      setEvidence(null);
    } else {
      setMessage(null);
      setError(result.message);
    }
  }

  return (
    <section className="rounded-[22px] border border-line bg-surface p-6">
      <h2 className="display text-3xl">{list.title}</h2>
      <p className="mt-2 text-sm text-ink-soft">{list.intro}</p>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-[16px] bg-bg p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-ink-soft">{item.note}</p>
              </div>
              <Badge tone={item.priority === "needed" ? "accent" : "muted"}>
                {item.priority === "needed" ? "Needed" : "Nice to have"}
              </Badge>
            </div>
            <p className="mt-3 num text-sm">
              {item.quantity} needed · {item.verified} verified · {item.pending} pending · {item.remaining} remaining
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-6 border-t border-line pt-6">
        <ShippingUpload value={evidence} onChange={setEvidence} />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor="wish-item">Wishlist item</FieldLabel>
            <select id="wish-item" className="field mt-1" value={itemId} onChange={(e) => setItemId(e.target.value)}>
              {items.map((i) => (
                <option key={i.id} value={i.id} disabled={i.remainingAfterPending === 0}>
                  {i.name} - {i.remainingAfterPending} remaining after pending
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="wish-qty">How many did you purchase?</FieldLabel>
            <input
              id="wish-qty"
              type="number"
              min={1}
              max={Math.max(1, selected?.remainingAfterPending ?? 1)}
              value={qty}
              className="field mt-1"
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </div>
        </div>
        {user ? (
          <button type="button" onClick={submit} className="btn btn-primary mt-4">
            Submit shipment for verification
          </button>
        ) : (
          <Link href="/signin" className="btn btn-primary mt-4">
            Sign in to submit a shipment
          </Link>
        )}
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        {message && <p className="mt-3 text-sm text-verified">{message}</p>}
      </div>
    </section>
  );
}

export function FulfillmentTimeline({
  events,
}: {
  events: { id: string; label: string; detail: string; status?: import("@/lib/types").FulfillmentStatus; date: string }[];
}) {
  if (events.length === 0) return null;
  return (
    <section>
      <h2 className="display text-3xl">Fulfillment history</h2>
      <ul className="mt-4 space-y-3">
        {events.map((e) => (
          <li key={e.id} className="flex flex-wrap items-start justify-between gap-3 border-b border-line py-3">
            <div>
              <p className="font-medium">{e.label}</p>
              <p className="text-sm text-ink-soft">{e.detail}</p>
            </div>
            <div className="text-right">
              {e.status ? <StatusChip status={e.status} /> : null}
              <p className="mt-1 text-xs text-ink-faint">{e.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
