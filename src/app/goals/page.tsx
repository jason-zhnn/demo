import { prisma } from "@/lib/prisma";
import { yearStats } from "@/lib/stats";
import { upsertGoal, deleteGoal } from "./actions";

export default async function GoalsPage() {
  const goals = await prisma.goal.findMany({ orderBy: { year: "desc" } });
  const progress = await Promise.all(goals.map((goal) => yearStats(goal.year)));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Goals</h1>

      <form action={upsertGoal} className="flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <label className="flex flex-col text-xs text-neutral-600">
          Year
          <input
            name="year"
            type="number"
            required
            defaultValue={new Date().getFullYear()}
            className="mt-1 w-28 rounded border border-neutral-300 px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col text-xs text-neutral-600">
          Target books
          <input
            name="targetBooks"
            type="number"
            min={1}
            required
            className="mt-1 w-28 rounded border border-neutral-300 px-2 py-1 text-sm"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-700"
        >
          Save goal
        </button>
      </form>

      <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
        {goals.length === 0 ? (
          <li className="px-4 py-6 text-center text-sm text-neutral-500">No goals yet.</li>
        ) : (
          goals.map((goal, index) => {
            const stats = progress[index];
            const percent = Math.min(100, Math.round((stats.booksFinished / goal.targetBooks) * 100));
            return (
              <li key={goal.year} className="space-y-2 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{goal.year}</span>
                  <div className="flex items-center gap-3 text-sm">
                    <span>
                      {stats.booksFinished} / {goal.targetBooks}
                    </span>
                    <form action={deleteGoal.bind(null, goal.year)}>
                      <button
                        type="submit"
                        className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:border-red-500"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
                <div className="h-2 w-full rounded bg-neutral-100">
                  <div className="h-2 rounded bg-neutral-900" style={{ width: `${percent}%` }} />
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
