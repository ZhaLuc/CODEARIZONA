import { SourceTag } from "@/components/ui";

export default function TrustPage() {
  return (
    <div className="space-y-8">
      <SourceTag kind="demo" />
      <h1 className="display text-5xl">Trust is a product feature</h1>
      <p className="max-w-2xl text-lg text-ink-soft">
        If a neighbor cannot tell what is real, the map is just decoration. Meridian is designed so a judge — and later a parent — can see the seams on purpose.
      </p>
      <section className="grid gap-4 md:grid-cols-2">
        {[
          [
            "Demonstration classrooms",
            "Teachers, wishlists, donors, and fulfillment counts in this prototype are fictional and seeded. Public school names and campus coordinates are real locations used as map anchors. Those schools are not partners and have not posted these requests.",
          ],
          [
            "Real legislation",
            "Bill pages are written from official Arizona Legislature text, chaptered laws, and official fact sheets. Each page shows last verified date, official links, and a source note when a later action could not be confirmed from azleg.gov in this build.",
          ],
          [
            "No home addresses",
            "The public sees school, city, and campus map point. Shipping is modeled as a private school fulfillment path. Student names, photos, and identifiable classroom rosters are not collected.",
          ],
          [
            "Demo educator, not verified",
            "Profiles show Demo educator. This app does not currently verify anyone. Production would use school-domain email, district confirmation, and educator credential checks — and would say so only after those checks ran.",
          ],
          [
            "Simulated closing of need",
            "Closing a quantity updates remaining items in this browser. There is no payment, no shipment, and no email. Reset demo returns Maria’s markers to 8 / 20.",
          ],
          [
            "Nonpartisan by construction",
            "Bill pages separate 'what the bill does' from 'supporters argue' / 'opponents argue'. Civic buttons open azleg.gov. Meridian never sends a political message.",
          ],
        ].map(([t, b]) => (
          <article key={t} className="rounded-3xl border border-line p-6">
            <h2 className="display text-2xl">{t}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{b}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
