import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createShelf, deleteShelf } from "./actions";

export default async function ShelvesPage() {
  const shelves = await prisma.shelf.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { books: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Shelves</h1>

      <form action={createShelf} className="flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <label className="flex flex-col text-xs text-neutral-600">
          Name
          <input name="name" required className="mt-1 rounded border border-neutral-300 px-2 py-1 text-sm" />
        </label>
        <label className="flex flex-1 flex-col text-xs text-neutral-600">
          Description
          <input name="description" className="mt-1 rounded border border-neutral-300 px-2 py-1 text-sm" />
        </label>
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-700"
        >
          Create shelf
        </button>
      </form>

      <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
        {shelves.map((shelf) => (
          <li key={shelf.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <Link href={`/shelves/${shelf.slug}`} className="font-medium hover:underline">
                {shelf.name}
              </Link>
              {shelf.description && <p className="text-sm text-neutral-600">{shelf.description}</p>}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-600">{shelf._count.books} books</span>
              <form action={deleteShelf.bind(null, shelf.id)}>
                <button
                  type="submit"
                  className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:border-red-500"
                >
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
