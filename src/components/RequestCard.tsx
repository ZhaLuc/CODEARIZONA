"use client";

import Link from "next/link";
import { Badge, SourceTag } from "./ui";
import { isAlmostThere } from "@/lib/fulfillment";
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
  const open = items.filter((i) => i.remaining > 0).slice(0, 3);
  const almost = items.some((i) => isAlmostThere(i.remaining, i.quantityNeeded));
  return (
    <Link
      href={`/requests/${request.id}`}
      className={`block rounded-3xl border p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)] ${
        featured ? "border-copper bg-[color:var(--paper)]" : "border-line bg-[color:var(--paper)]"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <SourceTag kind="demo" />
        {almost && <Badge tone="copper">Almost there</Badge>}
        <span className="text-xs text-ink-soft">
          {school.name} · {school.city}
        </span>
      </div>
      <h3 className="display mt-3 text-2xl leading-tight">{request.title}</h3>
      <p className="display mt-3 text-5xl leading-none">{remaining}</p>
      <p className="mt-1 text-sm text-ink-soft">
        items still needed · {fulfilled} of {needed} units closed
      </p>
      <ul className="mt-4 space-y-1 text-sm">
        {open.map((i) => (
          <li key={i.id} className="flex justify-between gap-3">
            <span>{i.name}</span>
            <span className="font-medium">{i.remaining}</span>
          </li>
        ))}
        {open.length === 0 && <li className="text-juniper">Every line on this need is closed.</li>}
      </ul>
      <p className="mt-4 rounded-full bg-ink px-4 py-2 text-center text-sm text-[color:var(--paper)]">
        Close part of this need
      </p>
      <p className="mt-3 text-xs text-ink-soft">
        {teacher.subjects[0]} · demo classroom · {teacher.name}
      </p>
    </Link>
  );
}
