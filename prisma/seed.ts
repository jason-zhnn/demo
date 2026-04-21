import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SeedBook = {
  title: string;
  subtitle?: string;
  isbn?: string;
  pageCount?: number;
  publishedYear?: number;
  authors: string[];
  shelves: string[];
  tags: string[];
  notes?: { page?: number; body: string; daysAgo: number }[];
  sessions?: { daysAgo: number; durationMinutes: number; pagesRead: number }[];
};

const authors: { name: string; bio: string }[] = [
  { name: "Ursula K. Le Guin", bio: "American author best known for speculative fiction." },
  { name: "Italo Calvino", bio: "Italian journalist and writer of short stories and novels." },
  { name: "Toni Morrison", bio: "American novelist and Nobel laureate." },
  { name: "Jorge Luis Borges", bio: "Argentine writer of short fiction and essays." },
  { name: "Octavia Butler", bio: "American science fiction author." },
  { name: "Haruki Murakami", bio: "Japanese novelist and essayist." },
  { name: "Kazuo Ishiguro", bio: "British novelist and Nobel laureate." },
  { name: "Zadie Smith", bio: "British novelist and essayist." },
  { name: "N. K. Jemisin", bio: "American speculative fiction writer." },
  { name: "Ted Chiang", bio: "American science fiction writer known for short fiction." },
  { name: "Annie Dillard", bio: "American author of essays and nonfiction." },
];

const shelves: { name: string; slug: string; description: string }[] = [
  { name: "Reading", slug: "reading", description: "Books currently in progress." },
  { name: "Finished", slug: "finished", description: "Books completed." },
  { name: "To Read", slug: "to-read", description: "Wishlist and upcoming reads." },
  { name: "Favorites", slug: "favorites", description: "Books worth revisiting." },
  { name: "Abandoned", slug: "abandoned", description: "Books I stopped reading." },
];

const tags: { name: string; slug: string; color: string }[] = [
  { name: "Fiction", slug: "fiction", color: "#4f46e5" },
  { name: "Sci-Fi", slug: "sci-fi", color: "#0ea5e9" },
  { name: "Essay", slug: "essay", color: "#10b981" },
  { name: "Short Stories", slug: "short-stories", color: "#f59e0b" },
  { name: "Literary", slug: "literary", color: "#ef4444" },
  { name: "Nonfiction", slug: "nonfiction", color: "#8b5cf6" },
];

