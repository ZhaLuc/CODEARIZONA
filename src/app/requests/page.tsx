"use client";

import { RequestCard } from "@/components/RequestCard";
import { PageHeader } from "@/components/ui";
import { allHydrated } from "@/lib/catalog";
import { useApp } from "@/lib/store";

export default function RequestsPage() {
  const { extras } = useApp();
  const rows = allHydrated(extras);

  return (
    <div className="shell space-y-8">
      <PageHeader
        title="Open remaining needs"
        body="Each card is the leftover count. Closed construction paper does not close unfinished notebooks."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((r) => (
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
    </div>
  );
}
