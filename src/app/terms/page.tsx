import { PageHeader } from "@/components/ui";

export default function TermsPage() {
  return (
    <div className="shell space-y-6">
      <PageHeader
        title="Terms"
        body="Use Meridian to see remaining classroom need and to submit fulfillment for verification. It is not a payment processor and not a political action tool."
      />
      <ul className="max-w-[62ch] space-y-3 text-sm leading-relaxed text-ink-soft">
        <li>Submitting fulfillment is a statement of intended or completed physical delivery, not a donation receipt.</li>
        <li>Teachers may verify, reject, or request clarification. Only verified units change the public ledger.</li>
        <li>Policy pages are informational. They are not voting advice.</li>
        <li>Official bill text always lives on azleg.gov.</li>
      </ul>
    </div>
  );
}
