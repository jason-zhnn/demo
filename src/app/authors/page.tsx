import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AuthorsPage() {
  const authors = await prisma.author.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { books: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Authors</h1>
      <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
        {authors.map((author) => (
          <li key={author.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <Link href={`/authors/${author.id}`} className="font-medium hover:underline">
                {author.name}
              </Link>
              {author.bio && (
                <p className="text-sm text-neutral-600">
                  {author.bio.length > 90 ? `${author.bio.slice(0, 90)}…` : author.bio}
                </p>
              )}
            </div>
            <span className="text-sm text-neutral-600">{author._count.books} books</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
