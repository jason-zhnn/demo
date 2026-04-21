import { describe, it, expect } from "vitest";
import { formatPages } from "./format";

describe("formatPages", () => {
  it("pluralizes above one", () => {
    expect(formatPages(2)).toBe("2 pages");
  });
  it("uses singular for one", () => {
    expect(formatPages(1)).toBe("1 page");
  });
});
