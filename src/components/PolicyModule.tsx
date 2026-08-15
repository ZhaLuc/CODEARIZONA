import Link from "next/link";
import { civicLinks } from "@/data/bills";
import { whyThisBill } from "@/lib/policyRelevance";
import { billStatusLabel } from "@/lib/format";
import type { Bill } from "@/lib/types";
import { SourceTag } from "./ui";

export function PolicyModule({ requestId, bills }: { requestId: string; bills: Bill[] }) {
  if (bills.length === 0) return null;
  return (
    <section className="rounded-[2rem] border border-civic/20 bg-[color:var(--mist)] p-6">
      <div className="flex flex-wrap gap-2">
        <SourceTag kind="law" />
      </div>
      <h2 className="display mt-3 text-3xl">Policy relevant to this classroom</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        Arizona education rules are state law. This is topic adjacency, not a claim that a bill funds this request.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {bills.map((b) => (
          <article key={b.id} className="rounded-3xl border border-line bg-[color:var(--paper)] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">
              {b.number} · {billStatusLabel[b.status]}
            </p>
            <p className="display mt-1 text-2xl leading-tight">{b.title}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-civic">Why you’re seeing this</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{whyThisBill(requestId, b.id)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/bills/${b.id}`} className="rounded-full bg-civic px-3 py-1.5 text-sm text-[color:var(--paper)]">
                Plain-English summary
              </Link>
              <a href={b.officialUrl} target="_blank" rel="noreferrer" className="rounded-full border border-line px-3 py-1.5 text-sm">
                Official Legislature
              </a>
              <a href={civicLinks.findLegislator} target="_blank" rel="noreferrer" className="rounded-full border border-line px-3 py-1.5 text-sm">
                Find your legislators
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
