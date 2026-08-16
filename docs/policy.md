# Policy

Meridian's civic layer is **policy adjacency**, not a campaign tool and not a second product.

## What the UI says

On a classroom request: **Policy relevant to this classroom**.

Site navigation: **Policy** (not "Education Bills").

Each related bill shows number, status, title, a short "why you are seeing this" paragraph, last verified date, a plain-English page, official Legislature link, and Find your legislators.

## What adjacency means

A weather lab is listed next to HB 2316 because both concern middle-school STEM / CTE-shaped coursework. The copy states that the bill does not fund that classroom. See `src/lib/policyRelevance.ts`.

## Data practice

Records live in `src/data/bills.ts`. Fields include official summary, plain language, supporter/opponent arguments (labeled as arguments, not Meridian's view), timeline events with source URLs, `officialUrl`, optional fact sheet, `lastVerified` (this build: `2026-08-15`), and a source note when later floor action should be checked on azleg.gov.

There is no live scraper. If the Legislature moves after the last verified date, the official site is the source of truth.

## Neutrality

- No voting instruction
- No generated messages to legislators
- Civic actions open official Arizona sites (`azleg.gov/findmylegislator/`, member roster)

## Official doors

Shown in the product:

- Per-bill official text (`bill.officialUrl`)
- https://www.azleg.gov/findmylegislator/
- https://www.azleg.gov/MemberRoster/
- https://www.azed.gov/ on the contact page

Also defined in `src/data/bills.ts` `civicLinks` (not currently rendered as buttons):

- https://apps.azleg.gov/BillStatus/BillOverview
- https://www.azcleanelections.gov/elected-officials
