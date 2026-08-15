"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { CivicAction } from "@/components/CivicAction";
import { Badge, EmptyState } from "@/components/ui";
import { billById } from "@/lib/catalog";
import { billStatusDetail, billStatusLabel, formatDate, topicLabel } from "@/lib/format";

export default function BillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const bill = billById(id);
  if (!bill) {
    return (
      <div className="shell">
        <EmptyState title="Bill not in this set" body="Only a small verified set is listed. Check azleg.gov for the full record." />
      </div>
    );
  }

  return (
    <div className="shell space-y-10">
      <header>
        <div className="flex flex-wrap gap-2">
          <Badge tone={bill.status === "enacted" ? "verified" : "info"}>{billStatusLabel[bill.status]}</Badge>
          <Badge tone="muted">{topicLabel[bill.topic]}</Badge>
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          {bill.number} · {bill.session}
        </p>
        <h1 className="display mt-2 text-5xl leading-[0.95]">{bill.title}</h1>
      </header>

      <section className="rounded-[22px] border border-line bg-surface p-6">
        <h2 className="display text-3xl">Current status</h2>
        <p className="mt-2">{billStatusDetail[bill.status]}</p>
        <p className="mt-1 text-sm text-ink-faint">Last verified {formatDate(bill.lastVerified)}</p>
      </section>

      <section>
        <h2 className="display text-3xl">What it does</h2>
        <p className="mt-3 max-w-[65ch] leading-relaxed">{bill.plainLanguage}</p>
      </section>

      <section>
        <h2 className="display text-3xl">Why it matters</h2>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-ink-soft">{bill.officialSummary}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            ["Teachers", bill.impactTeachers],
            ["Students", bill.impactStudents],
            ["Families", bill.impactFamilies],
            ["Schools", bill.impactSchools],
          ].map(([k, v]) => (
            <div key={k} className="rounded-[18px] bg-surface-muted p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-ink-faint">{k}</p>
              <p className="mt-2 text-sm leading-relaxed">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[22px] border border-line bg-surface p-5">
          <h3 className="display text-2xl">Supporters argue</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{bill.supportersArgue}</p>
        </div>
        <div className="rounded-[22px] border border-line bg-surface p-5">
          <h3 className="display text-2xl">Opponents argue</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{bill.opponentsArgue}</p>
        </div>
      </section>

      <section>
        <h2 className="display text-3xl">Legislative history</h2>
        <ul className="mt-4 space-y-3">
          {bill.timeline.map((e) => (
            <li key={e.date + e.label} className="grid gap-1 border-b border-line py-3 md:grid-cols-[140px_1fr]">
              <span className="text-sm text-ink-soft">{formatDate(e.date)}</span>
              <span>
                {e.label}{" "}
                <a className="text-sm underline underline-offset-4" href={e.source} target="_blank" rel="noreferrer">
                  source
                </a>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-ink-faint">{bill.sourceNote}</p>
      <CivicAction bill={bill} />
      {bill.id === "hb-2316" && (
        <p className="text-sm">
          Related classroom with topic overlap:{" "}
          <Link href="/requests/req-weather-lab" className="underline underline-offset-4">
            Weather & Climate Lab remaining ledger
          </Link>
          . Adjacency only. This bill does not fund that classroom.
        </p>
      )}
    </div>
  );
}
