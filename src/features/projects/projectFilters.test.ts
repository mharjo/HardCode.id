import { describe, expect, it } from "vitest";
import { projectTypes } from "../../data/projects";
import { filterProjectsBySearch } from "./projectFilters";

describe("filterProjectsBySearch", () => {
  it("returns all 7 project types for an empty query", () => {
    expect(filterProjectsBySearch(projectTypes, "")).toHaveLength(7);
    expect(filterProjectsBySearch(projectTypes, "   ")).toHaveLength(7);
  });

  it("matches by Indonesian data-search term", () => {
    const result = filterProjectsBySearch(projectTypes, "zapier");
    expect(result.map((p) => p.id)).toEqual(["proj-card-2"]);
  });

  it("matches by English title text regardless of active locale", () => {
    const result = filterProjectsBySearch(projectTypes, "Payment Gateway Integration");
    expect(result.map((p) => p.id)).toContain("proj-card-6");
  });

  it("matches by body paragraph text", () => {
    const result = filterProjectsBySearch(projectTypes, "vector database");
    expect(result.map((p) => p.id)).toContain("proj-card-4");
  });

  it("is case-insensitive", () => {
    expect(filterProjectsBySearch(projectTypes, "SCRAPING").length).toBeGreaterThan(0);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterProjectsBySearch(projectTypes, "zzzzzznotarealterm")).toEqual([]);
  });
});
