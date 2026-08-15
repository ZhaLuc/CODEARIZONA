import Link from "next/link";
import { civicLinks } from "@/data/bills";
import { whyThisBill } from "@/lib/policyRelevance";
import { billStatusDetail } from "@/lib/format";
import type { Bill } from "@/lib/types";

export function PolicyModule({ requestId, bills }: { requestId: string; bills: Bill[] }) {
  if (bills.length === 0) return null;
  return (
    <section className="rounded-[22px] border border-line bg-surface p-6">
      <h2 className="display text-3xl">Policy relevant to this classroom</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        Arizona education rules are state law. This is topic adjacency, not a claim that a bill funds this request.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {bills.map((b) => (
          <article key={b.id} className="rounded-[18px] bg-bg p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-faint">
              {b.number} · {billStatusDetail[b.status]}
            </p>
            <p className="display mt-1 text-2xl leading-tight">{b.title}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-info">Why you are seeing this</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{whyThisBill(requestId, b.id)}</p>
            <p className="mt-2 text-xs text-ink-faint">Last verified {b.lastVerified}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/bills/${b.id}`} className="btn btn-primary !min-h-10 text-sm">
                Plain-English summary
              </Link>
              <a href={b.officialUrl} target="_blank" rel="noreferrer" className="btn btn-secondary !min-h-10 text-sm">
                Official Legislature
              </a>
              <a href={civicLinks.findLegislator} target="_blank" rel="noreferrer" className="btn btn-secondary !min-h-10 text-sm">
                Find your legislators
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