const books: SeedBook[] = [
  {
    title: "The Left Hand of Darkness",
    isbn: "9780441478125",
    pageCount: 304,
    publishedYear: 1969,
    authors: ["Ursula K. Le Guin"],
    shelves: ["finished", "favorites"],
    tags: ["fiction", "sci-fi", "literary"],
    notes: [
      { page: 72, body: "Gethenian ambisexuality reframes how politics shows up here.", daysAgo: 90 },
      { page: 210, body: "The ice crossing section is unforgettable.", daysAgo: 85 },
    ],
    sessions: [{ daysAgo: 90, durationMinutes: 55, pagesRead: 40 }],
  },
  {
    title: "The Dispossessed",
    isbn: "9780061054884",
    pageCount: 400,
    publishedYear: 1974,
    authors: ["Ursula K. Le Guin"],
    shelves: ["finished"],
    tags: ["fiction", "sci-fi"],
  },
  {
    title: "Invisible Cities",
    isbn: "9780156453806",
    pageCount: 165,
    publishedYear: 1972,
    authors: ["Italo Calvino"],
    shelves: ["favorites", "finished"],
    tags: ["fiction", "literary"],
    notes: [{ body: "Every city reads like a prose poem.", daysAgo: 140 }],
  },
  {
    title: "If on a winter's night a traveler",
    isbn: "9780156439619",
    pageCount: 260,
    publishedYear: 1979,
    authors: ["Italo Calvino"],
    shelves: ["finished"],
    tags: ["fiction", "literary"],
  },
  {
    title: "Beloved",
    isbn: "9781400033416",
    pageCount: 324,
    publishedYear: 1987,
    authors: ["Toni Morrison"],
    shelves: ["finished", "favorites"],
    tags: ["fiction", "literary"],
  },
  {
    title: "Song of Solomon",
    isbn: "9781400033423",
    pageCount: 337,
    publishedYear: 1977,
    authors: ["Toni Morrison"],
    shelves: ["to-read"],
    tags: ["fiction", "literary"],
  },
  {
    title: "Ficciones",
    isbn: "9780802130303",
    pageCount: 174,
    publishedYear: 1944,
    authors: ["Jorge Luis Borges"],
    shelves: ["reading"],
    tags: ["fiction", "short-stories", "literary"],
    notes: [{ page: 40, body: "\"The Library of Babel\" reread — still uncanny.", daysAgo: 3 }],
    sessions: [
      { daysAgo: 5, durationMinutes: 35, pagesRead: 22 },
      { daysAgo: 3, durationMinutes: 40, pagesRead: 18 },
    ],
  },
  {
    title: "Labyrinths",
    isbn: "9780811216999",
    pageCount: 251,
    publishedYear: 1962,
    authors: ["Jorge Luis Borges"],
    shelves: ["to-read"],
    tags: ["fiction", "short-stories"],
  },
  {
    title: "Kindred",
    isbn: "9780807083697",
    pageCount: 287,
    publishedYear: 1979,
    authors: ["Octavia Butler"],
    shelves: ["finished"],
    tags: ["fiction", "sci-fi"],
  },
  {
    title: "Parable of the Sower",
    isbn: "9781538732182",
    pageCount: 345,
    publishedYear: 1993,
    authors: ["Octavia Butler"],
    shelves: ["reading"],
    tags: ["fiction", "sci-fi"],
    sessions: [{ daysAgo: 1, durationMinutes: 50, pagesRead: 30 }],
  },
  {
    title: "Norwegian Wood",
    isbn: "9780375704024",
    pageCount: 296,
    publishedYear: 1987,
    authors: ["Haruki Murakami"],
    shelves: ["finished"],
    tags: ["fiction", "literary"],
  },
  {
    title: "Kafka on the Shore",
    isbn: "9781400079278",
    pageCount: 467,
    publishedYear: 2002,
    authors: ["Haruki Murakami"],
    shelves: ["to-read"],
    tags: ["fiction"],
  },
  {
    title: "The Remains of the Day",
    isbn: "9780679731726",
    pageCount: 245,
    publishedYear: 1989,
    authors: ["Kazuo Ishiguro"],
    shelves: ["finished", "favorites"],
    tags: ["fiction", "literary"],
  },
  {
    title: "Klara and the Sun",
    isbn: "9780593318171",
    pageCount: 303,
    publishedYear: 2021,
    authors: ["Kazuo Ishiguro"],
    shelves: ["reading"],
    tags: ["fiction", "sci-fi"],
    notes: [{ page: 120, body: "Klara's perception model is doing real philosophical work.", daysAgo: 8 }],
    sessions: [
      { daysAgo: 10, durationMinutes: 45, pagesRead: 40 },
      { daysAgo: 8, durationMinutes: 30, pagesRead: 25 },
    ],
  },
  {
    title: "White Teeth",
    isbn: "9780375703867",
    pageCount: 448,
    publishedYear: 2000,
    authors: ["Zadie Smith"],
    shelves: ["to-read"],
    tags: ["fiction"],
  },
  {
    title: "The Fifth Season",
    isbn: "9780316229296",
    pageCount: 468,
    publishedYear: 2015,
    authors: ["N. K. Jemisin"],
    shelves: ["finished", "favorites"],
    tags: ["fiction", "sci-fi"],
  },
  {
    title: "The Obelisk Gate",
    isbn: "9780316229265",
    pageCount: 391,
    publishedYear: 2016,
    authors: ["N. K. Jemisin"],
    shelves: ["reading"],
    tags: ["fiction", "sci-fi"],
    sessions: [{ daysAgo: 2, durationMinutes: 40, pagesRead: 35 }],
  },
  {
    title: "Stories of Your Life and Others",
    isbn: "9781101972120",
    pageCount: 281,
    publishedYear: 2002,
    authors: ["Ted Chiang"],
    shelves: ["finished", "favorites"],
    tags: ["fiction", "sci-fi", "short-stories"],
    notes: [{ body: "\"Story of Your Life\" still the high-water mark.", daysAgo: 200 }],
  },
  {
    title: "Exhalation",
    isbn: "9781101972083",
    pageCount: 368,
    publishedYear: 2019,
    authors: ["Ted Chiang"],
    shelves: ["to-read"],
    tags: ["fiction", "sci-fi", "short-stories"],
  },
  {
    title: "Pilgrim at Tinker Creek",
    isbn: "9780061233326",
    pageCount: 290,
    publishedYear: 1974,
    authors: ["Annie Dillard"],
    shelves: ["reading", "favorites"],
    tags: ["nonfiction", "essay"],
    notes: [
      { page: 45, body: "The frog-and-waterbug passage — wildness up close.", daysAgo: 12 },
      { page: 180, body: "Her attention is the argument.", daysAgo: 4 },
    ],
    sessions: [
      { daysAgo: 12, durationMinutes: 40, pagesRead: 25 },
      { daysAgo: 4, durationMinutes: 35, pagesRead: 20 },
    ],
  },
];

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

