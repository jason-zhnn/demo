import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteNote } from "./actions";

type NotesPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const { q } = await searchParams;

  const notes = await prisma.note.findMany({
    where: q ? { body: { contains: q } } : undefined,
    orderBy: { createdAt: "desc" },
    include: { book: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Notes</h1>

      <form className="flex items-end gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <label className="flex flex-1 flex-col text-xs text-neutral-600">
          Search notes
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Full-text across note bodies"
            className="mt-1 rounded border border-neutral-300 px-2 py-1 text-sm"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-700"
        >
          Search
        </button>
        {q && (
          <Link href="/notes" className="text-sm text-neutral-600 underline">
            Clear
          </Link>
        )}
      </form>

      <p className="text-sm text-neutral-600">
        {notes.length} {notes.length === 1 ? "note" : "notes"}
      </p>

      {notes.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 bg-white p-6 text-center text-neutral-500">
          No notes yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="rounded border border-neutral-200 bg-white p-4 text-sm">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <Link href={`/books/${note.bookId}`} className="font-medium text-neutral-700 hover:underline">
                  {note.book.title}
                </Link>
                <span>
                  {note.page ? `Page ${note.page} · ` : ""}
                  {note.createdAt.toISOString().slice(0, 10)}
                </span>
              </div>
              <p className="mt-2">{note.body}</p>
              <form action={deleteNote.bind(null, note.id)} className="mt-3">
                <button
                  type="submit"
                  className="rounded border border-red-300 px-2 py-0.5 text-xs text-red-700 hover:border-red-500"
                >
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
