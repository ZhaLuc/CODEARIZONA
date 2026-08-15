"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { DonatePanel } from "@/components/DonatePanel";
import { Badge, EmptyState, LedgerBar, SourceTag } from "@/components/ui";
import { bills } from "@/data/bills";
import { hydrateRequest } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import { useDemo } from "@/lib/store";

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { extras } = useDemo();
  const row = hydrateRequest(id, extras);

  if (!row) {
    return <EmptyState title="Request unavailable" body="This demonstration record is not in the seeded set, or the classroom is no longer listed." />;
  }

  const { request, teacher, school, items, totals } = row;
  const related = bills.filter((b) => request.relatedBillIds.includes(b.id));
  const markers = items.find((i) => i.id === "item-markers");

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2">
        <SourceTag kind="demo" />
        <Badge tone={request.urgency === "urgent" ? "clay" : "sand"}>
          {request.urgency === "urgent" ? "Needed now" : "Open request"}
        </Badge>
        <Badge tone="ink">{school.city}</Badge>
      </div>
      <header className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm text-ink-soft">
            {school.name} · campus location only · updated for this demo on {formatDate("2026-08-15")}
          </p>
          <h1 className="display mt-2 text-5xl leading-[0.95]">{request.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">{request.purpose}</p>
        </div>
        <div className="rounded-3xl border border-line p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Whole request</p>
          <p className="display mt-2 text-5xl">
            {totals.fulfilled}
            <span className="text-3xl text-ink-soft"> / {totals.needed}</span>
          </p>
          <p className="text-sm text-ink-soft">
            {totals.filledItems} of {totals.itemCount} line items complete · {totals.remaining} still open
          </p>
          <div className="mt-4">
            <LedgerBar fulfilled={totals.fulfilled} needed={totals.needed} />
          </div>
          <p className="mt-3 text-xs text-ink-soft">
            Overall progress does not read as fulfilled unless every item is filled. Mixed lists stay open.
          </p>
        </div>
      </header>

      {markers && request.id === "req-weather-lab" && (
        <section className="rounded-[2rem] border border-copper bg-[linear-gradient(180deg,#f7efe6,#f4efe6)] p-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-copper-deep">The remaining number</p>
          <p className="display mt-2 text-4xl md:text-6xl">
            Dry-erase markers: {markers.fulfilled} / {markers.quantityNeeded}
          </p>
          <p className="mt-2 text-lg">
            {markers.remaining === 0 ? "Markers are complete." : `${markers.remaining} still needed for lab-group whiteboards.`}
          </p>
        </section>
      )}

      <section className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div>
            <h2 className="display text-3xl">Why this classroom</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{request.story}</p>
          </div>
          <div>
            <h2 className="display text-3xl">Item by item</h2>
            <ul className="mt-4 divide-y divide-line">
              {items.map((item) => (
                <li key={item.id} className="py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">{item.name}</p>
                    <p className={item.remaining === 0 ? "text-juniper" : ""}>
                      {item.fulfilled} / {item.quantityNeeded} {item.unit === "each" ? "" : item.unit}
                    </p>
                  </div>
                  <div className="mt-2">
                    <LedgerBar fulfilled={item.fulfilled} needed={item.quantityNeeded} />
                  </div>
                  <p className="mt-2 text-sm text-ink-soft">{item.why}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="display text-3xl">Who already closed part of the gap</h2>
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
          <Link href={`/teachers/${teacher.id}`} className="block rounded-3xl border border-line p-5">
            <div className="flex items-center gap-3">
              <div
                className="grid h-12 w-12 place-items-center rounded-full text-sm text-[color:var(--paper)]"
                style={{ background: teacher.accent }}
              >
                {teacher.initials}
              </div>
              <div>
                <p className="font-medium">{teacher.name}</p>
                <p className="text-sm text-ink-soft">{teacher.gradeLevels} · {teacher.subjects.join(" · ")}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-soft">{teacher.classroom}</p>
            <p className="mt-3 text-xs">
              Verified educator badge in this prototype is seeded. {teacher.verificationNote}
            </p>
          </Link>
          <DonatePanel requestId={request.id} items={items} accepting={request.accepting} />
        </aside>
      </section>

      <section className="rounded-[2rem] border border-civic/20 bg-[color:var(--mist)] p-6">
        <div className="flex flex-wrap gap-2">
          <SourceTag kind="law" />
          <p className="text-sm text-ink-soft">Policy that touches this classroom</p>
        </div>
        <h2 className="display mt-3 text-3xl">Arizona legislation next to the remaining need</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          This is the connection DonorsChoose does not make. The supplies are local. The rules around CTE, funding, and access are statewide. Neither page is an endorsement.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {related.map((b) => (
            <Link key={b.id} href={`/bills/${b.id}`} className="rounded-3xl border border-line bg-[color:var(--paper)] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">{b.number}</p>
              <p className="display mt-1 text-2xl">{b.title}</p>
              <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{b.plainLanguage}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
