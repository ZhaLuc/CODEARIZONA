import Link from "next/link";
import { PageHeader } from "@/components/ui";

export default function AboutPage() {
  return (
    <div className="shell space-y-10">
      <PageHeader
        title="About Meridian"
        body="Meridian makes the exact remaining classroom need visible and actionable. It does not count a promise as a closed item."
      />
      <section className="grid gap-4 md:grid-cols-2">
        {[
          [
            "Verified fulfillment",
            "A contribution raises the ledger only after the classroom confirms arrival, or after shipment evidence is accepted. Pending items stay pending.",
          ],
          [
            "Campus locations only",
            "Public maps use school campuses. Home addresses, student names, and classroom rosters are not collected.",
          ],
          [
            "Policy as context",
            "Bill pages use official Arizona Legislature sources and a last-verified date. Topic overlap is adjacency, not funding.",
          ],
          [
            "No fabricated claims",
            "Meridian does not display partnership logos, donor counts, or institutional endorsements that are not in the product record.",
          ],
        ].map(([t, b]) => (
          <article key={t} className="rounded-[22px] border border-line bg-surface p-6">
            <h2 className="display text-2xl">{t}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{b}</p>
          </article>
        ))}
      </section>
      <Link href="/explore" className="btn btn-primary">
        See what is still missing
      </Link>
    </div>
  );
}
