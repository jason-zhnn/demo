import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookCard } from "@/components/BookCard";
import { updateAuthor, deleteAuthor } from "../actions";

export default async function AuthorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authorId = Number(id);
  if (!Number.isFinite(authorId)) notFound();

  const author = await prisma.author.findUnique({
    where: { id: authorId },
    include: {
      books: {
        include: {
          book: {
            include: {
              authors: { include: { author: true } },
              tags: { include: { tag: true } },
            },
          },
        },
      },
    },
  });
  if (!author) notFound();

  const books = author.books.map((entry) => entry.book);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/authors" className="text-sm text-neutral-600 hover:underline">
          ← Authors
        </Link>
      </div>

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{author.name}</h1>
        {author.bio && <p className="text-neutral-700">{author.bio}</p>}
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase text-neutral-500">Books</h2>
        {books.length === 0 ? (
          <p className="text-sm text-neutral-500">No books linked to this author.</p>
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
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase text-neutral-500">Edit author</h2>
        <form
          action={updateAuthor.bind(null, author.id)}
          className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4"
        >
          <label className="flex flex-col text-sm">
            <span className="text-neutral-600">Name</span>
            <input
              name="name"
              required
              defaultValue={author.name}
              className="mt-1 rounded border border-neutral-300 px-2 py-1"
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-neutral-600">Bio</span>
            <textarea
              name="bio"
              rows={3}
              defaultValue={author.bio ?? ""}
              className="mt-1 rounded border border-neutral-300 px-2 py-1"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-700"
            >
              Save
            </button>
          </div>
        </form>
        <form action={deleteAuthor.bind(null, author.id)}>
          <button
            type="submit"
            className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:border-red-500"
          >
            Delete author
          </button>
        </form>
      </section>
    </div>
  );
}
