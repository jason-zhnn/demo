import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { listBooks } from "@/lib/books";
import { BookCard } from "@/components/BookCard";

type LibraryPageProps = {
  searchParams: Promise<{ q?: string; shelf?: string; tag?: string; author?: string }>;
};

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const params = await searchParams;
  const authorId = params.author ? Number(params.author) : undefined;

  const [books, shelves, tags, authors] = await Promise.all([
    listBooks({
      search: params.q,
      shelfSlug: params.shelf,
      tagSlug: params.tag,
      authorId: Number.isFinite(authorId) ? authorId : undefined,
    }),
    prisma.shelf.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.author.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Library</h1>
        <Link
          href="/books/new"
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-700"
        >
          Add book
        </Link>
      </div>

      <form className="flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <label className="flex flex-col text-xs text-neutral-600">
          Search
          <input
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Title, subtitle, author"
            className="mt-1 rounded border border-neutral-300 px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col text-xs text-neutral-600">
          Shelf
          <select
            name="shelf"
            defaultValue={params.shelf ?? ""}
            className="mt-1 rounded border border-neutral-300 px-2 py-1 text-sm"
          >
            <option value="">Any</option>
            {shelves.map((shelf) => (
              <option key={shelf.id} value={shelf.slug}>
                {shelf.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-xs text-neutral-600">
          Tag
          <select
            name="tag"
            defaultValue={params.tag ?? ""}
            className="mt-1 rounded border border-neutral-300 px-2 py-1 text-sm"
          >
            <option value="">Any</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.slug}>
                {tag.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-xs text-neutral-600">
          Author
          <select
            name="author"
            defaultValue={params.author ?? ""}
            className="mt-1 rounded border border-neutral-300 px-2 py-1 text-sm"
          >
            <option value="">Any</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-700"
        >
          Apply
        </button>
        <Link href="/library" className="text-sm text-neutral-600 underline">
          Reset
        </Link>
      </form>

      <p className="text-sm text-neutral-600">
        {books.length} {books.length === 1 ? "book" : "books"}
      </p>

      {books.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
          No books match those filters.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              subtitle={book.subtitle}
              authorNames={book.authors.map((a) => a.author.name)}
              tagNames={book.tags.map((t) => t.tag.name)}
              publishedYear={book.publishedYear}
              coverUrl={book.coverUrl}
              rating={book.rating}
            />
          ))}
        </div>
      )}
    </div>
  );
}
