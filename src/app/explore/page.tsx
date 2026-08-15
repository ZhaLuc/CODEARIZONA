"use client";

import { useMemo, useState } from "react";
import { NeedMapClient } from "@/components/NeedMapClient";
import { RequestCard } from "@/components/RequestCard";
import { EmptyState, PageHeader } from "@/components/ui";
import { allHydrated, categories, cities } from "@/lib/catalog";
import { isAlmostThere } from "@/lib/fulfillment";
import { useApp } from "@/lib/store";
import type { MapPoint } from "@/components/NeedMap";

export default function ExplorePage() {
  const { extras } = useApp();
  const rows = allHydrated(extras);
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [almostOnly, setAlmostOnly] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = rows.filter((r) => {
    if (city && r.school.city !== city) return false;
    if (category && r.request.category !== category) return false;
    if (almostOnly && !r.items.some((i) => isAlmostThere(i.remaining, i.quantityNeeded))) return false;
    if (query) {
      const q = query.toLowerCase();
      const hay = `${r.school.name} ${r.school.city} ${r.request.title} ${r.teacher.name}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
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

  const focus = city
    ? ([
        rows.find((r) => r.school.city === city)?.school.lat ?? 34.15,
        rows.find((r) => r.school.city === city)?.school.lng ?? -111.7,
      ] as [number, number])
    : undefined;

  return (
    <div className="shell-wide space-y-6">
      <PageHeader title="Where needs are still open" body="Campus pins show remaining item counts. Locations are school campuses, never homes." />

      <div className="flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="map-search">
          Search locations
        </label>
        <input
          id="map-search"
          className="field max-w-xs"
          placeholder="Search school or city"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="field max-w-[180px]" value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className="field max-w-[200px]" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <label className="btn btn-secondary !min-h-11 gap-2 text-sm">
          <input type="checkbox" checked={almostOnly} onChange={(e) => setAlmostOnly(e.target.checked)} />
          Almost there
        </label>
      </div>

      <div className="isolate-map h-[min(68dvh,640px)] overflow-hidden rounded-[22px] border border-line">
        <NeedMapClient points={points} focus={focus} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No open needs found here yet." body="Clear Almost there, or look at another Arizona city." />
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
              verified={r.totals.fulfilled}
              needed={r.totals.needed}
              pending={r.totals.pending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
