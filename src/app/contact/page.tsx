import { PageHeader } from "@/components/ui";

export default function ContactPage() {
  return (
    <div className="shell space-y-6">
      <PageHeader title="Contact" body="For product questions about remaining-need ledgers and fulfillment verification, write to the team that operates this instance." />
      <p className="text-sm text-ink-soft">
        Official Arizona sources:{" "}
        <a className="underline underline-offset-4" href="https://www.azleg.gov/">
          azleg.gov
        </a>
        {" · "}
        <a className="underline underline-offset-4" href="https://www.azed.gov/">
          azed.gov
        </a>
      </p>
    </div>
  );
}
