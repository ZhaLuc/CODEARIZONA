"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { RequestCard } from "@/components/RequestCard";
import { Badge, EmptyState, SourceTag } from "@/components/ui";
import { hydrateRequest, teacherById, schoolById, requestsByTeacher, wishlistByTeacher } from "@/lib/catalog";
import { useDemo } from "@/lib/store";

export default function TeacherPage() {
  const { id } = useParams<{ id: string }>();
  const { extras } = useDemo();
  const teacher = teacherById(id);
  const school = teacher ? schoolById(teacher.schoolId) : undefined;
  const reqs = requestsByTeacher(id);
  const wish = wishlistByTeacher(id);

  if (!teacher || !school) {
    return <EmptyState title="Teacher not found" body="Demonstration profiles are limited to the seeded Arizona classrooms." />;
  }

  return (
    <div className="space-y-8">
      <SourceTag kind="demo" />
      <div className="flex flex-wrap items-start gap-5">
        <div className="grid h-20 w-20 place-items-center rounded-full text-xl text-[color:var(--paper)]" style={{ background: teacher.accent }}>
          {teacher.initials}
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="juniper">Verified educator · prototype badge</Badge>
            <Badge tone="sand">{school.city}</Badge>
          </div>
          <h1 className="display mt-2 text-5xl">{teacher.name}</h1>
          <p className="mt-1 text-ink-soft">
            {teacher.subjects.join(" · ")} · {teacher.gradeLevels} · {school.name}
          </p>
          <p className="mt-3 max-w-2xl">{teacher.bio}</p>
        </div>
      </div>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-line p-5">
          <h2 className="display text-2xl">Classroom</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{teacher.classroom}</p>
          <p className="mt-3 text-xs text-ink-soft">
            Public location is the school campus in {school.city}. Home addresses are never shown. Shipping is handled as a private school fulfillment path.
          </p>
        </div>
        <div className="rounded-3xl border border-line p-5">
          <h2 className="display text-2xl">Trust</h2>
          <p className="mt-2 text-sm text-ink-soft">{teacher.verificationNote}</p>
          <p className="mt-2 text-sm">School listed: {school.name} · {school.county} County</p>
        </div>
      </section>
      <section>
        <h2 className="display text-3xl">Open requests</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {reqs.map((request) => {
            const row = hydrateRequest(request.id, extras)!;
            return (
              <RequestCard
                key={request.id}
                request={row.request}
                teacher={row.teacher}
                school={row.school}
                items={row.items}
                remaining={row.totals.remaining}
                fulfilled={row.totals.fulfilled}
                needed={row.totals.needed}
              />
            );
          })}
        </div>
      </section>
      {wish && (
        <section className="rounded-[2rem] border border-line bg-[color:var(--paper-2)] p-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Wishlist · not this month’s emergency</p>
          <h2 className="display mt-1 text-3xl">{wish.title}</h2>
          <p className="mt-2 text-sm text-ink-soft">{wish.intro}</p>
          <ul className="mt-4 space-y-3">
            {wish.items.map((item) => (
              <li key={item.id} className="flex flex-wrap items-start justify-between gap-3 rounded-2xl bg-[color:var(--paper)] p-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-ink-soft">{item.note}</p>
                </div>
                <Badge tone={item.priority === "needed" ? "copper" : "sand"}>
                  {item.priority === "needed" ? "Later need" : "Nice to have"} · qty {item.quantity}
                </Badge>
              </li>
            ))}
          </ul>
          <Link href={`/dashboard`} className="mt-4 inline-block text-sm underline decoration-line underline-offset-4">
            Teacher desk view
          </Link>
        </section>
      )}
    </div>
  );
}
