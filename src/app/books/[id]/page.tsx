import Link from "next/link";
import { notFound } from "next/navigation";
import { getBook } from "@/lib/books";
import { formatPages } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { deleteBook } from "../actions";
import { toggleBookOnShelf } from "@/app/shelves/actions";
import { toggleBookTag } from "@/app/tags/actions";
import { createNote, deleteNote } from "@/app/notes/actions";
import { createSession, deleteSession } from "@/app/sessions/actions";
import { sessionDurationMinutes } from "@/lib/sessions";
import { BookRatingControl } from "@/components/BookRatingControl";

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookId = Number(id);
  if (!Number.isFinite(bookId)) notFound();

  const book = await getBook(bookId);
  if (!book) notFound();

  const allShelves = await prisma.shelf.findMany({ orderBy: { name: "asc" } });
  const currentShelfIds = new Set(book.shelves.map((s) => s.shelfId));
  const allTags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
  const currentTagIds = new Set(book.tags.map((t) => t.tagId));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/library" className="text-sm text-neutral-600 hover:underline">
          ← Library
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/books/${book.id}/edit`}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm hover:border-neutral-500"
          >
            Edit
          </Link>
          <form action={deleteBook.bind(null, book.id)}>
            <button
              type="submit"
              className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm text-red-700 hover:border-red-500"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      <header className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="aspect-[2/3] w-32 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 sm:w-40">
          {book.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-wide text-neutral-400">
              No cover
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-3xl font-semibold">{book.title}</h1>
          {book.subtitle && <p className="text-lg text-neutral-600">{book.subtitle}</p>}
          <p className="text-sm text-neutral-700">
            {book.authors.map((a, index) => (
              <span key={a.authorId}>
                <Link href={`/authors/${a.authorId}`} className="hover:underline">
                  {a.author.name}
                </Link>
                {index < book.authors.length - 1 && ", "}
              </span>
            ))}
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {book.publishedYear && (
              <div>
                <dt className="text-neutral-500">Published</dt>
                <dd>{book.publishedYear}</dd>
              </div>
            )}
            {book.pageCount && (
              <div>
                <dt className="text-neutral-500">Length</dt>
                <dd>{formatPages(book.pageCount)}</dd>
              </div>
            )}
            {book.isbn && (
              <div>
                <dt className="text-neutral-500">ISBN</dt>
                <dd className="font-mono text-xs">{book.isbn}</dd>
              </div>
            )}
          </dl>
        </div>
      </header>

      <section className="space-y-2">
        <h2 className="text-sm font-medium uppercase text-neutral-500">Rating</h2>
        <BookRatingControl bookId={book.id} rating={book.rating} />
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium uppercase text-neutral-500">Shelves</h2>
        <div className="flex flex-wrap gap-2">
          {allShelves.map((shelf) => {
            const isOn = currentShelfIds.has(shelf.id);
            return (
              <form key={shelf.id} action={toggleBookOnShelf.bind(null, book.id, shelf.id)}>
                <button
                  type="submit"
                  className={
                    isOn
                      ? "rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1 text-sm text-white"
                      : "rounded-full border border-neutral-300 bg-white px-3 py-1 text-sm text-neutral-700 hover:border-neutral-500"
                  }
                >
                  {shelf.name}
                </button>
              </form>
            );
          })}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium uppercase text-neutral-500">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isOn = currentTagIds.has(tag.id);
            return (
              <form key={tag.id} action={toggleBookTag.bind(null, book.id, tag.id)}>
                <button
                  type="submit"
                  className={
                    isOn
                      ? "rounded-full border border-neutral-900 bg-neutral-900 px-2.5 py-0.5 text-xs text-white"
                      : "rounded-full border border-neutral-300 bg-white px-2.5 py-0.5 text-xs text-neutral-700 hover:border-neutral-500"
                  }
                >
                  {tag.name}
                </button>
              </form>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase text-neutral-500">Notes</h2>
        <form
          action={createNote.bind(null, book.id)}
          className="space-y-2 rounded border border-neutral-200 bg-white p-3 text-sm"
        >
          <div className="flex gap-2">
            <input
              name="page"
              type="number"
              min={0}
              placeholder="Page"
              className="w-24 rounded border border-neutral-300 px-2 py-1 text-sm"
            />
            <input
              name="body"
              required
              placeholder="Add a note…"
              className="flex-1 rounded border border-neutral-300 px-2 py-1 text-sm"
            />
            <button
              type="submit"
              className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-700"
            >
              Save
            </button>
          </div>
        </form>
        {book.notes.length === 0 ? (
          <p className="text-sm text-neutral-500">No notes yet.</p>
        ) : (
          <ul className="space-y-3">
            {book.notes.map((note) => (
              <li key={note.id} className="rounded border border-neutral-200 bg-white p-3 text-sm">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>{note.page ? `Page ${note.page}` : "General"}</span>
                  <span>{note.createdAt.toISOString().slice(0, 10)}</span>
                </div>
                <p className="mt-1">{note.body}</p>
                <form action={deleteNote.bind(null, note.id)} className="mt-2">
                  <button
                    type="submit"
                    className="text-xs text-red-700 hover:underline"
                  >
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase text-neutral-500">Reading sessions</h2>
        <form
          action={createSession.bind(null, book.id)}
          className="space-y-2 rounded border border-neutral-200 bg-white p-3 text-sm"
        >
          <div className="grid gap-2 sm:grid-cols-4">
            <label className="flex flex-col text-xs text-neutral-600">
              Started at
              <input
                name="startedAt"
                type="datetime-local"
                className="mt-1 rounded border border-neutral-300 px-2 py-1 text-sm"
              />
            </label>
            <label className="flex flex-col text-xs text-neutral-600">
              Ended at
              <input
                name="endedAt"
                type="datetime-local"
                className="mt-1 rounded border border-neutral-300 px-2 py-1 text-sm"
              />
            </label>
            <label className="flex flex-col text-xs text-neutral-600">
              Pages read
              <input
                name="pagesRead"
                type="number"
                min={0}
                defaultValue={0}
                className="mt-1 rounded border border-neutral-300 px-2 py-1 text-sm"
              />
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-700"
              >
                Log session
              </button>
            </div>
          </div>
        </form>
        {book.sessions.length === 0 ? (
          <p className="text-sm text-neutral-500">No sessions logged.</p>
        ) : (
          <ul className="space-y-2">
            {book.sessions.map((session) => {
              const minutes = sessionDurationMinutes(session.startedAt, session.endedAt);
              return (
                <li
                  key={session.id}
                  className="flex items-center justify-between rounded border border-neutral-200 bg-white p-3 text-sm"
                >
                  <div>
                    <p>{session.startedAt.toISOString().slice(0, 10)}</p>
                    <p className="text-xs text-neutral-500">
                      {minutes != null ? `${minutes} min` : "open"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{formatPages(session.pagesRead)}</span>
                    <form action={deleteSession.bind(null, session.id)}>
                      <button type="submit" className="text-xs text-red-700 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
