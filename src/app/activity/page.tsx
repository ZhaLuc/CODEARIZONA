"use client";

import Link from "next/link";
import { EmptyState, PageHeader, StatusChip } from "@/components/ui";
import { hydrateRequest, requestsByTeacher, teacherById, schoolById, wishlistByTeacher, liveWishlist } from "@/lib/catalog";
import { formatStamp } from "@/lib/format";
import { useApp } from "@/lib/store";
import { fulfillmentStatusLabel } from "@/lib/fulfillment";

export default function ActivityPage() {
  const { user, extras, pendingForTeacher, myEvents, reviewEvent } = useApp();

  if (!user) {
    return (
      <div className="shell">
        <EmptyState
          title="Sign in to see your activity"
          body="Community members track submissions. Teachers verify what actually arrived."
          action={
            <Link href="/signin?next=/activity" className="btn btn-primary">
              Sign in
            </Link>
          }
        />
      </div>
    );
  }

  if (user.role === "teacher" || user.role === "admin") {
    const teacher = user.teacherId ? teacherById(user.teacherId) : user.role === "admin" ? teacherById("teacher-maria") : undefined;
    const school = teacher ? schoolById(teacher.schoolId) : undefined;
    const reqs = teacher ? requestsByTeacher(teacher.id).map((r) => hydrateRequest(r.id, extras)!) : [];
    const wish = teacher ? wishlistByTeacher(teacher.id) : undefined;
    const wishLive = wish ? liveWishlist(wish, extras) : [];
    const remaining = reqs.flatMap((r) => r.items.filter((i) => i.remaining > 0)).slice(0, 5);
    const verifiedRecent = extras.filter((e) => e.status === "verified" && (!user.teacherId || e.teacherId === user.teacherId)).slice(-5).reverse();

    return (
      <div className="shell space-y-10">
        <PageHeader
          title="Classroom needs"
          body={teacher && school ? `${teacher.name} · ${school.name}` : "Review incoming fulfillment."}
        />
        <section className="grid gap-4 md:grid-cols-3">
          {reqs.length === 0 && (
            <p className="text-ink-soft md:col-span-3">No classroom needs published yet.</p>
          )}
          {reqs.map((r) => (
            <Link key={r.request.id} href={`/requests/${r.request.id}`} className="rounded-[22px] border border-line bg-surface p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-ink-faint">{r.request.title}</p>
              <p className="num mt-2 text-4xl">{r.totals.remaining}</p>
              <p className="text-sm text-ink-soft">still needed · {r.totals.fulfilled} verified</p>
            </Link>
          ))}
        </section>
        <section>
          <h2 className="display text-3xl">Fulfillment awaiting verification</h2>
          {pendingForTeacher.length === 0 ? (
            <p className="mt-3 text-ink-soft">You are all caught up.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pendingForTeacher.map((e) => (
                <li key={e.id} className="rounded-[18px] border border-line bg-surface p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        {e.quantity} {e.itemName.toLowerCase()}
                      </p>
                      <p className="text-sm text-ink-soft">
                        {e.actorName} · {e.channel === "wishlist_shipment" ? "wishlist shipment" : "in person"} · {formatStamp(e.at)}
                      </p>
                      {e.evidence && <p className="mt-1 text-xs text-ink-faint">Label on file: {e.evidence.fileName}</p>}
                    </div>
                    <StatusChip status={e.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" className="btn btn-primary !min-h-10 text-sm" onClick={() => reviewEvent(e.id, "verified")}>
                      Verify fulfillment
                    </button>
                    <button type="button" className="btn btn-secondary !min-h-10 text-sm" onClick={() => reviewEvent(e.id, "needs_attention", "Please clarify quantity or destination.")}>
                      Request clarification
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        {wish && (
          <section>
            <h2 className="display text-3xl">Wishlist activity</h2>
            {wishLive.every((i) => i.pending === 0) ? (
              <p className="mt-3 text-ink-soft">No wishlist fulfillment is waiting for verification.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {wishLive.filter((i) => i.pending > 0).map((i) => (
                  <li key={i.id}>
                    {i.name}: {i.pending} pending · {i.verified} verified · {i.remaining} remaining
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
        <section>
          <h2 className="display text-3xl">Recently verified</h2>
          {verifiedRecent.length === 0 ? (
            <p className="mt-3 text-ink-soft">No newly verified fulfillment yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {verifiedRecent.map((e) => (
                <li key={e.id} className="flex justify-between border-b border-line py-2">
                  <span>
                    {e.quantity} {e.itemName.toLowerCase()}
                  </span>
                  <span>{formatStamp(e.at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2 className="display text-3xl">Remaining needs</h2>
          <ul className="mt-3 space-y-2">
            {remaining.map((i) => (
              <li key={i.id} className="flex justify-between border-b border-line py-2 text-sm">
                <span>{i.name}</span>
                <span className="num">{i.remaining}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  const waiting = myEvents.filter((e) => e.status === "submitted" || e.status === "under_review");
  const done = myEvents.filter((e) => e.status === "verified");

  return (
    <div className="shell space-y-10">
      <PageHeader title="My activity" body={`${user.name}. What you closed, and what is still waiting.`} />
      <section>
        <h2 className="display text-3xl">Items awaiting verification</h2>
        {waiting.length === 0 ? (
          <p className="mt-3 text-ink-soft">You are all caught up.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {waiting.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-line bg-surface p-4">
                <div>
                  <p className="font-medium">
                    {e.quantity} {e.itemName.toLowerCase()}
                  </p>
                  <p className="text-sm text-ink-soft">{e.destination}</p>
                </div>
                <StatusChip status={e.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="display text-3xl">Completed contributions</h2>
        {done.length === 0 ? (
          <p className="mt-3 text-ink-soft">No verified contributions yet. Pending items do not count as closed.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {done.map((e) => (
              <li key={e.id} className="flex justify-between border-b border-line py-2">
                <span>
                  {e.quantity} {e.itemName.toLowerCase()}
                </span>
                <span>{fulfillmentStatusLabel[e.status]}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <Link href="/explore" className="btn btn-secondary">
        Find another open need
      </Link>
    </div>
  );
}