async function main() {
  console.log("Clearing existing data...");
  await prisma.note.deleteMany();
  await prisma.readingSession.deleteMany();
  await prisma.bookAuthor.deleteMany();
  await prisma.bookShelf.deleteMany();
  await prisma.bookTag.deleteMany();
  await prisma.book.deleteMany();
  await prisma.author.deleteMany();
  await prisma.shelf.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.goal.deleteMany();

  console.log("Seeding authors, shelves, tags...");
  const authorRecords = new Map<string, number>();
  for (const author of authors) {
    const created = await prisma.author.create({ data: author });
    authorRecords.set(author.name, created.id);
  }

  const shelfRecords = new Map<string, number>();
  for (const shelf of shelves) {
    const created = await prisma.shelf.create({ data: shelf });
    shelfRecords.set(shelf.slug, created.id);
  }

  const tagRecords = new Map<string, number>();
  for (const tag of tags) {
    const created = await prisma.tag.create({ data: tag });
    tagRecords.set(tag.slug, created.id);
  }

  console.log(`Seeding ${books.length} books...`);
  for (const book of books) {
    const created = await prisma.book.create({
      data: {
        title: book.title,
        subtitle: book.subtitle,
        isbn: book.isbn,
        pageCount: book.pageCount,
        publishedYear: book.publishedYear,
        authors: {
          create: book.authors.map((name) => ({ authorId: authorRecords.get(name)! })),
        },
        shelves: {
          create: book.shelves.map((slug) => ({ shelfId: shelfRecords.get(slug)! })),
        },
        tags: {
          create: book.tags.map((slug) => ({ tagId: tagRecords.get(slug)! })),
        },
      },
    });

    for (const note of book.notes ?? []) {
      await prisma.note.create({
        data: {
          bookId: created.id,
          page: note.page,
          body: note.body,
          createdAt: daysAgo(note.daysAgo),
        },
      });
    }

    for (const session of book.sessions ?? []) {
      const startedAt = daysAgo(session.daysAgo);
      const endedAt = new Date(startedAt.getTime() + session.durationMinutes * 60_000);
      await prisma.readingSession.create({
        data: {
          bookId: created.id,
          startedAt,
          endedAt,
          pagesRead: session.pagesRead,
        },
      });
    }
  }

  const currentYear = new Date().getFullYear();
  await prisma.goal.create({ data: { year: currentYear, targetBooks: 24 } });
  await prisma.goal.create({ data: { year: currentYear - 1, targetBooks: 20 } });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
