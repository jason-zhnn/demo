import { prisma } from "./prisma";

export type LibraryFilters = {
  search?: string;
  shelfSlug?: string;
  tagSlug?: string;
  authorId?: number;
};

export async function listBooks(filters: LibraryFilters = {}) {
  const { search, shelfSlug, tagSlug, authorId } = filters;

  return prisma.book.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search } },
                { subtitle: { contains: search } },
                { authors: { some: { author: { name: { contains: search } } } } },
              ],
            }
          : {},
        shelfSlug ? { shelves: { some: { shelf: { slug: shelfSlug } } } } : {},
        tagSlug ? { tags: { some: { tag: { slug: tagSlug } } } } : {},
        authorId ? { authors: { some: { authorId } } } : {},
      ],
    },
    include: {
      authors: { include: { author: true } },
      shelves: { include: { shelf: true } },
      tags: { include: { tag: true } },
    },
    orderBy: { title: "asc" },
  });
}

export async function getBook(id: number) {
  return prisma.book.findUnique({
    where: { id },
    include: {
      authors: { include: { author: true } },
      shelves: { include: { shelf: true } },
      tags: { include: { tag: true } },
      notes: { orderBy: { createdAt: "desc" } },
      sessions: { orderBy: { startedAt: "desc" } },
    },
  });
}
