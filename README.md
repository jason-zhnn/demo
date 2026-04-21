## Shelf

Shelf is a single-user personal reading tracker: books, authors, shelves, tags, notes, reading sessions, yearly goals, and JSON import/export. Built with Next.js 15 (App Router), Prisma + SQLite, Tailwind, and Server Actions. Documentation for this project lives in Memoir, not in this repository.

### Quickstart

```sh
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Tests: `npm test` (Vitest) and `npx playwright test` (smoke).
