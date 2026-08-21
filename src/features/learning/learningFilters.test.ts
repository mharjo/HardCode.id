import { describe, expect, it } from "vitest";
import { learningModules } from "../../data/learning";
import { filterLearningModules, filterModulesByTrack, filterModulesBySearch } from "./learningFilters";

describe("filterModulesByTrack", () => {
  it("returns all 7 modules for 'all'", () => {
    expect(filterModulesByTrack(learningModules, "all")).toHaveLength(7);
  });

  it("returns only web-track modules for 'web'", () => {
    const result = filterModulesByTrack(learningModules, "web");
    expect(result.map((m) => m.id)).toEqual(["learn-card-1", "learn-card-6", "learn-card-7"]);
  });

  it("returns only python-track modules for 'python'", () => {
    const result = filterModulesByTrack(learningModules, "python");
    expect(result.map((m) => m.id)).toEqual(["learn-card-2", "learn-card-4", "learn-card-5", "learn-card-7"]);
  });

  it("returns only ai-track modules for 'ai'", () => {
    const result = filterModulesByTrack(learningModules, "ai");
    expect(result.map((m) => m.id)).toEqual(["learn-card-2", "learn-card-3", "learn-card-5", "learn-card-7"]);
  });

  it("includes the capstone module (module 7) in every track", () => {
    for (const track of ["web", "python", "ai"] as const) {
      expect(filterModulesByTrack(learningModules, track).some((m) => m.id === "learn-card-7")).toBe(true);
    }
  });
});

describe("filterModulesBySearch", () => {
  it("returns all modules for an empty query", () => {
    expect(filterModulesBySearch(learningModules, "")).toHaveLength(7);
    expect(filterModulesBySearch(learningModules, "   ")).toHaveLength(7);
  });

  it("matches by Indonesian search term", () => {
    const result = filterModulesBySearch(learningModules, "otomatisasi");
    expect(result.map((m) => m.id)).toEqual(["learn-card-4"]);
  });

  it("matches by English title text regardless of active locale", () => {
    const result = filterModulesBySearch(learningModules, "Machine Learning");
    expect(result.map((m) => m.id)).toContain("learn-card-5");
  });

  it("matches by tag text", () => {
    const result = filterModulesBySearch(learningModules, "Chain of Thought");
    expect(result.map((m) => m.id)).toEqual(["learn-card-3"]);
  });

  it("is case-insensitive", () => {
    expect(filterModulesBySearch(learningModules, "PYTHON").length).toBeGreaterThan(0);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterModulesBySearch(learningModules, "zzzzzznotarealterm")).toEqual([]);
  });
});

describe("filterLearningModules", () => {
  it("combines track and search filters", () => {
    const result = filterLearningModules(learningModules, { track: "python", search: "klastering" });
    expect(result.map((m) => m.id)).toEqual(["learn-card-5"]);
  });

  it("returns empty when track and search filters don't overlap", () => {
    const result = filterLearningModules(learningModules, { track: "web", search: "otomatisasi" });
    expect(result).toEqual([]);
  });
});
