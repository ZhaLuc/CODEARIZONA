# Decisions

Engineering and product choices made so the remaining-need mechanism could be shown clearly in a 10-hour Code Arizona build.

## Remaining-need ledger

A campaign percentage hides mixed lists. Item rows make partial closure visible: construction paper can be complete while markers are not.

## Item-level fulfillment

Communities rarely close an entire kit in one action. Native quantities let someone close 5 of 20 without pretending the line is done.

## Verification before the public count

A promise is not arrival. Shipping evidence and teacher confirmation are the trust layer. Pending is visible. Only `verified` changes remaining need.

## Campus-level location

People need local discovery. Teachers should not publish home addresses. Pins use public school campuses from `src/data/schools.ts`.

## Policy adjacency

The same classroom exists inside Arizona education policy. The civic layer is a labeled adjacency with official sources, not a second fundraising product and not a voting instruction.

## Seeded data

Deterministic classrooms, bills, and accounts make the demo reproducible. Reset returns the same 8 / 20 marker baseline. Production would replace this with institutional records.

## Simplified architecture

One Next.js app, client session in `localStorage`, no backend, no shipping carrier API. That is a constrained-hackathon choice so the loop (see, close part, evidence, verify) is the thing being judged, not infrastructure theater.

## What we did not choose

- Dollar thermometers as the primary object
- Instant credit on submit
- Teacher home pins
- Live legislative scraping
- Claiming school district partnerships
