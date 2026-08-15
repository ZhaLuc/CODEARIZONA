"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArizonaSilhouette } from "@/components/ArizonaSilhouette";
import { RequestCard } from "@/components/RequestCard";
import { Badge, SourceTag, Stat } from "@/components/ui";
import { bills } from "@/data/bills";
import { allHydrated } from "@/lib/catalog";
import { billStatusLabel } from "@/lib/format";
import { useDemo } from "@/lib/store";

export default function HomePage() {
  const { extras } = useDemo();
  const [city, setCity] = useState<string | undefined>("Phoenix");
  const rows = allHydrated(extras);
  const featured = rows.find((r) => r.request.id === "req-weather-lab")!;
  const nearby = rows.filter((r) => r.school.city === city).slice(0, 3);
  const remainingAll = rows.reduce((s, r) => s + r.totals.remaining, 0);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of rows) {
      c[r.school.city] = (c[r.school.city] ?? 0) + r.totals.remaining;
    }
    return c;
  }, [rows]);

  return (
    <div className="space-y-16 pb-10">
      <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="flex flex-wrap gap-2">
            <SourceTag kind="demo" />
            <Badge tone="civic">Bills sourced from azleg.gov</Badge>
          </div>
          <h1 className="display mt-4 text-5xl leading-[0.95] md:text-7xl">
            See exactly what Arizona classrooms still need.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Meridian maps remaining classroom needs to the communities around them — then shows the education policy that shapes those classrooms. Help a science lab this week. Read the bill that touches it.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/explore" className="rounded-full bg-ink px-5 py-3 text-[color:var(--paper)]">
              Find a classroom near you
            </Link>
            <Link href="/requests/req-weather-lab" className="rounded-full border border-line px-5 py-3">
              Open the weather lab
            </Link>
            <Link href="/bills/hb-2316" className="rounded-full border border-line px-5 py-3">
              Read HB 2316
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-line bg-[color:var(--paper-2)] p-4">
          <div className="flex items-center justify-between px-2 text-xs uppercase tracking-[0.16em] text-ink-soft">
            <span>Arizona remaining need</span>
            <span>{remainingAll} items open</span>
          </div>
          <div className="h-[360px]">
            <ArizonaSilhouette selected={city} onSelect={setCity} counts={counts} />
          </div>
          <p className="px-2 text-xs text-ink-soft">
            Pins are school campuses, not homes. Click a city. {city} currently shows {counts[city ?? ""] ?? 0} remaining items in this prototype.
          </p>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <Stat k="Open items remaining" v={String(remainingAll)} hint="Prototype sample · seeded classrooms" />
        <Stat k="Campuses on the map" v="14" hint="Public school locations · fictional teachers" />
        <Stat k="Education bills" v={String(bills.length)} hint="Real legislation · last verified Aug 15, 2026" />
        <Stat k="Partial fulfillment" v="Item by item" hint="A request is not done until every line is" />
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">The 60-second story</p>
          <h2 className="display mt-2 text-4xl">Maria still needs 12 dry-erase markers.</h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            7th grade science at Isaac Middle School in Phoenix. The weather lab is already partly filled — construction paper is done, markers are not. That remaining number is the product.
          </p>
          <div className="mt-6">
            <RequestCard
              featured
              request={featured.request}
              teacher={featured.teacher}
              school={featured.school}
              items={featured.items}
              remaining={featured.totals.remaining}
              fulfilled={featured.totals.fulfilled}
              needed={featured.totals.needed}
            />
          </div>
        </div>
        <aside className="rounded-3xl border border-line p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Why this is not a clone</p>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed">
            <li>DonorsChoose funds projects. Meridian tracks remaining physical items, including partial gifts.</li>
            <li>Amazon wishlists are private links. Meridian is a public Arizona map of outstanding need.</li>
            <li>azleg.gov publishes bills. Meridian attaches the relevant bill to the classroom it would actually touch.</li>
          </ul>
        </aside>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="display text-4xl">Near {city}</h2>
            <p className="text-ink-soft">Demonstration classrooms at public campus locations.</p>
          </div>
          <Link href="/explore" className="text-sm underline decoration-line underline-offset-4">
            Open the live map
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(nearby.length ? nearby : rows.slice(0, 3)).map((r) => (
            <RequestCard
              key={r.request.id}
              request={r.request}
              teacher={r.teacher}
              school={r.school}
              items={r.items}
              remaining={r.totals.remaining}
              fulfilled={r.totals.fulfilled}
              needed={r.totals.needed}
            />
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-civic/20 bg-[color:var(--mist)] p-8">
        <div className="flex flex-wrap items-center gap-2">
          <SourceTag kind="law" />
          <p className="text-xs text-ink-soft">Last verified August 15, 2026</p>
        </div>
        <h2 className="display mt-3 text-4xl">The same map has a legislature.</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Classroom needs do not happen in a vacuum. Arizona education bills change funding, CTE, special education access, and curriculum. Meridian explains them in plain English and sends you to official contact pages — never a partisan script.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {bills.slice(0, 3).map((b) => (
            <Link key={b.id} href={`/bills/${b.id}`} className="rounded-3xl border border-line bg-[color:var(--paper)] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">
                {b.number} · {billStatusLabel[b.status]}
              </p>
              <p className="display mt-2 text-2xl leading-tight">{b.title}</p>
              <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{b.plainLanguage}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
