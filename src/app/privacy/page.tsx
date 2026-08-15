import { PageHeader } from "@/components/ui";

export default function PrivacyPage() {
  return (
    <div className="shell space-y-6">
      <PageHeader
        title="Privacy"
        body="Meridian is built so a neighbor can close a classroom gap without exposing a teacher's home or a student's identity."
      />
      <ul className="max-w-[62ch] space-y-3 text-sm leading-relaxed text-ink-soft">
        <li>Public location is the school campus and city.</li>
        <li>Shipping labels are used for fulfillment verification. Do not upload unrelated personal documents.</li>
        <li>Student names, photos, and rosters are not requested.</li>
        <li>Account records in this product stay on this device unless you deploy a backend.</li>
      </ul>
    </div>
  );
}
