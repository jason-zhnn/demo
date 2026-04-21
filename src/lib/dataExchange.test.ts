import { describe, it, expect } from "vitest";
import { buildExport, applyImport } from "./dataExchange";
import { prisma } from "./prisma";

describe("data exchange", () => {
  it("round-trips the current catalog without creating duplicates", async () => {
    const before = await buildExport();
    const bookCountBefore = await prisma.book.count();

    const result = await applyImport(before);
    expect(result.created).toBe(0);
    expect(result.skipped).toBe(bookCountBefore);

    const bookCountAfter = await prisma.book.count();
    expect(bookCountAfter).toBe(bookCountBefore);
  });

  it("creates new books that are not yet present", async () => {
    const current = await buildExport();
    const stub: typeof current = {
      ...current,
      books: [
        {
          title: "__Test Import Book__",
          subtitle: null,
          isbn: `TEST-${Date.now()}`,
          pageCount: 120,
          coverUrl: null,
          publishedYear: 2026,
          authors: [],
          shelves: [],
          tags: [],
          notes: [],
          sessions: [],
        },
      ],
    };

    const result = await applyImport(stub);
    expect(result.created).toBe(1);

    await prisma.book.deleteMany({ where: { title: "__Test Import Book__" } });
  });
});
