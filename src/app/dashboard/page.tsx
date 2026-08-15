"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, LedgerBar, SourceTag } from "@/components/ui";
import { hydrateRequest, requestsByTeacher, teacherById, wishlistByTeacher, schoolById } from "@/lib/catalog";
import { useDemo } from "@/lib/store";

export default function DashboardPage() {
  const { extras, setRole } = useDemo();
  const teacher = teacherById("teacher-maria")!;
  const school = schoolById(teacher.schoolId)!;
  const reqs = requestsByTeacher(teacher.id).map((r) => hydrateRequest(r.id, extras)!);
  const wish = wishlistByTeacher(teacher.id);
  const [draft, setDraft] = useState("Student thermometers · 4 more if the first set breaks");
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <SourceTag kind="demo" />
          <h1 className="display mt-2 text-5xl">Classroom desk</h1>
          <p className="text-ink-soft">
            Signed in as demonstration teacher {teacher.name} · {school.name}
          </p>
        </div>
        <button onClick={() => setRole("teacher")} className="rounded-full border border-line px-3 py-1.5 text-sm">
          Teacher demo account
        </button>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        {reqs.map((r) => (
          <div key={r.request.id} className="rounded-3xl border border-line p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">{r.request.title}</p>
            <p className="display mt-2 text-4xl">
              {r.totals.fulfilled}/{r.totals.needed}
            </p>
            <div className="mt-3">
              <LedgerBar fulfilled={r.totals.fulfilled} needed={r.totals.needed} />
            </div>
            <Link href={`/requests/${r.request.id}`} className="mt-3 inline-block text-sm underline">
              Public view
            </Link>
          </div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-line p-6">
          <h2 className="display text-3xl">Add a line item</h2>
          <p className="mt-2 text-sm text-ink-soft">
            In production this would write to the request ledger after verification. In this prototype it stays on the desk so judges can see the teacher workflow without a fake backend.
          </p>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="mt-4 min-h-28 w-full rounded-2xl border border-line bg-transparent p-3 text-sm"
          />
          <button
            onClick={() => setSaved(true)}
            className="mt-3 rounded-full bg-ink px-4 py-2 text-sm text-[color:var(--paper)]"
          >
            Save to desk (demo)
          </button>
          {saved && <p className="mt-2 text-sm text-juniper">Saved locally on this desk. Not published to the public map.</p>}
        </div>
        <div className="rounded-3xl border border-line p-6">
          <h2 className="display text-3xl">Recent contributions</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {reqs[0]?.request.history.slice(0, 4).map((h) => (
              <li key={h.id} className="flex justify-between border-b border-line py-2">
                <span>{h.donorLabel}</span>
                <span>+{h.quantity}</span>
              </li>
            ))}
            {extras
              .filter((c) => c.requestId === "req-weather-lab")
              .map((c, i) => (
                <li key={i} className="flex justify-between border-b border-line py-2 text-juniper">
                  <span>Demo neighbor</span>
                  <span>+{c.quantity}</span>
                </li>
              ))}
          </ul>
        </div>
      </section>
      {wish && (
        <section>
          <h2 className="display text-3xl">Wishlist</h2>
          <p className="text-sm text-ink-soft">Longer-horizon items, visually separate from urgent requests.</p>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {wish.items.map((item) => (
              <li key={item.id} className="rounded-3xl bg-[color:var(--paper-2)] p-4">
                <Badge tone={item.priority === "needed" ? "copper" : "sand"}>{item.priority}</Badge>
                <p className="mt-2 font-medium">{item.name}</p>
                <p className="text-sm text-ink-soft">{item.note}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
