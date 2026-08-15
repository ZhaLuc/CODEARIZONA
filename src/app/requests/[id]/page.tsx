"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ClosePanel } from "@/components/DonatePanel";
import { ItemLedger, NeedCount } from "@/components/ItemLedger";
import { PolicyModule } from "@/components/PolicyModule";
import { Badge, EmptyState, SourceTag } from "@/components/ui";
import { bills } from "@/data/bills";
import { hydrateRequest } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import { useDemo } from "@/lib/store";

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { extras, lastAction } = useDemo();
  const row = hydrateRequest(id, extras);

  if (!row) {
    return <EmptyState title="Need unavailable" body="This demonstration record is not in the seeded set, or the classroom is no longer listed." />;
  }

  const { request, teacher, school, items, totals } = row;
  const related = bills.filter((b) => request.relatedBillIds.includes(b.id));
  const markers = items.find((i) => i.id === "item-markers");
  const wow = lastAction && lastAction.requestId === request.id;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2">
        <SourceTag kind="demo" />
        <Badge tone="sand">Demo educator</Badge>
        <Badge tone="ink">{school.city}</Badge>
      </div>
      <header className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-sm text-ink-soft">
            {school.name} · campus location only · ledger updated {formatDate("2026-08-15")}
          </p>
          <h1 className="display mt-2 text-5xl leading-[0.95]">{request.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">{request.purpose}</p>
        </div>
        <div className="rounded-3xl border border-line p-5">
          <NeedCount remaining={totals.remaining} needed={totals.needed} fulfilled={totals.fulfilled} />
          <p className="mt-3 text-xs text-ink-soft">
            {totals.filledItems} of {totals.itemCount} lines closed. Mixed fulfillment never reads as complete.
          </p>
        </div>
      </header>

      {markers && request.id === "req-weather-lab" && (
        <section className={`rounded-[2rem] border border-copper bg-[linear-gradient(180deg,#f7efe6,#f4efe6)] p-6 ${wow && lastAction.itemId === "item-markers" ? "need-pop" : ""}`}>
          <p className="text-[11px] uppercase tracking-[0.18em] text-copper-deep">The remaining number</p>
          {wow && lastAction.itemId === "item-markers" ? (
            <>
              <p className="display mt-2 text-4xl md:text-6xl">
                {lastAction.before} / {lastAction.needed}
                <span className="mx-3 text-3xl text-ink-soft">→</span>
                {lastAction.after} / {lastAction.needed}
              </p>
              <p className="mt-2 text-lg">
                You closed {lastAction.quantity}. {lastAction.remainingAfter} dry-erase markers still needed.
              </p>
            </>
          ) : (
            <>
              <p className="display mt-2 text-4xl md:text-6xl">
                Dry-erase markers: {markers.fulfilled} / {markers.quantityNeeded}
              </p>
              <p className="mt-2 text-lg">
                {markers.remaining === 0 ? "This line is closed." : `${markers.remaining} still needed for lab-group whiteboards.`}
              </p>
            </>
          )}
        </section>
      )}

      <section className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div>
            <h2 className="display text-3xl">Item ledger</h2>
            <ul className="mt-4 divide-y divide-line">
              {items.map((item) => (
                <li key={item.id} className="py-4">
                  <ItemLedger item={item} emphasize={lastAction?.itemId === item.id} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="display text-3xl">Classroom context</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{request.story}</p>
          </div>
          <div>
            <h2 className="display text-3xl">Who already closed part of this</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {request.history.map((h) => {
                const item = request.items.find((i) => i.id === h.itemId);
                return (
                  <li key={h.id} className="flex justify-between gap-4 border-b border-line py-2">
                    <span>
                      {h.donorLabel} · {item?.name}
                    </span>
                    <span>
                      +{h.quantity} · {formatDate(h.date)}
                    </span>
                  </li>
                );
              })}
              {extras
                .filter((c) => c.requestId === request.id)
                .map((c, i) => {
                  const item = request.items.find((it) => it.id === c.itemId);
                  return (
                    <li key={`${c.at}-${i}`} className="flex justify-between gap-4 border-b border-line py-2 text-juniper">
                      <span>You (demo) · {item?.name}</span>
                      <span>+{c.quantity}</span>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        <aside className="space-y-4">
          <ClosePanel requestId={request.id} items={items} accepting={request.accepting} />
          <Link href={`/teachers/${teacher.id}`} className="block rounded-3xl border border-line p-5">
            <Badge tone="sand">Demo educator</Badge>
            <p className="mt-2 font-medium">{teacher.name}</p>
            <p className="text-sm text-ink-soft">
              {teacher.gradeLevels} · {teacher.subjects.join(" · ")}
            </p>
            <p className="mt-3 text-sm text-ink-soft">{teacher.classroom}</p>
            <p className="mt-3 text-xs text-ink-soft">Fictional teacher at a public campus pin. Home address is never shown.</p>
          </Link>
        </aside>
      </section>

      <PolicyModule requestId={request.id} bills={related} />
    </div>
  );
}
