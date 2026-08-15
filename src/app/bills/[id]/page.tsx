"use client";

import { useParams } from "next/navigation";
import { CivicAction } from "@/components/CivicAction";
import { Badge, EmptyState, SourceTag } from "@/components/ui";
import { billById } from "@/lib/catalog";
import { billStatusLabel, formatDate, topicLabel } from "@/lib/format";
import Link from "next/link";

export default function BillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const bill = billById(id);
  if (!bill) return <EmptyState title="Bill not in this prototype" body="Only a small verified set is seeded. Check azleg.gov for the full record." />;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        <SourceTag kind="law" />
        <Badge tone={bill.status === "enacted" ? "juniper" : bill.status === "vetoed" ? "clay" : "civic"}>
          {billStatusLabel[bill.status]}
        </Badge>
        <Badge tone="sand">{topicLabel[bill.topic]}</Badge>
      </div>
      <header>
        <p className="text-sm text-ink-soft">
          {bill.number} · {bill.session} · last verified {formatDate(bill.lastVerified)}
        </p>
        <h1 className="display mt-2 text-5xl leading-[0.95]">{bill.title}</h1>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-line p-6">
          <h2 className="display text-3xl">What does this bill do?</h2>
          <p className="mt-3 leading-relaxed">{bill.plainLanguage}</p>
        </article>
        <article className="rounded-3xl border border-line p-6">
          <h2 className="display text-3xl">Official description</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{bill.officialSummary}</p>
        </article>
      </section>
      <section>
        <h2 className="display text-3xl">What this means in a classroom</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            ["Teachers", bill.impactTeachers],
            ["Students", bill.impactStudents],
            ["Families", bill.impactFamilies],
            ["Schools", bill.impactSchools],
          ].map(([k, v]) => (
            <div key={k} className="rounded-3xl bg-[color:var(--paper-2)] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">{k}</p>
              <p className="mt-2 text-sm leading-relaxed">{v}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-line p-5">
          <h3 className="display text-2xl">Supporters argue</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{bill.supportersArgue}</p>
        </div>
        <div className="rounded-3xl border border-line p-5">
          <h3 className="display text-2xl">Opponents argue</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{bill.opponentsArgue}</p>
        </div>
      </section>
      <section>
        <h2 className="display text-3xl">Timeline</h2>
        <ul className="mt-4 space-y-3">
          {bill.timeline.map((e) => (
            <li key={e.date + e.label} className="grid gap-1 border-b border-line py-3 md:grid-cols-[140px_1fr]">
              <span className="text-sm text-ink-soft">{formatDate(e.date)}</span>
              <span>
                {e.label}{" "}
                <a className="text-sm underline decoration-line underline-offset-4" href={e.source} target="_blank" rel="noreferrer">
                  source
                </a>
              </span>
            </li>
          ))}
        </ul>
      </section>
      <p className="text-xs text-ink-soft">{bill.sourceNote}</p>
      <CivicAction bill={bill} />
      {bill.id === "hb-2316" && (
        <p className="text-sm">
          See a classroom with topic overlap:{" "}
          <Link href="/requests/req-weather-lab" className="underline decoration-line underline-offset-4">
            the weather-lab remaining ledger
          </Link>
          . Adjacency only — this bill does not fund that demo classroom.
        </p>
      )}
    </div>
  );
}
