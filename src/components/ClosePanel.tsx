"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
  const [itemId, setItemId] = useState(open[0]?.id ?? items[0]?.id);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { submitInPerson, user } = useApp();
  const selected = items.find((i) => i.id === itemId);
  const max = selected?.remainingAfterPending ?? 0;

  function submit() {
    if (!selected) return;
    const result = submitInPerson(requestId, selected.id, qty);
    if (result.ok) {
      setError(null);
      setMessage(result.message);
    } else {
      setMessage(null);
      setError(result.message);
    }
  }

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
      <p className="mt-2 text-sm text-ink-soft">
        Submitting does not raise the verified count. The teacher confirms the items arrived first.
      </p>
      <FieldLabel htmlFor="close-item">Item</FieldLabel>
      <select
        id="close-item"
        className="field mt-1"
        value={itemId}
        onChange={(e) => {
          setItemId(e.target.value);
          setQty(1);
          setError(null);
        }}
      >
        {items.map((i) => (
          <option key={i.id} value={i.id} disabled={i.remainingAfterPending === 0}>
            {i.name} - {i.remainingAfterPending} remaining after pending
          </option>
        ))}
      </select>
      {selected && (
        <p className="mt-3 text-sm text-ink-soft">
          Verified {selected.verified} / {selected.quantityNeeded}
          {selected.pending > 0 ? ` · ${selected.pending} pending` : ""} · {selected.remaining} still needed
        </p>
      )}
      <div className="mt-4">
        <FieldLabel htmlFor="close-qty" error={error && !user ? undefined : error ?? undefined}>
          How many can you close?
        </FieldLabel>
        <input
          id="close-qty"
          type="number"
          min={1}
          max={Math.max(1, max)}
          value={qty}
          aria-invalid={Boolean(error)}
          onChange={(e) => {
            setQty(Number(e.target.value));
            setError(null);
          }}
          className="field mt-1 w-32"
        />
      </div>
      {user ? (
        <button type="button" onClick={submit} disabled={max <= 0} className="btn btn-primary mt-4 w-full">
          Close this need
        </button>
      ) : (
        <Link href={`/signin?next=/requests/${requestId}%23close`} className="btn btn-primary mt-4 w-full">
          Sign in to close this need
        </Link>
      )}
      {user?.role === "teacher" && (
        <p className="mt-3 text-sm text-ink-soft">Teacher accounts verify incoming items. Use a community account to submit fulfillment.</p>
      )}
      {error && user && <p className="mt-3 text-sm text-danger">{error}</p>}
      {message && <p className="mt-3 text-sm text-verified">{message}</p>}
    </div>
  );
}

export function FulfillmentNotice() {
  const { noticeOpen, closeNotice, lastAction } = useApp();
  const copy = useMemo(() => {
    if (!lastAction) return null;
    if (lastAction.kind === "submitted") {
      return {
        kicker: "Pending verification",
        title: `${lastAction.quantity} ${lastAction.itemName.toLowerCase()} submitted`,
        body: `Verified stays ${lastAction.verified} / ${lastAction.needed}. ${lastAction.pending} pending. ${lastAction.remainingAfterPending} still needed after pending fulfillment.`,
      };
    }
    if (lastAction.kind === "verified") {
      return {
        kicker: "Fulfillment verified",
        title: `${lastAction.verified} / ${lastAction.needed}`,
        body: `${lastAction.remaining} still needed. Promises never counted. Verified arrival did.`,
      };
    }
    return {
      kicker: "Needs attention",
      title: `${lastAction.itemName} was not verified`,
      body: `Verified count stays ${lastAction.verified} / ${lastAction.needed}.`,
    };
  }, [lastAction]);

  if (!noticeOpen || !lastAction || !copy) return null;
  return (
    <div
      role="status"
      className="fixed bottom-5 left-1/2 z-[var(--z-toast)] w-[min(92vw,420px)] -translate-x-1/2 rounded-[22px] border border-line bg-surface p-4 shadow-[var(--shadow-2)]"
    >
      <p className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">{copy.kicker}</p>
      <p className="display mt-1 text-2xl">{copy.title}</p>
      <p className="mt-1 text-sm text-ink-soft">{copy.body}</p>
      <button type="button" onClick={closeNotice} className="btn btn-primary mt-3 !min-h-10 text-sm">
        Keep looking at the ledger
      </button>
    </div>
  );
}
