import { civicLinks } from "@/data/bills";
import type { Bill } from "@/lib/types";

export function CivicAction({ bill }: { bill: Bill }) {
  return (
    <section className="rounded-[22px] border border-line bg-surface p-6">
      <h3 className="display text-3xl">Official source</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        State education bills are handled by Arizona state senators and representatives, not members of Congress. Meridian does not send a message for you and does not tell you what to say.
      </p>
      <ol className="mt-4 space-y-2 text-sm">
        <li>1. Read the official bill text.</li>
        <li>2. Find the legislators who represent your district.</li>
        <li>3. If you choose to write, you write from your own account, on an official site.</li>
      </ol>
      <div className="mt-5 flex flex-wrap gap-2">
        <a href={bill.officialUrl} target="_blank" rel="noreferrer" className="btn btn-primary text-sm">
          Official bill text
        </a>
        <a href={civicLinks.findLegislator} target="_blank" rel="noreferrer" className="btn btn-secondary text-sm">
          Find your legislators
        </a>
        <a href={civicLinks.memberRoster} target="_blank" rel="noreferrer" className="btn btn-secondary text-sm">
          Member roster
        </a>
      </div>
    </section>
  );
}
