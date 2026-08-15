# Meridian — product thesis for the demo

## Brutal critique of the original idea

A “teachers post supplies, neighbors donate” product in Arizona will be compared to DonorsChoose in the first ten seconds. That comparison is fair. DonorsChoose already does discovery, teacher projects, local giving, and maps. Amazon wishlists already do item lists. School PTOs already do drives. azleg.gov already publishes bills.

What was generic: donation marketplace, teacher profiles, a map of pins, a civic information page bolted on.

What is actually compelling: **remaining need as a public ledger**, tied to a **school campus** (never a home), with **partial physical fulfillment**, and a **nonpartisan door into the Arizona Legislature** from the same classroom.

The clone risk is visual as much as conceptual. A teal nonprofit with a Google Map and a chatbot loses. A product that looks like a civic instrument — a ledger of what is still missing — can win.

## One-sentence thesis

Meridian shows Arizona neighbors the exact remaining items in local classrooms, lets them close part of that gap, and places the education bills that shape those classrooms beside the need — without partisan instruction.

## Judge pitch (under 10 seconds)

See what’s still missing in an Arizona classroom, give part of it, then read the bill that touches that classroom.

## Emotional pitch

You should not have to guess which classroom down the road is short on thermometers, or which state bill is quietly changing what that classroom can offer.

## Technical pitch

A deterministic remaining-need ledger (item-level fulfillment, never a false “100% funded” on mixed lists) on campus-level geography, with legislation records sourced and dated from official Arizona texts.

## Differentiation

DonorsChoose funds projects. Wishlists are private links. Government sites publish statutes. Meridian is the Arizona-local network where **outstanding physical need, geographic discovery, and civic literacy are one system**.

## Positioning (scored)

| Option | Score | Note |
| --- | --- | --- |
| A. Arizona’s classroom supply network | 6 | True, forgettable, sounds like DonorsChoose |
| B. Google Maps for classroom needs | 5 | Map-first, clone-shaped |
| C. Communities support local classrooms | 6 | Warm, undifferentiated |
| D. Classroom needs + civic intelligence | 8 | Accurate, a little think-tank |
| **E. Remaining-need ledger for Arizona classrooms** | **9** | Unique mechanism, demoable, honest |

Chosen headline: **See exactly what Arizona classrooms still need.**

Big idea: **Instead of asking Arizonans to guess how to help a school, Meridian publishes the remaining items, the campus they belong to, and the education law that sits behind that classroom.**

## Wow moment

Maria’s dry-erase markers move **8/20 → 13/20** in place, the request stays open because notebooks are not done, and HB 2316 (middle-school CTE) sits on the same page.

## Demo reset

`Reset demo` restores seeded state. Maria markers start at **8 / 20**. Give 5 → 13/20. Give remaining → 20/20.

## Stack

Next.js + Tailwind, Leaflet (no map API key), seeded TypeScript data, localStorage demo store. No payments, no auth complexity, no live bill scraper.

## What we did not build

Real payments, shipping carriers, identity verification, admin CMS, AI chatbot, national expansion, custom GIS, recommender systems, thousands of schools.

## Weakest judge categories before this prototype (and the fix)

1. **Originality** — lead with remaining-need ledger + civic adjacency, never “DonorsChoose for Arizona.”
2. **Business model** — this demo does not pretend to have one beyond “prototype.” Future: district/civic underwriting + optional fulfillment fees, not a surprise take-rate on crayons.
3. **Trust** — labeled demo vs legislation, campus-only location, honest verification badge, last-verified dates on bills.
