import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { listBooks } from "@/lib/books";
import { BookCard } from "@/components/BookCard";

export default async function ShelfDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shelf = await prisma.shelf.findUnique({ where: { slug } });
  if (!shelf) notFound();

  const books = await listBooks({ shelfSlug: slug });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/shelves" className="text-sm text-neutral-600 hover:underline">
          ← Shelves
        </Link>
      </div>
      <header>
        <h1 className="text-2xl font-semibold">{shelf.name}</h1>
        {shelf.description && <p className="text-neutral-600">{shelf.description}</p>}
      </header>
      {books.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 bg-white p-6 text-center text-neutral-500">
          No books on this shelf.
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
