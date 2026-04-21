import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPages } from "@/lib/format";
import { sessionDurationMinutes } from "@/lib/sessions";
import { deleteSession } from "./actions";

export default async function SessionsPage() {
  const sessions = await prisma.readingSession.findMany({
    orderBy: { startedAt: "desc" },
    include: { book: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Reading sessions</h1>
      {sessions.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 bg-white p-6 text-center text-neutral-500">
          No sessions logged.
        </p>
      ) : (
        <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
          {sessions.map((session) => {
            const minutes = sessionDurationMinutes(session.startedAt, session.endedAt);
            return (
              <li key={session.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <Link href={`/books/${session.bookId}`} className="font-medium hover:underline">
                    {session.book.title}
                  </Link>
                  <p className="text-xs text-neutral-500">
                    {session.startedAt.toISOString().slice(0, 16).replace("T", " ")}
                    {minutes != null ? ` · ${minutes} min` : " · open"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span>{formatPages(session.pagesRead)}</span>
                  <form action={deleteSession.bind(null, session.id)}>
                    <button
                      type="submit"
                      className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:border-red-500"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
