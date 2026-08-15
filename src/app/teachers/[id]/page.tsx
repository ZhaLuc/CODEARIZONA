"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { RequestCard } from "@/components/RequestCard";
import { WishlistPanel } from "@/components/WishlistPanel";
import { EmptyState } from "@/components/ui";
import { hydrateRequest, teacherById, schoolById, requestsByTeacher, wishlistByTeacher } from "@/lib/catalog";
import { useApp } from "@/lib/store";

export default function TeacherPage() {
  const { id } = useParams<{ id: string }>();
  const { extras } = useApp();
  const teacher = teacherById(id);
  const school = teacher ? schoolById(teacher.schoolId) : undefined;
  const reqs = requestsByTeacher(id);
  const wish = wishlistByTeacher(id);

  if (!teacher || !school) {
    return (
      <div className="shell">
        <EmptyState title="Teacher not found" body="This classroom profile is not in the current set." />
      </div>
    );
  }

  return (
    <div className="shell space-y-10">
      <header>
        <p className="text-sm text-ink-soft">
          {teacher.subjects.join(" · ")} · {teacher.gradeLevels}
        </p>
        <h1 className="display mt-2 text-5xl">{teacher.name}</h1>
        <p className="mt-2 text-ink-soft">
          {school.name} · {school.city}, Arizona
        </p>
        <p className="mt-4 max-w-[62ch]">{teacher.bio}</p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[22px] border border-line bg-surface p-5">
          <h2 className="display text-2xl">Classroom</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{teacher.classroom}</p>
          <p className="mt-3 text-xs text-ink-faint">
            Public location is the school campus in {school.city}. Home addresses are never shown.
          </p>
        </div>
        <div className="rounded-[22px] border border-line bg-surface p-5">
          <h2 className="display text-2xl">Current classroom needs</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Remaining need sits above biography. Shipping goes to the campus fulfillment path.
          </p>
          <Link href="/explore" className="mt-3 inline-block text-sm underline underline-offset-4">
            See open needs nearby
          </Link>
        </div>
      </section>
      <section>
        <h2 className="display text-3xl">Open remaining needs</h2>
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
                verified={row.totals.fulfilled}
                needed={row.totals.needed}
                pending={row.totals.pending}
              />
            );
          })}
        </div>
      </section>
      {wish && <WishlistPanel list={wish} />}
    </div>
  );
}
