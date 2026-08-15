"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ClosePanel } from "@/components/ClosePanel";
import { LedgerTable, NeedCount } from "@/components/ItemLedger";
import { PolicyModule } from "@/components/PolicyModule";
import { EmptyState } from "@/components/ui";
import { FulfillmentTimeline } from "@/components/WishlistPanel";
import { bills } from "@/data/bills";
import { hydrateRequest } from "@/lib/catalog";
import { formatDate, formatStamp } from "@/lib/format";
import { fulfillmentStatusLabel } from "@/lib/fulfillment";
import { useApp } from "@/lib/store";

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { extras, lastAction } = useApp();
  const row = hydrateRequest(id, extras);

  if (!row) {
    return (
      <div className="shell">
        <EmptyState title="Need unavailable" body="This classroom request is not in the current set." />
      </div>
    );
  }

  const { request, teacher, school, items, totals, history } = row;
  const related = bills.filter((b) => request.relatedBillIds.includes(b.id));
  const markers = items.find((i) => i.id === "item-markers");
  const wow = lastAction && lastAction.eventId && (lastAction.itemName === markers?.name || items.some((i) => i.name === lastAction.itemName));

  const timeline = [
    ...request.history.map((h) => ({
      id: h.id,
      label: `${h.quantity} ${request.items.find((i) => i.id === h.itemId)?.name.toLowerCase() ?? "items"} verified`,
      detail: h.donorLabel,
      date: formatDate(h.date),
      status: "verified" as const,
    })),
    ...history.map((h) => ({
      id: h.id,
      label: `${h.quantity} ${h.itemName.toLowerCase()} ${fulfillmentStatusLabel[h.status].toLowerCase()}`,
      detail: h.actorName,
      date: formatStamp(h.at),
      status: h.status,
    })),
  ];

  return (
    <div className="shell space-y-12">
      <header className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm text-ink-soft">
            {school.name} · {school.city}, Arizona
          </p>
          <h1 className="display mt-2 text-5xl leading-[0.95]">{request.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">{request.purpose}</p>
        </div>
        <div className={`rounded-[22px] border border-line bg-surface p-6 ${wow ? "need-pop" : ""}`}>
          <NeedCount remaining={totals.remaining} needed={totals.needed} verified={totals.fulfilled} pending={totals.pending} />
        </div>
      </header>

      {markers && request.id === "req-weather-lab" && (
        <section className="rounded-[22px] border border-line bg-surface p-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">Dry-erase markers</p>
          <p className="num mt-2 text-5xl md:text-6xl">
            {markers.verified} / {markers.quantityNeeded}
          </p>
          <p className="mt-2 text-lg">
            {markers.remaining === 0
              ? "This line is closed."
              : `${markers.verified} / ${markers.quantityNeeded} verified. ${markers.remaining} still needed.${markers.pending ? ` ${markers.pending} pending verification.` : ""}`}
          </p>
        </section>
      )}

      <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          <div>
            <h2 className="display text-3xl">Item ledger</h2>
            <div className="mt-4">
              <LedgerTable items={items} />
            </div>
          </div>
          <FulfillmentTimeline events={timeline} />
          <div>
            <h2 className="display text-3xl">Classroom context</h2>
            <p className="mt-3 max-w-[65ch] leading-relaxed text-ink-soft">{request.story}</p>
          </div>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24 self-start">
          <ClosePanel requestId={request.id} items={items} accepting={request.accepting} />
          <Link href={`/teachers/${teacher.id}`} className="block rounded-[22px] border border-line bg-surface p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">Classroom</p>
            <p className="mt-2 font-medium">{teacher.name}</p>
            <p className="text-sm text-ink-soft">
              {teacher.gradeLevels} · {teacher.subjects.join(" · ")}
            </p>
              <p className="mt-3 text-xs text-ink-faint">Campus location only. Home address is never shown.</p>
          </Link>
        </aside>
      </section>

      <PolicyModule requestId={request.id} bills={related} />
    </div>
  );
}
