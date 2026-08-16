# Security and privacy

This document describes what the Code Arizona build actually does. It is not an enterprise security claim.

## Location

Classroom pins use public campus coordinates. The product does not collect or display teacher home addresses.

## Students

No student names, photos, grades, or other personal student information are collected.

## Accounts

Auth is a client-side session against seeded emails and locally created accounts (`src/lib/store.tsx`). Passwords are not a production identity system. Do not reuse these credentials elsewhere.

Roles:

| Role | Boundary in this build |
| --- | --- |
| Community | Submit fulfillment; cannot call teacher review actions |
| Teacher | Maria's seeded account can review events for her classroom (`teacherId` match). New teacher sign-ups have no classroom binding. Signed-in teachers can still submit fulfillment as users; that is not blocked in this build. |
| Admin | Seeded staff account can review events. Do not use it in the public walkthrough. |

## Fulfillment evidence

Shipping images are read in the browser, resized, and stored as a data URL in `localStorage` with filename metadata. There is no server upload, virus scan, or object-store ACL. Anyone with the browser profile can see that session's evidence previews.

## Teacher verification

Only the teacher review actions change an event from pending to verified, rejected, or not received. Community members cannot self-verify.

## What is not implemented

- Institutional identity verification (AZEDS, district SSO, educator credential checks)
- Encrypted storage at rest beyond whatever the browser provides
- Audit logs outside the in-memory / localStorage event list
- Content moderation of uploaded images
- Rate limiting, CSRF protection on a backend (there is no backend)
- Production session cookies or token rotation

## Future production considerations

If Meridian left the hackathon prototype:

- Verify schools and teachers through institutions, not self-serve email
- Store evidence in access-controlled object storage with retention limits
- Keep remaining-need math on a server of record
- Continue campus-only geography
- Continue excluding student PII from public ledgers
