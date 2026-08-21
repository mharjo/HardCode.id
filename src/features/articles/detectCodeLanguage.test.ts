import { describe, expect, it } from "vitest";
import { detectCodeLanguage } from "./detectCodeLanguage";

describe("detectCodeLanguage", () => {
  it("reads the language from a language-xxx class", () => {
    expect(detectCodeLanguage("language-python", "print(1)")).toBe("Python");
    expect(detectCodeLanguage("language-javascript", "const x = 1;")).toBe("JavaScript");
  });

  it("detects server.js from content heuristics when no class is present", () => {
    expect(detectCodeLanguage("", "// server.js\nimport express from 'express';")).toBe("server.js");
    expect(detectCodeLanguage("", "const ai = new GoogleGenAI({});")).toBe("server.js");
  });

  it("detects an architecture flow diagram", () => {
    expect(detectCodeLanguage("", "[ Browser Client ]\n  |\n  v\n[ Server ]")).toBe("Architecture Flow");
  });

  it("falls back to a generic 'Code' label", () => {
    expect(detectCodeLanguage("", '"Buatkan fitur login pakai express dan database."')).toBe("Code");
  });
});
