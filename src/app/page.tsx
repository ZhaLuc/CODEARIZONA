"use client";

import Link from "next/link";
import { RequestCard } from "@/components/RequestCard";
import { allHydrated } from "@/lib/catalog";
import { useApp } from "@/lib/store";

export default function HomePage() {
  const { extras, lastAction } = useApp();
  const rows = allHydrated(extras);
  const featured = rows.find((r) => r.request.id === "req-weather-lab")!;
  const nearby = rows.filter((r) => r.school.city === "Phoenix").slice(0, 4);
  const markers = featured.items.find((i) => i.id === "item-markers")!;
  const popped = lastAction?.itemName === markers.name;

  return (
    <div className="shell space-y-20">
      <section className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">Arizona classrooms</p>
          <h1 className="display mt-3 text-5xl leading-[0.92] md:text-7xl">See what is still missing. Close part of it.</h1>
          <p className="mt-5 max-w-[42ch] text-lg leading-relaxed text-ink-soft">
            Meridian is a remaining-need ledger. It counts verified physical fulfillment, not promises.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/requests/req-weather-lab#close" className="btn btn-primary">
              Close a need
            </Link>
            <Link href="/explore" className="btn btn-secondary">
              Where needs are still open
            </Link>
          </div>
        </div>

        <div className={`rounded-[22px] border border-line bg-surface p-6 md:p-8 ${popped ? "need-pop" : ""}`}>
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">Weather & Climate Lab</p>
          <p className="mt-2 text-sm text-ink-soft">Isaac Middle School · Phoenix, Arizona</p>
          <p className="num mt-6 text-7xl leading-none md:text-8xl">{featured.totals.remaining}</p>
          <p className="mt-2 text-lg">items still needed</p>
          <ul className="mt-6 space-y-2 text-sm">
            {featured.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3 border-b border-line py-2">
                <span>{i.name}</span>
                <span className={i.remaining === 0 ? "text-verified" : "num font-medium"}>
                  {i.remaining === 0 ? "Closed" : `${i.remaining} remaining`}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-soft">
            {markers.verified} / {markers.quantityNeeded} markers verified
            {markers.pending > 0 ? ` · ${markers.pending} pending` : ""}
          </p>
          <Link href="/requests/req-weather-lab#close" className="btn btn-primary mt-5 w-full">
            Close a need
          </Link>
          <p className="mt-4 text-xs text-ink-faint">
            Policy relevant to this classroom: HB 2316, middle-school CTE (introduced). Adjacency, not funding.{" "}
            <Link href="/bills/hb-2316" className="underline underline-offset-4">
              Plain English
            </Link>
          </p>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-4xl">Open needs in Phoenix</h2>
          <Link href="/explore" className="text-sm text-ink-soft hover:text-ink">
            Explore Arizona
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {nearby.map((r) => (
            <RequestCard
              key={r.request.id}
              request={r.request}
              teacher={r.teacher}
              school={r.school}
              items={r.items}
              remaining={r.totals.remaining}
              verified={r.totals.fulfilled}
              needed={r.totals.needed}
              pending={r.totals.pending}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
