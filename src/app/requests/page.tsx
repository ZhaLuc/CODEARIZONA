"use client";

import { RequestCard } from "@/components/RequestCard";
import { SourceTag } from "@/components/ui";
import { allHydrated } from "@/lib/catalog";
import { useDemo } from "@/lib/store";

export default function RequestsPage() {
  const { extras } = useDemo();
  const rows = allHydrated(extras);

  return (
    <div className="space-y-6">
      <SourceTag kind="demo" />
      <h1 className="display text-5xl">Open remaining needs</h1>
      <p className="max-w-2xl text-ink-soft">
        Each card is the leftover count. Closed construction paper does not close unfinished notebooks. That is the difference between a funded project and a remaining need.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((r) => (
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
  );
}
