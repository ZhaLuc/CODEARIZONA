# Contributing

This is a Code Arizona hackathon repository. There is no large open-source governance process.

## Local development

```bash
npm install
npm run dev
```

http://localhost:3000

Optional:

```bash
npm run lint
npm run build
```

No `.env` file is required.

## Changing the product

- Keep remaining-need math in `src/lib/fulfillment.ts`. Pending must not increment verified.
- Keep campus coordinates public. Do not add home addresses.
- Keep policy copy as adjacency. Do not imply a bill funds a classroom unless an official source says so.
- Do not add "demo," "prototype," or "fake" language to product UI.

## Branches and pull requests

If you use git branches, keep them small and named after the change. Open a pull request with:

- what changed
- how to reset and reproduce
- screenshots if the UI moved

There is no required branch naming convention in this repo today.

## Issues

Describe the remaining-need or verification bug with the request id, item, and whether reset was used. Seeded baseline for markers is 8 / 20 on `req-weather-lab`.

## Tests

There is no automated test suite in this repository. Manual reproduction: [demo.md](demo.md).
