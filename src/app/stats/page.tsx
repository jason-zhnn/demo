import { prisma } from "@/lib/prisma";
import { yearStats, monthlyBreakdown } from "@/lib/stats";
import { formatPages } from "@/lib/format";

type StatsPageProps = {
  searchParams: Promise<{ year?: string }>;
};

export default async function StatsPage({ searchParams }: StatsPageProps) {
  const { year: rawYear } = await searchParams;
  const currentYear = new Date().getFullYear();
  const year = rawYear ? Number(rawYear) : currentYear;

  const [stats, months, goal, totalBooks] = await Promise.all([
    yearStats(year),
    monthlyBreakdown(year),
    prisma.goal.findUnique({ where: { year } }),
    prisma.book.count(),
  ]);

  const maxPages = Math.max(1, ...months.map((month) => month.pagesRead));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Stats</h1>
        <form>
          <label className="flex items-center gap-2 text-sm">
            Year
            <input
              name="year"
              type="number"
              defaultValue={year}
              className="w-24 rounded border border-neutral-300 px-2 py-1 text-sm"
            />
          </label>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pages read" value={stats.pagesRead.toLocaleString()} />
        <StatCard label="Books finished" value={String(stats.booksFinished)} />
        <StatCard label="Sessions" value={String(stats.sessionCount)} />
        <StatCard
          label="Avg session"
          value={stats.averageSessionMinutes != null ? `${stats.averageSessionMinutes} min` : "—"}
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase text-neutral-500">Monthly pages</h2>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <ul className="space-y-2">
            {months.map((month) => (
              <li key={month.month} className="flex items-center gap-3 text-sm">
                <span className="w-10 text-neutral-500">{month.month}</span>
                <div className="flex-1">
                  <div
                    className="h-3 rounded bg-neutral-900"
                    style={{ width: `${(month.pagesRead / maxPages) * 100}%` }}
                  />
                </div>
                <span className="w-24 text-right text-neutral-600">{formatPages(month.pagesRead)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {goal && (
        <section className="space-y-2">
          <h2 className="text-sm font-medium uppercase text-neutral-500">Goal progress</h2>
          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm">
            <p>
              {stats.booksFinished} / {goal.targetBooks} books ({Math.round((stats.booksFinished / goal.targetBooks) * 100)}%)
            </p>
          </div>
        </section>
      )}

      <p className="text-xs text-neutral-500">Catalog size: {totalBooks} books.</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <p className="text-xs uppercase text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
