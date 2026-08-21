import { describe, expect, it } from "vitest";
import { countWords } from "./readingStats";

describe("countWords", () => {
  it("strips tags and counts words", () => {
    expect(countWords("<p>hello <strong>world</strong></p>")).toBe(2);
  });

  it("strips entities without leaving stray tokens", () => {
    expect(countWords("<p>a &amp; b &rarr; c</p>")).toBe(3);
  });

  it("returns 0 for empty/whitespace-only content", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("<p>   </p>")).toBe(0);
  });
});
