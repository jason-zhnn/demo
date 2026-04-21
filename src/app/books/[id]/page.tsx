import Link from "next/link";
import { notFound } from "next/navigation";
import { getBook } from "@/lib/books";
import { formatPages } from "@/lib/format";

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookId = Number(id);
  if (!Number.isFinite(bookId)) notFound();

  const book = await getBook(bookId);
  if (!book) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/library" className="text-sm text-neutral-600 hover:underline">
          ← Library
        </Link>
      </div>

      <header className="space-y-2">
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
      </header>

      <section className="space-y-2">
        <h2 className="text-sm font-medium uppercase text-neutral-500">Shelves</h2>
        <div className="flex flex-wrap gap-2">
          {book.shelves.length === 0 ? (
            <p className="text-sm text-neutral-500">Not on any shelf.</p>
          ) : (
            book.shelves.map((s) => (
              <Link
                key={s.shelfId}
                href={`/shelves/${s.shelf.slug}`}
                className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-sm hover:border-neutral-500"
              >
                {s.shelf.name}
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium uppercase text-neutral-500">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {book.tags.length === 0 ? (
            <p className="text-sm text-neutral-500">No tags.</p>
          ) : (
            book.tags.map((t) => (
              <Link
                key={t.tagId}
                href={`/tags/${t.tag.slug}`}
                className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700 hover:bg-neutral-200"
              >
                {t.tag.name}
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium uppercase text-neutral-500">Notes</h2>
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
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium uppercase text-neutral-500">Reading sessions</h2>
        {book.sessions.length === 0 ? (
          <p className="text-sm text-neutral-500">No sessions logged.</p>
        ) : (
          <ul className="space-y-2">
            {book.sessions.map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between rounded border border-neutral-200 bg-white p-3 text-sm"
              >
                <span>{session.startedAt.toISOString().slice(0, 10)}</span>
                <span>{formatPages(session.pagesRead)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
