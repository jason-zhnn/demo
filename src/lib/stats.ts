import { prisma } from "./prisma";
import { sessionDurationMinutes } from "./sessions";

export type YearStats = {
  year: number;
  pagesRead: number;
  booksFinished: number;
  sessionCount: number;
  averageSessionMinutes: number | null;
};

export type MonthBreakdown = {
  month: string;
  booksFinished: number;
  pagesRead: number;
};

export async function yearStats(year: number): Promise<YearStats> {
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));

  const sessions = await prisma.readingSession.findMany({
    where: { startedAt: { gte: start, lt: end } },
  });
  const pagesRead = sessions.reduce((total, session) => total + session.pagesRead, 0);
  const durations = sessions
    .map((session) => sessionDurationMinutes(session.startedAt, session.endedAt))
    .filter((minutes): minutes is number => minutes != null);
  const averageSessionMinutes = durations.length
    ? Math.round(durations.reduce((total, value) => total + value, 0) / durations.length)
    : null;

  const finishedShelf = await prisma.shelf.findUnique({ where: { slug: "finished" } });
  const booksFinished = finishedShelf
    ? await prisma.bookShelf.count({
        where: {
          shelfId: finishedShelf.id,
          book: { updatedAt: { gte: start, lt: end } },
        },
      })
    : 0;

  return {
    year,
    pagesRead,
    booksFinished,
    sessionCount: sessions.length,
    averageSessionMinutes,
  };
}

export async function monthlyBreakdown(year: number): Promise<MonthBreakdown[]> {
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));

  const sessions = await prisma.readingSession.findMany({
    where: { startedAt: { gte: start, lt: end } },
  });

  const byMonth = new Map<number, { pagesRead: number }>();
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    byMonth.set(monthIndex, { pagesRead: 0 });
  }
  for (const session of sessions) {
    const monthIndex = session.startedAt.getUTCMonth();
    const bucket = byMonth.get(monthIndex)!;
    bucket.pagesRead += session.pagesRead;
  }

  const finishedShelf = await prisma.shelf.findUnique({ where: { slug: "finished" } });
  const finishedByMonth = new Map<number, number>();
  if (finishedShelf) {
    const finished = await prisma.book.findMany({
      where: {
        shelves: { some: { shelfId: finishedShelf.id } },
        updatedAt: { gte: start, lt: end },
      },
      select: { updatedAt: true },
    });
    for (const book of finished) {
      const monthIndex = book.updatedAt.getUTCMonth();
      finishedByMonth.set(monthIndex, (finishedByMonth.get(monthIndex) ?? 0) + 1);
    }
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return monthNames.map((month, monthIndex) => ({
    month,
    booksFinished: finishedByMonth.get(monthIndex) ?? 0,
    pagesRead: byMonth.get(monthIndex)!.pagesRead,
  }));
}
