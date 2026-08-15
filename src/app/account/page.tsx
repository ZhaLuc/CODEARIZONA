"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmptyState, PageHeader, StatusChip } from "@/components/ui";
import { formatStamp } from "@/lib/format";
import { useApp } from "@/lib/store";

export default function AccountPage() {
  const { user, myEvents, signOut, resetSession } = useApp();
  const router = useRouter();

  if (!user) {
    return (
      <div className="shell">
        <EmptyState
          title="Sign in to open your account"
          body="Your role, activity, and fulfillment history live here."
          action={
            <Link href="/signin?next=/account" className="btn btn-primary">
              Sign in
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="shell space-y-10">
      <PageHeader title="Account" body={`${user.name} · ${user.role === "teacher" ? "Teacher" : user.role === "admin" ? "Staff" : "Community member"}`} />
      <section className="rounded-[22px] border border-line bg-surface p-6">
        <h2 className="display text-2xl">Profile</h2>
        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="text-ink-faint">Name</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">Role</dt>
            <dd>{user.role === "teacher" ? "Teacher" : user.role === "admin" ? "Staff" : "Community member"}</dd>
          </div>
        </dl>
      </section>
      <section>
        <h2 className="display text-2xl">Fulfillment history</h2>
        {myEvents.length === 0 ? (
          <p className="mt-3 text-ink-soft">No submissions on this account yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {myEvents.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-3 text-sm">
                <span>
                  {e.quantity} {e.itemName.toLowerCase()}
                </span>
                <span className="flex items-center gap-3">
                  <StatusChip status={e.status} />
                  <span className="text-ink-faint">{formatStamp(e.at)}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            signOut();
            router.push("/");
          }}
        >
          Sign out
        </button>
        <button type="button" className="btn btn-tertiary" onClick={resetSession}>
          Reset session
        </button>
      </section>
    </div>
  );
}
