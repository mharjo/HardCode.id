import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the home route with core homepage sections", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    expect(html).toContain("hardcode");
    expect(html).toContain("HardCode.");
    expect(html).toContain("id=\"layanan\"");
    expect(html).toContain("id=\"cara-kerja\"");
    expect(html).toContain("id=\"faq\"");
    expect(html).toContain("id=\"testimoni\"");
    expect(html).toContain("id=\"tulisan\"");
  });

  it("renders the not-found route", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/nope"]}>
        <App />
      </MemoryRouter>,
    );
    expect(html).toContain("404");
  });

  it("renders the articles list route with search/filter/sort controls and all 6 cards", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/artikel"]}>
        <App />
      </MemoryRouter>,
    );
    expect(html).toContain("articles-search-input");
    expect(html).toContain("articles-sort-select");
    expect(html).toContain("Mengapa Menghafal Sintaks");
    expect(html).toContain("Dari Spreadsheet Berantakan");
  });

  it("renders an article detail route with breadcrumb, title, and body content", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/artikel/menghafal-sintaks"]}>
        <App />
      </MemoryRouter>,
    );
    expect(html).toContain("Breadcrumb");
    expect(html).toContain("Mengapa Menghafal Sintaks");
    expect(html).toContain("Computational Thinking");
  });

  it("renders a not-found state for an unknown article slug", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/artikel/does-not-exist"]}>
        <App />
      </MemoryRouter>,
    );
    expect(html).toContain("Tulisan tidak ditemukan");
  });

  it("renders the /belajar route with all 7 modules, track filters, and search", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/belajar"]}>
        <App />
      </MemoryRouter>,
    );
    expect(html).toContain("learning-search-input");
    expect(html).toContain("id=\"learn-card-1\"");
    expect(html).toContain("id=\"learn-card-7\"");
    expect(html).toContain("Dasar Web (HTML/CSS/JS)");
    expect(html).toContain("Integrasi AI ke Aplikasi");
    expect(html).toContain("Peta Jalur Belajar (Skill Path)");
  });

  it("renders the /proyek route with all 7 project types and search", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/proyek"]}>
        <App />
      </MemoryRouter>,
    );
    expect(html).toContain("projects-search-input");
    expect(html).toContain("id=\"proj-card-1\"");
    expect(html).toContain("id=\"proj-card-7\"");
    expect(html).toContain("Landing Page Bisnis");
    expect(html).toContain("Refactoring");
  });

  it("renders the /konsultasi route with the booking calendar's step 1", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/konsultasi"]}>
        <App />
      </MemoryRouter>,
    );
    expect(html).toContain("1-on-1 Sesi Konsultasi");
    expect(html).toContain("HardCode Mentoring");
    // Calendar day buttons render with a localized aria-label.
    expect(html).toMatch(/aria-label="\d+ \p{L}+ \d{4}"/u);
    // A national holiday cell renders as disabled with its aria-label.
    expect(html).toMatch(/aria-label="17 Agustus 2026 - Hari Kemerdekaan/);
    // Step 1's slot list is shown by default; the form/success steps aren't mounted yet.
    expect(html).not.toContain("cal-name");
    expect(html).not.toContain(">🎉<");
  });
});
