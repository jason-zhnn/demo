import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { listBooks } from "@/lib/books";
import { yearStats } from "@/lib/stats";
import { BookCard } from "@/components/BookCard";

export default async function HomePage() {
  const currentYear = new Date().getFullYear();

  const [currentReads, recentNotes, stats, goal] = await Promise.all([
    listBooks({ shelfSlug: "reading" }),
    prisma.note.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { book: true },
    }),
    yearStats(currentYear),
    prisma.goal.findUnique({ where: { year: currentYear } }),
  ]);

  const percent = goal ? Math.min(100, Math.round((stats.booksFinished / goal.targetBooks) * 100)) : null;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-neutral-600">Shelf — personal reading tracker.</p>
      </header>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase text-neutral-500">Currently reading</h2>
          <Link href="/library?shelf=reading" className="text-sm text-neutral-600 hover:underline">
            View all
          </Link>
        </div>
        {currentReads.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-300 bg-white p-6 text-center text-neutral-500">
            Nothing in progress right now.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentReads.map((book) => (
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
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase text-neutral-500">Recent notes</h2>
            <Link href="/notes" className="text-sm text-neutral-600 hover:underline">
              All notes
            </Link>
          </div>
          {recentNotes.length === 0 ? (
            <p className="rounded border border-dashed border-neutral-300 bg-white p-4 text-center text-sm text-neutral-500">
              No notes yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {recentNotes.map((note) => (
                <li key={note.id} className="rounded border border-neutral-200 bg-white p-3 text-sm">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <Link href={`/books/${note.bookId}`} className="font-medium text-neutral-700 hover:underline">
                      {note.book.title}
                    </Link>
                    <span>{note.createdAt.toISOString().slice(0, 10)}</span>
                  </div>
                  <p className="mt-1">{note.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase text-neutral-500">{currentYear} progress</h2>
            <Link href="/stats" className="text-sm text-neutral-600 hover:underline">
              Full stats
            </Link>
          </div>
          <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4 text-sm">
            <div className="flex items-center justify-between">
              <span>Books finished</span>
              <span className="font-medium">
                {stats.booksFinished}
                {goal ? ` / ${goal.targetBooks}` : ""}
              </span>
            </div>
            {percent != null && (
              <div className="h-2 w-full rounded bg-neutral-100">
                <div className="h-2 rounded bg-neutral-900" style={{ width: `${percent}%` }} />
              </div>
            )}
            <div className="flex items-center justify-between">
              <span>Pages read</span>
              <span className="font-medium">{stats.pagesRead.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Sessions</span>
              <span className="font-medium">{stats.sessionCount}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
