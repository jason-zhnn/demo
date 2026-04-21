import { describe, it, expect } from "vitest";
import { sessionDurationMinutes } from "./sessions";

describe("sessionDurationMinutes", () => {
  it("returns null when session is still open", () => {
    expect(sessionDurationMinutes(new Date(), null)).toBeNull();
  });

  it("computes minutes between start and end", () => {
    const start = new Date("2026-01-01T10:00:00Z");
    const end = new Date("2026-01-01T10:45:00Z");
    expect(sessionDurationMinutes(start, end)).toBe(45);
  });

  it("clamps negative durations to zero", () => {
    const start = new Date("2026-01-01T10:00:00Z");
    const end = new Date("2026-01-01T09:00:00Z");
    expect(sessionDurationMinutes(start, end)).toBe(0);
  });
});
