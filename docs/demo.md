# Demo

Use this sequence for Code Arizona, future judges, and anyone reproducing the remaining-need loop.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

No environment file. No map API key.

## Reset

Use **Reset** in the desktop header, or **Reset session** in the footer, mobile menu, and account page.

Reset restores seeded classroom quantities and clears fulfillment events. It keeps whoever is signed in.

After reset, **Hands-on Weather & Climate Lab** (`req-weather-lab`, Isaac Middle School, Phoenix) should show:

| Item | Verified / needed |
| --- | --- |
| Construction paper packs | 10 / 10 (closed) |
| Dry-erase markers | 8 / 20 |
| Student thermometers | 4 / 20 |
| Poster paper rolls | 1 / 5 |
| Student lab notebooks | 12 / 30 |

There should be no pending events.

## Seeded accounts

| Role | Email | Password | One-click on `/signin` |
| --- | --- | --- | --- |
| Community | jordan.lee@phoenix.az | meridian | **Jordan Lee** / Community member |
| Teacher | maria.hernandez@isaacms.az | meridian | **Maria Hernandez** / Teacher |

The page heading is **Continue with an existing account**. Buttons show the name and role. These are session accounts in `src/data/accounts.ts`, not production identity. Do not use the staff admin account in the walkthrough.

## Community member flow

1. Sign in as Jordan Lee.
2. Open Activity. It should be empty or show only prior session events if you skipped reset.
3. Open Explore. Filter or search toward Isaac Middle School, Phoenix.
4. Open **Hands-on Weather & Climate Lab**.

## Shipping flow

1. On the request, choose dry-erase markers, quantity **5**.
2. Continue. Choose **Ship**.
3. Select a shipping-label or packing photo (JPG, PNG, or WEBP).
4. Confirm preview and filename. Submit for review.
5. Ledger should still read **8 / 20** verified. Pending should show **5**.
6. Activity should list the shipment as under review.

## In-person flow

1. Stay signed in as Jordan, or reset and repeat to a clean ledger if you want a single pending pile for Maria.
2. On the same request, choose student lab notebooks, quantity **3** (or any remaining amount).
3. Choose **In person**.
4. Submit without an image.
5. Status: awaiting teacher confirmation. Verified notebooks stay **12 / 30**.

## Teacher flow

1. Sign out. Sign in as Maria Hernandez.
2. Open Activity / teacher desk.
3. Two pending items should appear if you completed both channels: shipment with evidence, in-person handoff without evidence.
4. Verify the shipment. Rejected shipments stay in history and do not increase verified.
5. Confirm received on the in-person event.

After verifying 5 markers: **13 / 20** verified, **7 remaining**.

## Policy flow

From the Weather & Climate Lab page, read **Policy relevant to this classroom**. Open a related bill. Follow the official Legislature link. Use Find your legislators. Do not claim the bill funds this classroom.

## Map flow

Open Explore. Confirm pins outside Phoenix (Tucson, Flagstaff, Yuma, and other seeded campuses). Remaining counts sit on campus coordinates, not home addresses.

## Recommended 90-second presentation

1. Community member logs in.
2. Dashboard / activity is empty after reset.
3. Explore filters to Isaac Middle School.
4. Item ledger: verified, pending, remaining.
5. Select thermometers or markers.
6. Choose shipping.
7. Upload shipping evidence.
8. Contribution enters review. Public verified count does not move.
9. Record an in-person fulfillment.
10. Teacher sees two items awaiting action.
11. Teacher verifies.
12. Ledger updates.

Do not call the product a demo, prototype, or fake during the walkthrough. Docs may describe hackathon infrastructure separately.
