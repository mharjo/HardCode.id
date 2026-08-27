import { describe, expect, it } from "vitest";
import { getBotResponse, parseTanyaMessage, parseInline } from "./chatResponses";
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

describe("parseTanyaMessage & parseInline", () => {
  it("parses blockquotes, lists, code blocks, dividers, paragraphs", () => {
    const text = `> quote
---
- item 1
- item 2
\`\`\`js
console.log()
\`\`\`
paragraph`;

    const nodes = parseTanyaMessage(text);

    expect(nodes.length).toBe(5);
    expect(nodes[0]!.type).toBe("blockquote");
    expect(nodes[1]!.type).toBe("divider");
    expect(nodes[2]!.type).toBe("list-ul");
    expect(nodes[3]!.type).toBe("fenced-code");
    expect(nodes[4]!.type).toBe("paragraph");
  });

  it("parses inline styles (bold, italic, code, emoji, links)", () => {
    const nodes = parseInline("Hello **bold** and _italic_ and `code` :) [link](url)");

    expect(nodes).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: "text", value: "Hello " }),
      expect.objectContaining({ type: "bold", children: [{ type: "text", value: "bold" }] }),
      expect.objectContaining({ type: "text", value: " and " }),
      expect.objectContaining({ type: "italic", children: [{ type: "text", value: "italic" }] }),
      expect.objectContaining({ type: "text", value: " and " }),
      expect.objectContaining({ type: "code", value: "code" }),
      expect.objectContaining({ type: "text", value: " " }),
      expect.objectContaining({ type: "emoji", value: "😊" }),
      expect.objectContaining({ type: "text", value: " " }),
      expect.objectContaining({ type: "link", url: "url", children: [{ type: "text", value: "link" }] })
    ]));
  });

  it("returns a text segment when there's no markdown", () => {
    expect(parseInline("plain text")).toEqual([{ type: "text", value: "plain text" }]);
  });
});
