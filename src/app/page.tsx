"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArizonaSilhouette } from "@/components/ArizonaSilhouette";
import { RequestCard } from "@/components/RequestCard";
import { Badge, SourceTag, Stat } from "@/components/ui";
import { allHydrated } from "@/lib/catalog";
import { useDemo } from "@/lib/store";

export default function HomePage() {
  const { extras, lastAction } = useDemo();
  const [city, setCity] = useState<string | undefined>("Phoenix");
  const rows = allHydrated(extras);
  const featured = rows.find((r) => r.request.id === "req-weather-lab")!;
  const nearby = rows.filter((r) => r.school.city === city).slice(0, 3);
  const remainingAll = rows.reduce((s, r) => s + r.totals.remaining, 0);
  const markers = featured.items.find((i) => i.id === "item-markers")!;
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of rows) {
      c[r.school.city] = (c[r.school.city] ?? 0) + r.totals.remaining;
    }
    return c;
  }, [rows]);
  const popped = lastAction?.itemId === "item-markers";

  return (
    <div className="space-y-16 pb-10">
      <section className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="flex flex-wrap gap-2">
            <SourceTag kind="demo" />
            <Badge tone="civic">Policy pages: real azleg.gov sources</Badge>
          </div>
          <h1 className="display mt-4 text-5xl leading-[0.95] md:text-7xl">See what’s still missing. Close part of it.</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Meridian is a remaining-need ledger for Arizona classrooms — item by item, campus by campus — with the state education policy that sits behind that classroom. Not a fundraising goal. The number that is still open.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/requests/req-weather-lab#close" className="rounded-full bg-ink px-5 py-3 text-[color:var(--paper)]">
              Close 5 of {markers.remaining} remaining markers
            </Link>
            <Link href="/explore" className="rounded-full border border-line px-5 py-3">
              Where needs are still open
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-copper bg-[color:var(--paper)] p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-copper-deep">The whole product, one screen</p>
          <p className="mt-2 text-xs text-ink-soft">Isaac Middle School · Phoenix · campus only · demo classroom</p>
          <h2 className="display mt-2 text-3xl leading-tight">Weather & Climate Lab</h2>
          <p className={`display mt-4 text-6xl leading-none ${popped ? "need-pop" : ""}`}>
            {markers.fulfilled} / {markers.quantityNeeded}
          </p>
          <p className="mt-2 text-lg">{markers.remaining} dry-erase markers still needed</p>
          <ul className="mt-4 space-y-1 text-sm">
            {featured.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3 border-b border-line py-1">
                <span>{i.name}</span>
                <span className={i.remaining === 0 ? "text-juniper" : "font-medium"}>{i.remaining === 0 ? "Closed" : i.remaining}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-ink-soft">
            {featured.totals.fulfilled} of {featured.totals.needed} units closed · request stays open because lines remain
          </p>
          <Link href="/requests/req-weather-lab#close" className="mt-4 block rounded-full bg-ink px-4 py-2 text-center text-sm text-[color:var(--paper)]">
            Close part of this need
          </Link>
          <p className="mt-4 text-xs text-ink-soft">
            Policy relevant: HB 2316 · middle-school CTE (introduced) — adjacency, not funding for this lab.{" "}
            <Link href="/bills/hb-2316" className="underline decoration-line underline-offset-4">
              Plain English
            </Link>
          </p>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <Stat k="Item units still open" v={String(remainingAll)} hint="Prototype sample · seeded classrooms" />
        <Stat k="Campuses on the ledger" v="14" hint="Public school locations · fictional teachers" />
        <Stat k="Arizona regions" v="Statewide" hint="Phoenix to Window Rock, Page, Yuma, Nogales" />
        <Stat k="A mixed list" v="Stays open" hint="Closed paper does not close unfinished markers" />
      </section>

      <section className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="rounded-3xl border border-line bg-[color:var(--paper-2)] p-3">
          <p className="px-2 text-[11px] uppercase tracking-[0.16em] text-ink-soft">Where remaining need is open</p>
          <div className="h-[300px]">
            <ArizonaSilhouette selected={city} onSelect={setCity} counts={counts} />
          </div>
        </div>
        <div>
          <h2 className="display text-4xl">Near {city}</h2>
          <p className="text-ink-soft">Pins are remaining items at campuses, not homes.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {(nearby.length ? nearby : rows.slice(0, 2)).map((r) => (
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
        </div>
      </section>
    </div>
  );
}
