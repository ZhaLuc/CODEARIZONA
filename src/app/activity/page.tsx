"use client";

import { useState } from "react";
import Link from "next/link";
import { EmptyState, MethodBadge, PageHeader, StatusChip } from "@/components/ui";
import { hydrateRequest, requestsByTeacher, teacherById, schoolById, wishlistByTeacher, liveWishlist } from "@/lib/catalog";
import { formatStamp } from "@/lib/format";
import { methodLabel } from "@/lib/fulfillment";
import { useApp } from "@/lib/store";
import type { LiveFulfillment } from "@/lib/types";

export default function ActivityPage() {
  const { user, extras, pendingForTeacher, myEvents, reviewEvent } = useApp();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("Evidence does not show the requested item.");

  if (!user) {
    return (
      <div className="shell">
        <EmptyState
          title="Sign in to see your activity"
          body="Community members track submissions. Teachers confirm what arrived."
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
    const remaining = reqs.flatMap((r) => r.items.filter((i) => i.remaining > 0));
    const inPerson = pendingForTeacher.filter((e) => e.channel === "in_person");
    const shipments = pendingForTeacher.filter((e) => e.channel !== "in_person");

    return (
      <div className="shell space-y-12">
        <PageHeader title="Classroom desk" body={teacher && school ? `${teacher.name} · ${school.name}` : "Review incoming fulfillment."} />

        <section>
          <h2 className="display text-3xl">Remaining classroom needs</h2>
          {remaining.length === 0 ? (
            <p className="mt-3 text-ink-soft">No open lines on published requests.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {remaining.map((i) => (
                <li key={i.id} className="flex justify-between py-3 text-sm">
                  <span>{i.name}</span>
                  <span className="num">
                    {i.verified} / {i.quantityNeeded} verified · {i.remaining} still needed
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="display text-3xl">Awaiting confirmation</h2>
          {pendingForTeacher.length === 0 ? (
            <p className="mt-3 text-ink-soft">You are all caught up.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {[...inPerson, ...shipments].map((e) => (
                <TeacherReviewCard
                  key={e.id}
                  event={e}
                  confirmId={confirmId}
                  rejectId={rejectId}
                  rejectReason={rejectReason}
                  onConfirmAsk={() => setConfirmId(e.id)}
                  onConfirmCancel={() => setConfirmId(null)}
                  onConfirm={() => {
                    reviewEvent(e.id, "verified");
                    setConfirmId(null);
                  }}
                  onRejectAsk={() => setRejectId(e.id)}
                  onRejectCancel={() => setRejectId(null)}
                  onReject={() => {
                    reviewEvent(e.id, e.channel === "in_person" ? "not_received" : "rejected", rejectReason);
                    setRejectId(null);
                  }}
                  onReason={setRejectReason}
                />
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="display text-3xl">Active requests</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {reqs.map((r) => (
              <Link key={r.request.id} href={`/requests/${r.request.id}`} className="rounded-[18px] border border-line bg-surface p-4">
                <p className="font-medium">{r.request.title}</p>
                <p className="num mt-2 text-3xl">{r.totals.remaining}</p>
                <p className="text-sm text-ink-soft">still needed · {r.totals.fulfilled} verified</p>
              </Link>
            ))}
          </div>
        </section>

        {wish && (
          <section>
            <h2 className="display text-3xl">Wishlist</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {wishLive.map((i) => (
                <li key={i.id} className="flex justify-between border-b border-line py-2">
                  <span>{i.name}</span>
                  <span>
                    {i.verified} verified · {i.pending} pending · {i.remaining} remaining
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  const waiting = myEvents.filter((e) => e.status === "under_review" || e.status === "pending_teacher_confirmation");
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
                <div className="flex items-center gap-2">
                  <MethodBadge channel={e.channel} />
                  <StatusChip status={e.status} />
                </div>
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
                <span>Verified</span>
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

function TeacherReviewCard({
  event: e,
  confirmId,
  rejectId,
  rejectReason,
  onConfirmAsk,
  onConfirmCancel,
  onConfirm,
  onRejectAsk,
  onRejectCancel,
  onReject,
  onReason,
}: {
  event: LiveFulfillment;
  confirmId: string | null;
  rejectId: string | null;
  rejectReason: string;
  onConfirmAsk: () => void;
  onConfirmCancel: () => void;
  onConfirm: () => void;
  onRejectAsk: () => void;
  onRejectCancel: () => void;
  onReject: () => void;
  onReason: (v: string) => void;
}) {
  const inPerson = e.channel === "in_person";
  return (
    <li className="rounded-[18px] border border-line bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-medium">
            {e.quantity} {e.itemName.toLowerCase()}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Contributor: {e.actorName} · Method: {methodLabel(e.channel)} · {formatStamp(e.at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MethodBadge channel={e.channel} />
          <StatusChip status={e.status} />
        </div>
      </div>
      {e.evidence?.previewUrl && (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-faint">Evidence</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={e.evidence.previewUrl} alt={`Shipping evidence ${e.evidence.fileName}`} className="mt-2 max-h-48 rounded-xl object-contain" />
          <p className="mt-1 text-xs text-ink-faint">{e.evidence.fileName}</p>
        </div>
      )}
      {confirmId === e.id ? (
        <div className="mt-4 rounded-[14px] bg-bg p-4">
          <p>
            Confirm that you received {e.quantity} {e.itemName.toLowerCase()}.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary !min-h-10 text-sm" onClick={onConfirm}>
              Yes, confirm
            </button>
            <button type="button" className="btn btn-secondary !min-h-10 text-sm" onClick={onConfirmCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : rejectId === e.id ? (
        <div className="mt-4 rounded-[14px] bg-bg p-4">
          <label className="text-sm font-medium" htmlFor={`reason-${e.id}`}>
            Reason
          </label>
          <input id={`reason-${e.id}`} className="field mt-1" value={rejectReason} onChange={(ev) => onReason(ev.target.value)} />
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn btn-danger !min-h-10 text-sm" onClick={onReject}>
              {inPerson ? "Mark not received" : "Reject"}
            </button>
            <button type="button" className="btn btn-secondary !min-h-10 text-sm" onClick={onRejectCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary !min-h-10 text-sm" onClick={inPerson ? onConfirmAsk : () => onConfirm()}>
            {inPerson ? "Confirm received" : "Verify fulfillment"}
          </button>
          <button type="button" className="btn btn-secondary !min-h-10 text-sm" onClick={onRejectAsk}>
            {inPerson ? "Not received" : "Reject"}
          </button>
        </div>
      )}
    </li>
  );
}
