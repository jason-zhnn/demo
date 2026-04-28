import { prisma } from "./prisma";
import { toSlug } from "./slug";

export type ExportBundle = {
  exportedAt: string;
  authors: { name: string; bio: string | null }[];
  shelves: { name: string; slug: string; description: string | null }[];
  tags: { name: string; slug: string; color: string | null }[];
  goals: { year: number; targetBooks: number }[];
  books: {
    title: string;
    subtitle: string | null;
    isbn: string | null;
    pageCount: number | null;
    coverUrl: string | null;
    publishedYear: number | null;
    rating?: number | null;
    authors: string[];
    shelves: string[];
    tags: string[];
    notes: { page: number | null; body: string; createdAt: string }[];
    sessions: { startedAt: string; endedAt: string | null; pagesRead: number }[];
  }[];
};

export async function buildExport(): Promise<ExportBundle> {
  const [authors, shelves, tags, goals, books] = await Promise.all([
    prisma.author.findMany({ orderBy: { name: "asc" } }),
    prisma.shelf.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.goal.findMany({ orderBy: { year: "asc" } }),
    prisma.book.findMany({
      orderBy: { title: "asc" },
      include: {
        authors: { include: { author: true } },
        shelves: { include: { shelf: true } },
        tags: { include: { tag: true } },
        notes: { orderBy: { createdAt: "asc" } },
        sessions: { orderBy: { startedAt: "asc" } },
      },
    }),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    authors: authors.map((author) => ({ name: author.name, bio: author.bio })),
    shelves: shelves.map((shelf) => ({
      name: shelf.name,
      slug: shelf.slug,
      description: shelf.description,
    })),
    tags: tags.map((tag) => ({ name: tag.name, slug: tag.slug, color: tag.color })),
    goals: goals.map((goal) => ({ year: goal.year, targetBooks: goal.targetBooks })),
    books: books.map((book) => ({
      title: book.title,
      subtitle: book.subtitle,
      isbn: book.isbn,
      pageCount: book.pageCount,
      coverUrl: book.coverUrl,
      publishedYear: book.publishedYear,
      rating: book.rating,
      authors: book.authors.map((a) => a.author.name),
      shelves: book.shelves.map((s) => s.shelf.slug),
      tags: book.tags.map((t) => t.tag.slug),
      notes: book.notes.map((note) => ({
        page: note.page,
        body: note.body,
        createdAt: note.createdAt.toISOString(),
      })),
      sessions: book.sessions.map((session) => ({
        startedAt: session.startedAt.toISOString(),
        endedAt: session.endedAt ? session.endedAt.toISOString() : null,
        pagesRead: session.pagesRead,
      })),
    })),
  };
}

export type ImportResult = { created: number; skipped: number };

export async function applyImport(bundle: ExportBundle): Promise<ImportResult> {
  let created = 0;
  let skipped = 0;

  const authorIdByName = new Map<string, number>();
  for (const author of bundle.authors) {
    const row = await prisma.author.upsert({
      where: { name: author.name },
      update: { bio: author.bio ?? undefined },
      create: { name: author.name, bio: author.bio },
    });
    authorIdByName.set(author.name, row.id);
  }

  const shelfIdBySlug = new Map<string, number>();
  for (const shelf of bundle.shelves) {
    const slug = shelf.slug || toSlug(shelf.name);
    const row = await prisma.shelf.upsert({
      where: { slug },
      update: { name: shelf.name, description: shelf.description ?? undefined },
      create: { slug, name: shelf.name, description: shelf.description },
    });
    shelfIdBySlug.set(slug, row.id);
  }

  const tagIdBySlug = new Map<string, number>();
  for (const tag of bundle.tags) {
    const slug = tag.slug || toSlug(tag.name);
    const row = await prisma.tag.upsert({
      where: { slug },
      update: { name: tag.name, color: tag.color ?? undefined },
      create: { slug, name: tag.name, color: tag.color },
    });
    tagIdBySlug.set(slug, row.id);
  }

  for (const goal of bundle.goals) {
    await prisma.goal.upsert({
      where: { year: goal.year },
      update: { targetBooks: goal.targetBooks },
      create: { year: goal.year, targetBooks: goal.targetBooks },
    });
  }

  for (const book of bundle.books) {
    const existing = book.isbn
      ? await prisma.book.findUnique({ where: { isbn: book.isbn } })
      : await prisma.book.findFirst({ where: { title: book.title } });
    if (existing) {
      skipped += 1;
      continue;
    }

    const authorIds: number[] = [];
    for (const name of book.authors) {
      let id = authorIdByName.get(name);
      if (!id) {
        const row = await prisma.author.upsert({
          where: { name },
          update: {},
          create: { name },
        });
        id = row.id;
        authorIdByName.set(name, id);
      }
      authorIds.push(id);
    }

    const shelfIds: number[] = [];
    for (const slug of book.shelves) {
      const id = shelfIdBySlug.get(slug);
      if (id) shelfIds.push(id);
    }

    const tagIds: number[] = [];
    for (const slug of book.tags) {
      const id = tagIdBySlug.get(slug);
      if (id) tagIds.push(id);
    }

    await prisma.book.create({
      data: {
        title: book.title,
        subtitle: book.subtitle,
        isbn: book.isbn,
        pageCount: book.pageCount,
        coverUrl: book.coverUrl,
        publishedYear: book.publishedYear,
        rating: book.rating ?? null,
        authors: { create: authorIds.map((authorId) => ({ authorId })) },
        shelves: { create: shelfIds.map((shelfId) => ({ shelfId })) },
        tags: { create: tagIds.map((tagId) => ({ tagId })) },
        notes: {
          create: book.notes.map((note) => ({
            page: note.page,
            body: note.body,
            createdAt: new Date(note.createdAt),
          })),
        },
        sessions: {
          create: book.sessions.map((session) => ({
            startedAt: new Date(session.startedAt),
            endedAt: session.endedAt ? new Date(session.endedAt) : null,
            pagesRead: session.pagesRead,
          })),
        },
      },
    });
    created += 1;
  }

  return { created, skipped };
}
