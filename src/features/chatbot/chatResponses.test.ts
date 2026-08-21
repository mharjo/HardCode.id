import { describe, expect, it } from "vitest";
import { getBotResponse, parseMarkdownLiteLine } from "./chatResponses";
import { DEFAULT_QUOTE_STATE } from "./quoteConfig";

describe("getBotResponse (Indonesian, free text)", () => {
  it("matches quote/price keywords and offers a quote + consult action", () => {
    const res = getBotResponse("berapa harga bikin aplikasi?", "id", DEFAULT_QUOTE_STATE);
    expect(res.text).toContain("Estimasi Project Transparan");
    expect(res.actions).toEqual([{ type: "open-quote" }, { type: "consult" }]);
  });

  it("infers a specific category from keywords inside a quote question", () => {
    const res = getBotResponse("mau tanya harga bikin landing page", "id", DEFAULT_QUOTE_STATE);
    expect(res.matchedCategory).toBe("landing");
  });

  it("infers the ai_rag category from an AI/chatbot quote question", () => {
    const res = getBotResponse("estimasi biaya bikin ai chatbot", "id", DEFAULT_QUOTE_STATE);
    expect(res.matchedCategory).toBe("ai_rag");
  });

  it("matches schedule keywords", () => {
    const res = getBotResponse("jadwal konsultasinya kapan?", "id", DEFAULT_QUOTE_STATE);
    expect(res.text).toContain("Jadwal Konsultasi 1-on-1");
    expect(res.actions).toEqual([{ type: "consult" }]);
  });

  it("matches beginner/learning keywords", () => {
    const res = getBotResponse("bisa belajar dari nol?", "id", DEFAULT_QUOTE_STATE);
    expect(res.text).toContain("Belajar Dari Nol");
    expect(res.actions).toEqual([{ type: "learning" }]);
  });

  it("matches project/build keywords", () => {
    const res = getBotResponse("mau bikin aplikasi custom", "id", DEFAULT_QUOTE_STATE);
    expect(res.text).toContain("Layanan Pembuatan Aplikasi");
  });

  it("matches contact keywords", () => {
    const res = getBotResponse("boleh minta kontak email?", "id", DEFAULT_QUOTE_STATE);
    expect(res.text).toContain("Hubungi Kami");
  });

  it("falls back to the default response for unmatched text", () => {
    const res = getBotResponse("halo apa kabar", "id", DEFAULT_QUOTE_STATE);
    expect(res.text).toContain("Pertanyaan yang menarik");
  });
});

describe("getBotResponse (English)", () => {
  it("matches English quote keywords", () => {
    const res = getBotResponse("what's the pricing for a website?", "en", DEFAULT_QUOTE_STATE);
    expect(res.text).toContain("Quick Project Estimate");
  });

  it("matches English schedule keywords", () => {
    const res = getBotResponse("when are you available?", "en", DEFAULT_QUOTE_STATE);
    expect(res.text).toContain("1-on-1 Consultation Availability");
  });
});

describe("getBotResponse (quick prompts)", () => {
  it("bypasses keyword search for a quick prompt id", () => {
    const res = getBotResponse("this text is irrelevant", "id", DEFAULT_QUOTE_STATE, "q1");
    expect(res.text).toContain("Jadwal Konsultasi 1-on-1");
  });

  it("q3 always returns the beginner response regardless of question text", () => {
    const res = getBotResponse("random unrelated words", "id", DEFAULT_QUOTE_STATE, "q3");
    expect(res.text).toContain("Belajar Dari Nol");
  });
});

describe("parseMarkdownLiteLine", () => {
  it("splits bold and code spans out of plain text", () => {
    const segments = parseMarkdownLiteLine("Timeline: **2 - 4 Hari** at `20:00 WIB`");
    expect(segments).toEqual([
      { type: "text", value: "Timeline: " },
      { type: "bold", value: "2 - 4 Hari" },
      { type: "text", value: " at " },
      { type: "code", value: "20:00 WIB" },
    ]);
  });

  it("returns a single text segment when there's no markdown", () => {
    expect(parseMarkdownLiteLine("plain text")).toEqual([{ type: "text", value: "plain text" }]);
  });
});
