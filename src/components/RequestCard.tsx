"use client";

import Link from "next/link";
import { Badge } from "./ui";
import { isAlmostThere } from "@/lib/fulfillment";
import type { LiveItem } from "@/lib/fulfillment";
import type { ClassroomRequest, School, Teacher } from "@/lib/types";

export function RequestCard({
  request,
  teacher,
  school,
  items,
  remaining,
  verified,
  needed,
  pending,
}: {
  request: ClassroomRequest;
  teacher: Teacher;
  school: School;
  items: LiveItem[];
  remaining: number;
  verified: number;
  needed: number;
  pending?: number;
}) {
  const open = items.filter((i) => i.remaining > 0).slice(0, 3);
  const almost = items.some((i) => isAlmostThere(i.remaining, i.quantityNeeded));
  return (
    <Link
      href={`/requests/${request.id}`}
      className="block rounded-[22px] border border-line bg-surface p-5 transition duration-200 ease-[var(--ease)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-2)]"
    >
      <div className="flex flex-wrap items-center gap-2">
        {almost && remaining > 0 && <Badge tone="accent">Almost there</Badge>}
        <span className="text-xs text-ink-faint">
          {school.name} · {school.city}
        </span>
      </div>
      <h3 className="display mt-3 text-2xl leading-tight">{request.title}</h3>
      <p className="num mt-4 text-5xl leading-none">{remaining}</p>
      <p className="mt-1 text-sm text-ink-soft">
        items still needed · {verified} of {needed} verified
        {pending ? ` · ${pending} pending` : ""}
      </p>
      <ul className="mt-4 space-y-1 text-sm">
        {open.map((i) => (
          <li key={i.id} className="flex justify-between gap-3">
            <span>{i.name}</span>
            <span className="num font-medium">{i.remaining}</span>
          </li>
        ))}
        {open.length === 0 && <li className="text-verified">Every line on this need is closed.</li>}
      </ul>
      <p className="btn btn-primary mt-5 w-full text-sm">Close part of this need</p>
      <p className="mt-3 text-xs text-ink-faint">
        {teacher.subjects[0]} · {teacher.name}
      </p>
    </Link>
  );
}
