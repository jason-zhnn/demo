import { describe, it, expect } from "vitest";
import { yearStats, monthlyBreakdown } from "./stats";

describe("stats", () => {
  it("yearStats returns non-negative totals for the current year", async () => {
    const year = new Date().getFullYear();
    const stats = await yearStats(year);
    expect(stats.year).toBe(year);
    expect(stats.pagesRead).toBeGreaterThanOrEqual(0);
    expect(stats.sessionCount).toBeGreaterThanOrEqual(0);
    expect(stats.booksFinished).toBeGreaterThanOrEqual(0);
  });

  it("monthlyBreakdown always has 12 buckets", async () => {
    const year = new Date().getFullYear();
    const months = await monthlyBreakdown(year);
    expect(months).toHaveLength(12);
    expect(months[0].month).toBe("Jan");
    expect(months[11].month).toBe("Dec");
  });
});
