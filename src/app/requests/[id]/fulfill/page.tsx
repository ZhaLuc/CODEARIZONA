"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ShippingUpload } from "@/components/ShippingUpload";
import { EmptyState, MethodBadge } from "@/components/ui";
import { hydrateRequest, schoolById, teacherById } from "@/lib/catalog";
import { clampGift } from "@/lib/fulfillment";
import { useApp } from "@/lib/store";
import type { EvidenceFile } from "@/lib/types";

type Step = "method" | "review" | "upload" | "done";
type Method = "ship" | "in_person";

function FulfillFlow() {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const router = useRouter();
  const { extras, user, submitShipment, submitInPerson } = useApp();
  const row = hydrateRequest(id, extras);
  const itemId = params.get("item") ?? row?.items.find((i) => i.remainingAfterPending > 0)?.id ?? "";
  const qtyParam = Number(params.get("qty") || "5");
  const item = row?.items.find((i) => i.id === itemId);
  const school = row ? schoolById(row.request.schoolId) : undefined;
  const teacher = row ? teacherById(row.request.teacherId) : undefined;
  const gift = item ? clampGift(item.remainingAfterPending, qtyParam) : { quantity: 0, error: "Item not found." };

  const [step, setStep] = useState<Step>("method");
  const [method, setMethod] = useState<Method | null>(null);
  const [evidence, setEvidence] = useState<EvidenceFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const after = useMemo(() => {
    if (!item || !gift.quantity) return null;
    return {
      verified: item.verified,
      pending: item.pending + gift.quantity,
      remaining: item.remaining,
      remainingAfterPending: Math.max(0, item.remainingAfterPending - gift.quantity),
      needed: item.quantityNeeded,
    };
  }, [item, gift.quantity]);

  if (!row || !item || !school || !teacher) {
    return (
      <div className="shell">
        <EmptyState title="Need unavailable" body="This classroom request is not in the current set." />
      </div>
    );
  }

  if (!user) {
    const next = `/requests/${id}/fulfill?item=${itemId}&qty=${qtyParam}`;
    return (
      <div className="shell">
        <EmptyState
          title="Sign in to continue"
          body="Community members submit fulfillment. Teachers confirm what arrived."
          action={
            <Link href={`/signin?next=${encodeURIComponent(next)}`} className="btn btn-primary">
              Sign in
            </Link>
          }
        />
      </div>
    );
  }

  if (!gift.quantity) {
    return (
      <div className="shell">
        <EmptyState title="That quantity cannot be closed" body={gift.error ?? "Choose a smaller amount."} action={<Link href={`/requests/${id}#close`} className="btn btn-primary">Back to the ledger</Link>} />
      </div>
    );
  }

  function submit() {
    if (!method) return;
    setSubmitting(true);
    const result =
      method === "ship"
        ? submitShipment(id, item.id, gift.quantity, evidence!)
        : submitInPerson(id, item.id, gift.quantity);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError(null);
    setStep("done");
  }

  return (
    <div className="shell max-w-2xl space-y-8">
      <p className="text-sm text-ink-soft">
        <Link href={`/requests/${id}`} className="underline underline-offset-4">
          {row.request.title}
        </Link>
      </p>

      {step === "method" && (
        <section>
          <h1 className="display text-4xl md:text-5xl">How are you getting it to the classroom?</h1>
          <p className="mt-3 text-ink-soft">
            {gift.quantity} {item.name.toLowerCase()} · {school.name}
          </p>
          <div className="mt-6 grid gap-3">
            <button
              type="button"
              className={`rounded-[18px] border p-5 text-left ${method === "ship" ? "border-ink bg-surface" : "border-line bg-surface"}`}
              onClick={() => setMethod("ship")}
            >
              <MethodBadge channel="ship" />
              <p className="mt-2 text-xl font-medium">Ship it</p>
              <p className="mt-1 text-sm text-ink-soft">I will purchase and ship the requested item.</p>
            </button>
            <button
              type="button"
              className={`rounded-[18px] border p-5 text-left ${method === "in_person" ? "border-ink bg-surface" : "border-line bg-surface"}`}
              onClick={() => setMethod("in_person")}
            >
              <MethodBadge channel="in_person" />
              <p className="mt-2 text-xl font-medium">In person</p>
              <p className="mt-1 text-sm text-ink-soft">I will bring the item directly to the school.</p>
            </button>
          </div>
          <button type="button" className="btn btn-primary mt-6" disabled={!method} onClick={() => setStep("review")}>
            Continue
          </button>
        </section>
      )}

      {step === "review" && method && (
        <section>
          <h1 className="display text-4xl md:text-5xl">You are closing part of this need</h1>
          <dl className="mt-6 space-y-3 text-sm">
            <div>
              <dt className="text-ink-faint">Item</dt>
              <dd className="text-lg">{item.name}</dd>
            </div>
            <div>
              <dt className="text-ink-faint">Quantity</dt>
              <dd className="num text-lg">{gift.quantity}</dd>
            </div>
            <div>
              <dt className="text-ink-faint">Method</dt>
              <dd><MethodBadge channel={method} /></dd>
            </div>
            <div>
              <dt className="text-ink-faint">Destination</dt>
              <dd>{school.name} campus fulfillment, {school.city}</dd>
            </div>
            <div>
              <dt className="text-ink-faint">Public ledger now</dt>
              <dd>
                {item.verified} / {item.quantityNeeded} verified · {item.remaining} still needed
              </dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setStep("method")}>
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => (method === "ship" ? setStep("upload") : submit())}
              disabled={submitting}
            >
              {method === "ship" ? "Continue" : "Submit intended handoff"}
            </button>
          </div>
        </section>
      )}

      {step === "upload" && (
        <section>
          <ShippingUpload value={evidence} onChange={setEvidence} />
          {error && <p className="mt-3 text-sm text-danger">{error}</p>}
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setStep("review")}>
              Back
            </button>
            <button type="button" className="btn btn-primary" disabled={!evidence || submitting} onClick={submit}>
              Submit for review
            </button>
          </div>
        </section>
      )}

      {step === "done" && after && method && (
        <section>
          {method === "ship" ? (
            <>
              <h1 className="display text-4xl md:text-5xl">Shipment submitted</h1>
              <p className="mt-3 text-lg text-ink-soft">
                Your {gift.quantity} {item.name.toLowerCase()} contribution is now awaiting verification.
              </p>
              <p className="mt-4 text-sm font-medium">Status: Under review</p>
            </>
          ) : (
            <>
              <h1 className="display text-4xl md:text-5xl">In-person handoff recorded</h1>
              <p className="mt-3 text-lg">
                {gift.quantity} {item.name.toLowerCase()}
              </p>
              <p className="mt-2 text-sm font-medium">Status: Awaiting teacher confirmation</p>
              <p className="mt-3 text-ink-soft">
                Bring the requested items to the school. The classroom will confirm receipt before the need is counted as fulfilled.
              </p>
            </>
          )}
          <dl className="mt-8 grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-ink-faint">Contribution</dt>
              <dd className="num text-2xl">{gift.quantity} {item.name.toLowerCase()}</dd>
            </div>
            <div>
              <dt className="text-ink-faint">Verified</dt>
              <dd className="num text-2xl">{after.verified} / {after.needed}</dd>
            </div>
            <div>
              <dt className="text-ink-faint">{method === "ship" ? "Pending review" : "Awaiting confirmation"}</dt>
              <dd className="num text-2xl">{gift.quantity}</dd>
            </div>
            <div>
              <dt className="text-ink-faint">Would remain once verified</dt>
              <dd className="num text-2xl">{after.remainingAfterPending}</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-ink-soft">
            The public fulfillment count is still {after.verified} / {after.needed} because this contribution is not verified yet.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href={`/requests/${id}`} className="btn btn-primary">
              Back to the ledger
            </Link>
            <Link href="/activity" className="btn btn-secondary">
              My activity
            </Link>
            <button type="button" className="btn btn-tertiary" onClick={() => router.push("/signin?next=/activity")}>
              Switch to teacher
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default function FulfillPage() {
  return (
    <Suspense fallback={<p className="shell text-ink-soft">Loading fulfillment.</p>}>
      <FulfillFlow />
    </Suspense>
  );
}
