import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { listBooks, getBook } from "./books";
import { prisma } from "./prisma";

describe("books queries", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("returns all seeded books with no filters", async () => {
    const books = await listBooks();
    expect(books.length).toBeGreaterThanOrEqual(20);
  });

  it("filters by shelf slug", async () => {
    const readingBooks = await listBooks({ shelfSlug: "reading" });
    expect(readingBooks.length).toBeGreaterThan(0);
    for (const book of readingBooks) {
      expect(book.shelves.some((s) => s.shelf.slug === "reading")).toBe(true);
    }
  });

  it("filters by tag slug", async () => {
    const sciFi = await listBooks({ tagSlug: "sci-fi" });
    expect(sciFi.length).toBeGreaterThan(0);
    for (const book of sciFi) {
      expect(book.tags.some((t) => t.tag.slug === "sci-fi")).toBe(true);
    }
  });

  it("search matches titles case-insensitively", async () => {
    const results = await listBooks({ search: "invisible" });
    expect(results.some((book) => book.title.toLowerCase().includes("invisible"))).toBe(true);
  });

  it("getBook loads relations", async () => {
    const [first] = await listBooks();
    const loaded = await getBook(first.id);
    expect(loaded).not.toBeNull();
    expect(loaded!.authors).toBeDefined();
    expect(loaded!.notes).toBeDefined();
    expect(loaded!.sessions).toBeDefined();
  });
});
