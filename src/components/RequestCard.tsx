"use client";

import Link from "next/link";
import { Badge, LedgerBar, SourceTag } from "./ui";
import type { LiveItem } from "@/lib/fulfillment";
import type { ClassroomRequest, School, Teacher } from "@/lib/types";

export function RequestCard({
  request,
  teacher,
  school,
  items,
  remaining,
  fulfilled,
  needed,
  featured,
}: {
  request: ClassroomRequest;
  teacher: Teacher;
  school: School;
  items: LiveItem[];
  remaining: number;
  fulfilled: number;
  needed: number;
  featured?: boolean;
}) {
  const topOpen = items.filter((i) => i.remaining > 0)[0];
  return (
    <Link
      href={`/requests/${request.id}`}
      className={`block rounded-3xl border p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)] ${
        featured ? "border-copper bg-[color:var(--paper)]" : "border-line bg-[color:var(--paper)]"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <SourceTag kind="demo" />
        <Badge tone={request.urgency === "urgent" ? "clay" : "sand"}>
          {request.urgency === "urgent" ? "Needed now" : "Open request"}
        </Badge>
        <span className="text-xs text-ink-soft">
          {school.city} · {school.name}
        </span>
      </div>
      <h3 className="display mt-3 text-2xl leading-tight">{request.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{request.purpose}</p>
      <div className="mt-4">
        <LedgerBar fulfilled={fulfilled} needed={needed} />
      </div>
      {topOpen ? (
        <p className="mt-3 text-sm">
          <span className="font-medium">{topOpen.remaining}</span> {topOpen.name.toLowerCase()} still needed
          {remaining > topOpen.remaining ? ` · ${remaining} items open in this request` : ""}
        </p>
      ) : (
        <p className="mt-3 text-sm text-juniper">This request is fulfilled.</p>
      )}
      <p className="mt-2 text-xs text-ink-soft">
        {teacher.name} · {teacher.subjects[0]}
      </p>
    </Link>
  );
}
