import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createTag, deleteTag } from "./actions";

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { books: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Tags</h1>

      <form action={createTag} className="flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <label className="flex flex-col text-xs text-neutral-600">
          Name
          <input name="name" required className="mt-1 rounded border border-neutral-300 px-2 py-1 text-sm" />
        </label>
        <label className="flex flex-col text-xs text-neutral-600">
          Color (hex)
          <input
            name="color"
            placeholder="#4f46e5"
            className="mt-1 rounded border border-neutral-300 px-2 py-1 text-sm"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-700"
        >
          Create tag
        </button>
      </form>

      <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
        {tags.map((tag) => (
          <li key={tag.id} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {tag.color && (
                <span
                  className="inline-block h-3 w-3 rounded-full border border-neutral-300"
                  style={{ backgroundColor: tag.color }}
                  aria-hidden
                />
              )}
              <Link href={`/tags/${tag.slug}`} className="font-medium hover:underline">
                {tag.name}
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-600">{tag._count.books} books</span>
              <form action={deleteTag.bind(null, tag.id)}>
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
