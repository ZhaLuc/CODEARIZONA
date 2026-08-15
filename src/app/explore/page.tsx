"use client";

import { useMemo, useState } from "react";
import { NeedMapClient } from "@/components/NeedMapClient";
import { RequestCard } from "@/components/RequestCard";
import { ArizonaSilhouette } from "@/components/ArizonaSilhouette";
import { EmptyState, SourceTag } from "@/components/ui";
import { allHydrated, categories, cities } from "@/lib/catalog";
import { isAlmostThere } from "@/lib/fulfillment";
import { useDemo } from "@/lib/store";
import type { MapPoint } from "@/components/NeedMap";

export default function ExplorePage() {
  const { extras } = useDemo();
  const rows = allHydrated(extras);
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState("");
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [almostOnly, setAlmostOnly] = useState(false);

  const filtered = rows.filter((r) => {
    if (city && r.school.city !== city) return false;
    if (category && r.request.category !== category) return false;
    if (urgency && r.request.urgency !== urgency) return false;
    if (priorityOnly && r.priority < 6) return false;
    if (almostOnly && !r.items.some((i) => isAlmostThere(i.remaining, i.quantityNeeded))) return false;
    return true;
  });

  const points: MapPoint[] = useMemo(
    () =>
      filtered.map((r) => ({
        school: r.school,
        remaining: r.totals.remaining,
        fulfilled: r.totals.fulfilled,
        needed: r.totals.needed,
        urgency: r.request.urgency,
        priority: r.priority,
        request: r.request,
        teacher: r.teacher,
        openLines: r.items
          .filter((i) => i.remaining > 0)
          .map((i) => ({ name: i.name, remaining: i.remaining })),
      })),
    [filtered],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of rows) c[r.school.city] = (c[r.school.city] ?? 0) + r.totals.remaining;
    return c;
  }, [rows]);

  const focus = city
    ? ([
        rows.find((r) => r.school.city === city)?.school.lat ?? 34.15,
        rows.find((r) => r.school.city === city)?.school.lng ?? -111.7,
      ] as [number, number])
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex gap-2">
            <SourceTag kind="demo" />
          </div>
          <h1 className="display mt-2 text-5xl">Where are classroom needs still open?</h1>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Markers are remaining item counts at school campuses. Phoenix, Tucson, Yuma, Window Rock, Page, Nogales, Flagstaff, Kingman, Payson — the pin is the leftover number, not a school logo.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <select className="rounded-full border border-line bg-transparent px-3 py-2 text-sm" value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className="rounded-full border border-line bg-transparent px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className="rounded-full border border-line bg-transparent px-3 py-2 text-sm" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
          <option value="">Any urgency</option>
          <option value="urgent">Needed now</option>
          <option value="needed">Open request</option>
        </select>
        <label className="flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm">
          <input type="checkbox" checked={almostOnly} onChange={(e) => setAlmostOnly(e.target.checked)} />
          Almost there
        </label>
        <label className="flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm">
          <input type="checkbox" checked={priorityOnly} onChange={(e) => setPriorityOnly(e.target.checked)} />
          Needs priority
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="rounded-3xl border border-line bg-[color:var(--paper-2)] p-3">
          <ArizonaSilhouette selected={city || undefined} onSelect={(c) => setCity(c === city ? "" : c)} counts={counts} />
        </div>
        <div className="h-[520px] overflow-hidden rounded-3xl border border-line">
          <NeedMapClient points={points} focus={focus} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No remaining need in that slice"
          body="Clear Almost there, or look at Fort Defiance, Page, Payson, Kingman, Yuma, and Nogales."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((r) => (
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
      )}
    </div>
  );
}
