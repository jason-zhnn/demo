import { describe, it, expect } from "vitest";
import { toSlug } from "./slug";

describe("toSlug", () => {
  it("lowercases and replaces whitespace", () => {
    expect(toSlug("To Read")).toBe("to-read");
  });
  it("strips punctuation", () => {
    expect(toSlug("Sci-Fi & Fantasy!")).toBe("sci-fi-fantasy");
  });
  it("trims hyphens", () => {
    expect(toSlug("  hello world  ")).toBe("hello-world");
  });
});
