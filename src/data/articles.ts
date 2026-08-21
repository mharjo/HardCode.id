import type { TranslationKey } from "./translations";

export type ArticleCategory = "mental-model" | "ai-llm" | "python-automation" | "web-frontend";

export interface Bilingual {
  id: string;
  en: string;
}

export interface ArticlePreview {
  id: string;
  category: ArticleCategory;
  categoryFilterKey: TranslationKey;
  categoryLabel: Bilingual;
  readingTime: Bilingual;
  date: Bilingual;
  dateIso: string;
  author: string;
  title: Bilingual;
  excerpt: Bilingual;
  tags: string[];
}

/**
 * Full article record including the reader body HTML. `content.id`/`content.en`
 * are trusted, build-time-authored strings copied from SOURCE `src/articles.js`
 * (never user/CMS input) — see `ArticleBody`'s doc comment for the rendering
 * boundary this depends on.
 */
export interface Article extends ArticlePreview {
  content: Bilingual;
}

/**
 * All 6 articles ported from SOURCE `src/articles.js`, including full
 * `content.id`/`content.en` reader bodies (used by the `/artikel/:slug`
 * detail route) alongside the preview metadata (used by the homepage
 * preview and `/artikel` list route). Sorted newest first by `dateIso`,
 * matching SOURCE's default "Terbaru" sort order.
 */
export const articles: Article[] = [
  {
    id: "menghafal-sintaks",
    category: "mental-model",
    categoryFilterKey: "articles_filter_mental",
    categoryLabel: { id: "🧠 Mental Model", en: "🧠 Mental Model" },
    readingTime: { id: "4 mnt baca", en: "4 min read" },
    date: { id: "18 Agu 2026", en: "Aug 18, 2026" },
    dateIso: "2026-08-18",
    author: "HardCode Studio",
    title: {
      id: "Mengapa Menghafal Sintaks Coding Adalah Cara Belajar yang Salah di Era AI",
      en: "Why Memorizing Syntax is the Wrong Way to Learn Coding in the AI Era",
    },
    excerpt: {
      id: "Di era asisten AI dan LLM, kemampuan mengingat nama method atau tanda kurung bukan lagi nilai pembeda. Kuncinya ada pada pemecahan masalah dan dekomposisi logika.",
      en: "In the era of AI assistants and LLMs, recalling exact function names or semicolons is no longer a differentiator. The real leverage lies in problem decomposition and mental models.",
    },
    tags: ["#metode-belajar", "#mental-model", "#ai-era", "#problem-solving"],
    content: {
      id: `
        <p class="article-lead">Banyak orang yang baru mulai belajar coding merasa frustrasi karena mengira belajar pemrograman mirip seperti menghafal kosakata bahasa asing untuk ujian sekolah. Mereka menghabiskan waktu berjam-jam mencatat rumus <code>for loop</code>, menghafal daftar method bawaan <code>Array</code> di JavaScript, atau menghafal format fungsi di Python.</p>

        <p>Di era AI saat ini, pendekatan tersebut tidak hanya melelahkan, tapi juga <strong>ketinggalan zaman</strong>. AI seperti Claude, ChatGPT, dan Gemini dapat menghasilkan sintaks apa pun dalam hitungan milidetik. Yang tidak bisa dilakukan AI secara mandiri adalah memahami nuansa masalahmu dan menyusun arsitektur pemikiran yang tepat.</p>

        <h3>1. Sintaks Adalah Komoditas, Logika Adalah Nilai Utama</h3>
        <p>Sintaks pemrograman hanyalah cara kita mengetik instruksi agar komputer mengerti. Namun kemampuan yang sebenarnya dicari di industri adalah <em>Computational Thinking</em>: bagaimana kamu memecah masalah besar yang rumit menjadi langkah-langkah logis kecil yang terstruktur.</p>

        <div class="article-callout">
          <strong>💡 Perbandingan Pola Pikir:</strong>
          <table class="article-table">
            <thead>
              <tr>
                <th>Pola Pikir Hafalan</th>
                <th>Pola Pikir Model Mental</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>"Bagaimana sintaks perulangan di Python?"</td>
                <td>"Kapan data harus diproses satu per satu versus secara agregat?"</td>
              </tr>
              <tr>
                <td>Panik saat sintaks error / typo titik dua.</td>
                <td>Membaca pesan error untuk melacak di mana alur logika terputus.</td>
              </tr>
              <tr>
                <td>Bingung saat berganti bahasa baru.</td>
                <td>Cepat beradaptasi karena konsep dasar (kondisi, loop, fungsi) selalu sama.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>2. Tiga Fondasi yang Jauh Lebih Berharga untuk Dipelajari</h3>
        <ol class="article-list">
          <li><strong>Dekomposisi Masalah (Problem Breakdown):</strong> Mengubah ide abstrak seperti "Saya ingin membuat bot WhatsApp rekap pesanan" menjadi alur kerja 4 langkah: tangkap pesan webhook &rarr; filter format nomor &rarr; simpan ke database &rarr; kirim balasan konfirmasi.</li>
          <li><strong>Membaca dan Menavigasi Dokumentasi (Debugging):</strong> Mengetahui cara mencari tahu <em>mengapa</em> sistem berperilaku aneh, serta memanfaatkan log terminal untuk memvalidasi asumsi.</li>
          <li><strong>Prompting Konseptual untuk AI:</strong> Memberikan instruksi berkonteks tinggi kepada AI dengan batasan teknis yang jelas, bukan sekadar meminta "buatkan kode toko online".</li>
        </ol>

        <div class="article-quote">
          <p>&ldquo;Programmer hebat di masa depan bukanlah mereka yang hafal ratusan baris kode di kepala, melainkan mereka yang mampu menjadi arsitek dan validator logika yang tajam.&rdquo;</p>
        </div>

        <h3>Kesimpulan &amp; Langkah Praktis</h3>
        <p>Jangan merasa minder jika kamu masih sering membuka Google atau bertanya ke AI untuk mengecek cara penulisan sintaks. Biasakan fokus pada pemahaman: <em>data apa yang masuk, bagaimana data diubah, dan apa hasil akhir yang diharapkan</em>. Itulah esensi coding yang sebenarnya.</p>
      `,
      en: `
        <p class="article-lead">Many people starting their coding journey feel overwhelmed because they treat programming like memorizing vocabulary words for a foreign language exam. They spend endless hours writing down <code>for loop</code> syntax, memorizing JavaScript array methods, or cramming Python functions into flashcards.</p>

        <p>In today's AI era, that method is not only exhausting, but also <strong>obsolete</strong>. LLMs can generate correct syntax in milliseconds. What AI cannot do on its own is deeply understand the nuances of your business problem and construct the overarching logical architecture.</p>

        <h3>1. Syntax is a Commodity; Mental Models are the Asset</h3>
        <p>Syntax is merely the mechanical translation of intent into machine instructions. The actual leverage lies in <em>Computational Thinking</em>: breaking down complex, messy real-world challenges into clean, structured algorithmic steps.</p>

        <div class="article-callout">
          <strong>💡 Mindset Comparison:</strong>
          <table class="article-table">
            <thead>
              <tr>
                <th>Rote Memorization Mindset</th>
                <th>Mental Model Mindset</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>"What is the exact syntax for a Python loop?"</td>
                <td>"When should data be processed sequentially vs in batch aggregations?"</td>
              </tr>
              <tr>
                <td>Panicking when seeing a red syntax error in console.</td>
                <td>Reading stack traces calmly to pinpoint where the flow broke.</td>
              </tr>
              <tr>
                <td>Paralyzed when switching to a new language.</td>
                <td>Adapting in hours because core abstractions (loops, conditions, state) are universal.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>2. Three Foundations Worth Mastering</h3>
        <ol class="article-list">
          <li><strong>Problem Decomposition:</strong> Turning an abstract goal like "Build an automated WhatsApp order bot" into 4 distinct steps: handle incoming webhook &rarr; sanitize payload &rarr; persist to DB &rarr; send asynchronous receipt.</li>
          <li><strong>Error Literacy &amp; Debugging:</strong> Understanding how to trace unexpected state regressions using logs, breakpoints, and targeted assertions.</li>
          <li><strong>High-Context AI Steering:</strong> Directing LLMs with precise operational constraints, edge case specifications, and interface contracts.</li>
        </ol>

        <div class="article-quote">
          <p>&ldquo;The top engineers of tomorrow won't be syntax memory banks; they will be rigorous system architects and logic validators.&rdquo;</p>
        </div>

        <h3>Key Takeaway</h3>
        <p>Never feel discouraged if you still look up syntax or ask an AI helper for boilerplates. Shift your focus toward inputs, transformations, invariants, and edge cases. That is where real engineering mastery lives.</p>
      `,
    },
  },
  {
    id: "prompt-engineering-developer",
    category: "ai-llm",
    categoryFilterKey: "articles_filter_ai",
    categoryLabel: { id: "🤖 AI & LLM", en: "🤖 AI & LLM" },
    readingTime: { id: "6 mnt baca", en: "6 min read" },
    date: { id: "12 Agu 2026", en: "Aug 12, 2026" },
    dateIso: "2026-08-12",
    author: "HardCode Studio",
    title: {
      id: "Prompt Engineering Praktis: Panduan Menulis Instruksi Presisi untuk Programmer",
      en: "Practical Prompt Engineering: Writing Precision Instructions for Developers",
    },
    excerpt: {
      id: "Hindari output halusinasi dan jawaban generik. Gunakan kerangka 4-elemen (Peran, Konteks, Format Output, dan Batasan Negatif) untuk hasil kode siap pakai.",
      en: "Eliminate AI hallucinations and generic code. Master the 4-element framework (Role, Context, Output Schema, and Negative Constraints) for instant production-ready code.",
    },
    tags: ["#prompt-engineering", "#llm", "#system-prompt", "#chain-of-thought"],
    content: {
      id: `
        <p class="article-lead">Banyak developer mengeluhkan bahwa coding menggunakan AI sering kali menghasilkan kode yang tidak sesuai konteks, menggunakan library yang sudah usang (deprecated), atau membuat perubahan berlebihan yang merusak file yang sudah ada. Masalahnya hampir selalu bukan pada model AI-nya, melainkan pada <strong>kualitas prompt instruksinya</strong>.</p>

        <h3>Kerangka 4-Elemen Prompt Presisi (R-C-O-N)</h3>
        <p>Agar AI memberikan kode yang akurat tanpa basa-basi berbelit, susun instruksimu menggunakan kerangka ini:</p>

        <div class="article-callout">
          <ul class="article-list">
            <li><strong>1. Role (Peran Spesifik):</strong> Tentukan keahlian spesifik model (misal: <em>"Senior TypeScript &amp; Express Engineer"</em>).</li>
            <li><strong>2. Context (Konteks &amp; Lingkungan):</strong> Sebutkan versi stack, dependensi yang sudah terpasang, dan arsitektur file.</li>
            <li><strong>3. Output Schema (Format Hasil):</strong> Tentukan apakah output berupa diff kode, fungsi mandiri, atau JSON terstruktur.</li>
            <li><strong>4. Negative Constraints (Batasan Negatif):</strong> Beritahu apa saja yang <strong>TIDAK BOLEH</strong> dilakukan oleh AI.</li>
          </ul>
        </div>

        <h3>Contoh Penerapan Nyata</h3>
        <p>Bandingkan dua prompt di bawah ini:</p>

        <div class="code-compare-grid">
          <div class="code-box bad">
            <span class="code-box-badge bad">❌ Prompt Lemah (Generik)</span>
            <pre><code>"Buatkan fitur login pakai express dan database."</code></pre>
            <p class="code-box-note">Hasil: AI akan menebak sendiri database apa yang kamu pakai, menggunakan library usang, dan menaruh API key sembarangan.</p>
          </div>

          <div class="code-box good">
            <span class="code-box-badge good">✅ Prompt Presisi (R-C-O-N)</span>
            <pre><code>"Kamu adalah backend engineer Express + TypeScript.
Konteks: Node 20 ESM, PostgreSQL via Drizzle ORM.
Tugas: Buat middleware verifikasi JWT header Bearer.
Batasan:
- Jangan install package baru selain jsonwebtoken.
- Handle error token expired dengan HTTP 401 dan format JSON { error: string }.
- Return HANYA fungsi middleware TypeScript tanpa intro/outro markdown."</code></pre>
            <p class="code-box-note">Hasil: Kode presisi 100%, siap di-copy langsung ke codebase tanpa bug versi atau modul silang.</p>
          </div>
        </div>

        <h3>Teknik "Chain of Thought" (Langkah demi Langkah)</h3>
        <p>Jika masalah yang ingin diselesaikan melibatkan algoritma kompleks atau refactoring arsitektur besar, tambahkan instruksi: <em>"Sebelum menulis kode, uraikan dulu 3 langkah logika utamamu dalam format poin singkat."</em></p>
        <p>Instruksi ini memaksa LLM mengalokasikan token komputasi untuk merencanakan alur sebelum mengeksekusi sintaks, mengurangi tingkat kesalahan hingga lebih dari 60%.</p>

        <div class="article-quote">
          <p>&ldquo;Semakin spesifik batasan (constraints) yang kamu berikan, semakin kreatif dan presisi AI dalam menghasilkan solusi di dalam batas tersebut.&rdquo;</p>
        </div>
      `,
      en: `
        <p class="article-lead">Many engineers complain that AI coding assistants generate brittle code, reference deprecated APIs, or introduce unwarranted breaking changes to existing files. Almost always, the issue is not the underlying model's intelligence, but the <strong>ambiguity of the prompt prompt contract</strong>.</p>

        <h3>The 4-Element Precision Framework (R-C-O-N)</h3>
        <p>To produce deterministic, production-ready code on the first attempt, structure prompts using this schema:</p>

        <div class="article-callout">
          <ul class="article-list">
            <li><strong>1. Role:</strong> Assign exact specialization (e.g. <em>"Principal TypeScript &amp; Express Architect"</em>).</li>
            <li><strong>2. Context:</strong> Specify runtime version, existing dependencies, and module format (ESM vs CommonJS).</li>
            <li><strong>3. Output Contract:</strong> Enforce exact return shape (diff chunk, pure functional helper, or schema-typed JSON).</li>
            <li><strong>4. Negative Constraints:</strong> Explicitly forbid unwanted actions (no new npm packages, no inline styles, no breaking changes).</li>
          </ul>
        </div>

        <h3>Side-by-Side Prompt Comparison</h3>
        <div class="code-compare-grid">
          <div class="code-box bad">
            <span class="code-box-badge bad">❌ Vague Prompt</span>
            <pre><code>"Build me an auth login endpoint with express and a db."</code></pre>
            <p class="code-box-note">Result: AI invents random databases, exposes secrets in plaintext, and hallucinates mock libraries.</p>
          </div>

          <div class="code-box good">
            <span class="code-box-badge good">✅ Precision Prompt</span>
            <pre><code>"Role: Senior Express + TypeScript engineer.
Context: Node 20 ESM, PostgreSQL via Drizzle ORM.
Task: Write a JWT verification middleware inspecting 'Authorization: Bearer &lt;token&gt;'.
Constraints:
- Do not import external packages other than 'jsonwebtoken'.
- Handle expired tokens with HTTP 401 and JSON payload { error: string }.
- Return ONLY the TypeScript middleware handler with no chat preamble."</code></pre>
            <p class="code-box-note">Result: Clean, drop-in TypeScript middleware that runs seamlessly with your existing stack.</p>
          </div>
        </div>

        <h3>Chain of Thought Reasoning</h3>
        <p>For non-trivial algorithmic tasks or complex refactors, instruct the model: <em>"Outline your 3-step design plan first before emitting code."</em> This allocates internal computation tokens toward architectural planning, cutting regression rates by over 60%.</p>
      `,
    },
  },
  {
    id: "python-web-scraper",
    category: "python-automation",
    categoryFilterKey: "articles_filter_python",
    categoryLabel: { id: "🐍 Python & Automasi", en: "🐍 Python & Automation" },
    readingTime: { id: "5 mnt baca", en: "5 min read" },
    date: { id: "05 Agu 2026", en: "Aug 5, 2026" },
    dateIso: "2026-08-05",
    author: "HardCode Studio",
    title: {
      id: "Panduan Membangun Web Scraper Python yang Tangguh & Aman",
      en: "Building Ethical & Resilient Python Web Scrapers Without Crashing Servers",
    },
    excerpt: {
      id: "Cara elegan mengekstrak data web secara terstruktur: rate limiting, headers rotation, parsing HTML dengan BeautifulSoup, dan menyimpan langsung ke CSV.",
      en: "How to extract structured web data gracefully: rate limiting, user-agent headers, HTML parsing with BeautifulSoup, and exporting directly to CSV or SQLite.",
    },
    tags: ["#python", "#scraping", "#automation", "#data-pipeline"],
    content: {
      id: `
        <p class="article-lead">Web scraping adalah salah satu superpower paling nyata bagi siapa saja yang belajar Python. Dalam waktu singkat, kamu bisa mengumpulkan ribuan data publik—seperti harga pasar, daftar katalog produk, atau informasi lowongan kerja—tanpa harus menyalin manual satu per satu.</p>

        <p>Namun, scraper pemula sering kali langsung diblokir oleh server target karena mengirim puluhan request per detik tanpa jeda. Mari kita bangun scraper yang tangguh, sopan, dan tidak mudah error.</p>

        <h3>1. Anatomi Scraper yang Baik</h3>
        <p>Sebuah skrip scraping profesional memiliki 4 komponen penting:</p>
        <ol class="article-list">
          <li><strong>User-Agent Header:</strong> Meniru browser asli agar request tidak dianggap bot jahat.</li>
          <li><strong>Rate Limiting (Jeda Waktu):</strong> Memberi jeda acak (misal 1–3 detik) antara setiap halaman untuk menjaga beban server.</li>
          <li><strong>Safe Parsing &amp; Fallbacks:</strong> Menggunakan metode <code>find()</code> dengan pengecekan <code>None</code> agar script tidak langsung crash saat ada elemen yang hilang.</li>
          <li><strong>Penyimpanan Bertahap:</strong> Menyimpan data baris per baris ke CSV atau SQLite secara berkala.</li>
        </ol>

        <h3>2. Contoh Skrip Standar Industri</h3>
        <pre><code class="language-python">import requests
from bs4 import BeautifulSoup
import time
import random
import csv

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

def scrape_item(url):
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        title_el = soup.find('h1', class_='product-title')
        price_el = soup.find('span', class_='price-value')

        return {
            'title': title_el.text.strip() if title_el else 'N/A',
            'price': price_el.text.strip() if price_el else 'N/A',
            'url': url
        }
    except requests.exceptions.RequestException as e:
        print(f"[!] Gagal fetch {url}: {e}")
        return None

# Contoh eksekusi dengan jeda ramah
# time.sleep(random.uniform(1.2, 2.8))</code></pre>

        <div class="article-callout">
          <strong>⚠️ Etika Scraping yang Wajib Diingat:</strong>
          <p>Selalu periksa file <code>/robots.txt</code> dari domain yang ditargetkan, hindari scraping data pribadi/privat tanpa izin, dan jalankan batch scraper di jam-jam non-sibuk (seperti malam hari) jika scraping dalam volume besar.</p>
        </div>
      `,
      en: `
        <p class="article-lead">Web scraping is one of the most immediate superpowers unlocked by learning Python. In an afternoon, you can systematically gather thousands of structured data points—such as competitive prices, real estate listings, or research documents—without manual copy-paste drudgery.</p>

        <p>However, amateur scrapers get IP-blocked in minutes because they flood target servers with concurrent requests. Here is how to build scrapers that are resilient, ethical, and error-tolerant.</p>

        <h3>1. The Anatomy of a Production-Grade Scraper</h3>
        <ol class="article-list">
          <li><strong>User-Agent Emulation:</strong> Sending realistic browser headers so legitimate requests aren't filtered by basic WAFs.</li>
          <li><strong>Stochastic Rate Limiting:</strong> Injecting randomized delays (1.5–3s) between page transitions to respect server loads.</li>
          <li><strong>Defensive Node Traversal:</strong> Safe fallback defaults for missing DOM selectors so individual page anomalies don't abort entire batch runs.</li>
          <li><strong>Atomic Persistence:</strong> Streaming captured records continuously to SQLite or CSV.</li>
        </ol>

        <h3>2. Clean Python Implementation</h3>
        <pre><code class="language-python">import requests
from bs4 import BeautifulSoup
import time
import random

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
}

def scrape_listing(url):
    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        res.raise_for_status()

        soup = BeautifulSoup(res.text, 'html.parser')
        title = soup.find('h1', class_='title')
        price = soup.find('span', class_='price')

        return {
            'title': title.text.strip() if title else 'Unknown',
            'price': price.text.strip() if price else '0',
            'url': url
        }
    except requests.RequestException as err:
        print(f"Request failed for {url}: {err}")
        return None</code></pre>
      `,
    },
  },
  {
    id: "spa-vs-ssr-2026",
    category: "web-frontend",
    categoryFilterKey: "articles_filter_web",
    categoryLabel: { id: "🌐 Web & Frontend", en: "🌐 Web & Frontend" },
    readingTime: { id: "5 mnt baca", en: "5 min read" },
    date: { id: "28 Jul 2026", en: "Jul 28, 2026" },
    dateIso: "2026-07-28",
    author: "HardCode Studio",
    title: {
      id: "Arsitektur SPA vs SSR: Kapan Harus Memilih React Murni (Vite)?",
      en: "SPA vs SSR Architecture: When Should You Pick Pure React (Vite)?",
    },
    excerpt: {
      id: "Membedah mitos bahwa setiap website butuh server-side rendering. Untuk internal tools, dashboard SaaS, dan MVP interaktif, SPA sering kali jauh lebih cepat dan hemat biaya.",
      en: "Debunking the myth that every web project needs heavy server-side rendering. For internal tools, SaaS dashboards, and interactive MVPs, a pure SPA is faster and cheaper.",
    },
    tags: ["#react", "#vite", "#spa", "#web-architecture", "#frontend"],
    content: {
      id: `
        <p class="article-lead">Dalam beberapa tahun terakhir, ekosistem web dibanjiri narasi bahwa setiap aplikasi harus menggunakan framework Server-Side Rendering (SSR) yang kompleks. Namun dalam praktiknya, banyak startup dan bisnis kecil justru terbebani dengan biaya hosting server yang mahal, waktu build yang lambat, dan kerumitan konfigurasi hidrasi (hydration mismatch).</p>

        <h3>Kapan Single Page Application (SPA) Murni Adalah Pilihan Terbaik?</h3>
        <p>SPA yang dibangun menggunakan React + Vite dan di-bundle menjadi file HTML/JS/CSS statis memiliki keunggulan luar biasa dalam skenario berikut:</p>

        <div class="article-callout">
          <ul class="article-list">
            <li><strong>Dashboard Internal &amp; Admin Panel:</strong> Aplikasi di balik login tidak memerlukan SEO Google. Menjalankan SPA di CDN statis (seperti Cloudflare Pages atau Vercel Static) 100% gratis dan tahan banting terhadap lonjakan trafik.</li>
            <li><strong>Aplikasi Berbasis State Interaktif:</strong> Aplikasi seperti kalkulator simulasi, tools manajemen tugas, atau interactive canvas bekerja paling mulus saat seluruh logika state berada di memori browser.</li>
            <li><strong>Siklus Iterasi &amp; Hot-Reload Secepat Kilat:</strong> Vite memberikan pengalaman pengembangan (DX) yang instan tanpa harus menunggu server node melakukan render ulang di setiap perubahan kode.</li>
          </ul>
        </div>

        <h3>Kapan Kamu Memang Membutuhkan SSR?</h3>
        <p>SSR menjadi sangat penting hanya ketika:</p>
        <ol class="article-list">
          <li>Kamu membangun portal media publik atau marketplace e-commerce di mana jutaan halaman produk harus terindeks cepat oleh web crawler Google.</li>
          <li>Kamu membutuhkan <em>Dynamic Social Media Link Previews</em> (OpenGraph metadata) yang berbeda di setiap URL artikel publik.</li>
        </ol>

        <div class="article-quote">
          <p>&ldquo;Pilihlah arsitektur yang paling sederhana yang menyelesaikan masalah bisnismu. Kompleksitas infrastruktur yang tidak perlu adalah beban terbesar kecepatan rilis produk.&rdquo;</p>
        </div>
      `,
      en: `
        <p class="article-lead">In recent years, web development trends pushed the narrative that every app must adopt heavy Server-Side Rendering (SSR) frameworks. In reality, many startups find themselves burdened with high server hosting costs, slow build pipelines, and cryptic hydration errors for projects that never needed server rendering in the first place.</p>

        <h3>When a Pure Single Page App (SPA) Wins</h3>
        <p>A pure static SPA built with React + Vite deployed to an edge CDN offers distinct advantages:</p>
        <div class="article-callout">
          <ul class="article-list">
            <li><strong>Authenticated SaaS &amp; Internal Tools:</strong> Software behind user login requires zero Google SEO indexing. Serving static bundles from global CDNs costs virtually zero and never suffers downtime from server crashes.</li>
            <li><strong>State-Heavy Client Workspaces:</strong> Interactive canvas builders, financial calculators, and multi-step workflows thrive when client-side reactivity has zero round-trip latency.</li>
            <li><strong>Zero Server Cold-Starts:</strong> Static assets load instantly without waiting for serverless compute instances to wake up.</li>
          </ul>
        </div>

        <h3>When You Actually Need SSR</h3>
        <p>Reserve full SSR architectures for public content-heavy portals where dynamic OpenGraph crawler tags and high-volume organic search indexation are primary business revenue drivers.</p>
      `,
    },
  },
  {
    id: "proxy-api-key-security",
    category: "ai-llm",
    categoryFilterKey: "articles_filter_ai",
    categoryLabel: { id: "🤖 AI & LLM", en: "🤖 AI & LLM" },
    readingTime: { id: "5 mnt baca", en: "5 min read" },
    date: { id: "20 Jul 2026", en: "Jul 20, 2026" },
    dateIso: "2026-07-20",
    author: "HardCode Studio",
    title: {
      id: "Mencegah Kebocoran API Key di Aplikasi Frontend: Pola Proxy Server Aman",
      en: "Preventing API Key Leaks in Frontend Apps: Safe Proxy Server Architecture",
    },
    excerpt: {
      id: "Jangan pernah menaruh Gemini/OpenAI API key langsung di kode browser frontend. Bangun layer backend ringan dengan Express/Node untuk token sanitization.",
      en: "Never bundle Gemini or OpenAI API keys directly in client-side browser code. Build a lightweight Express proxy layer for secret protection and rate limiting.",
    },
    tags: ["#security", "#api-keys", "#node-express", "#ai-integration"],
    content: {
      id: `
        <p class="article-lead">Salah satu kesalahan fatal yang paling sering dilakukan pemula saat mengintegrasikan AI ke website adalah memanggil API Gemini atau OpenAI langsung dari kode React di browser. Apa pun trik yang kamu gunakan (termasuk menyamarkan variabel <code>VITE_API_KEY</code>), kunci rahasia tersebut <strong>pasti bisa dilihat oleh siapa saja</strong> melalui menu <em>Inspect &rarr; Network Tab</em> di browser.</p>

        <p>Jika API key bocor, pihak tidak bertanggung jawab bisa menghabiskan saldo kreditmu dalam hitungan menit untuk menjalankan bot mereka sendiri.</p>

        <h3>Solusi Standar Industri: Pola Backend Proxy</h3>
        <p>Prinsip keamanannya sangat sederhana: browser tidak boleh tahu API key aslimu. Browser hanya mengirim request ke endpoint server milikmu sendiri (misal: <code>/api/chat</code>), dan servermu yang akan meneruskannya ke Google/OpenAI.</p>

        <div class="article-callout">
          <strong>🛡️ Alur Komunikasi yang Aman:</strong>
          <pre><code>[ Browser Client ]
        |  (Kirim user prompt tanpa API key)
        v
[ Server Express / Node ]  &lt;-- API Key tersimpan di process.env.GEMINI_API_KEY
        |  (Kirim request terotentikasi)
        v
[ Google Gemini / OpenAI API ]</code></pre>
        </div>

        <h3>Contoh Implementasi Singkat di Express</h3>
        <pre><code class="language-javascript">// server.js (Berjalan di backend yang terlindungi)
import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());

// API key diakses aman dari environment variable server
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt tidak valid' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    res.json({ result: response.text });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memproses AI' });
  }
});</code></pre>

        <p>Dengan arsitektur ini, kamu juga bisa menambahkan pembatasan kuota (<em>Rate Limiting</em>), sensor kata-kata berbahaya, dan sistem autentikasi pengguna dengan sangat mudah.</p>
      `,
      en: `
        <p class="article-lead">One of the most dangerous vulnerabilities in modern web apps is invoking AI endpoints directly from client-side React code. Regardless of obfuscation or environment variable prefixing, any secret key compiled into client assets is <strong>fully extractable via the browser DevTools Network tab</strong>.</p>

        <p>Once exposed, automated bots can hijack your quotas and exhaust your cloud billing balance in minutes.</p>

        <h3>The Industry Standard: Lightweight Backend Proxy</h3>
        <p>The client browser should never possess the secret key. The frontend sends the user prompt to your dedicated route (e.g. <code>/api/generate</code>), and your protected Node server communicates with the LLM provider on the user's behalf.</p>

        <div class="article-callout">
          <pre><code>[ Browser Client ]
        |  (Sends raw prompt payload without secret credentials)
        v
[ Node/Express API Server ]  &lt;-- Reads process.env.GEMINI_API_KEY safely
        |  (Makes authenticated upstream call)
        v
[ AI Model Provider (Gemini/OpenAI) ]</code></pre>
        </div>

        <p>This proxy layer also gives you centralized control over payload validation, content filtering, rate-limiting, and cost telemetries.</p>
      `,
    },
  },
  {
    id: "spreadsheet-ke-crud-dashboard",
    category: "python-automation",
    categoryFilterKey: "articles_filter_python",
    categoryLabel: { id: "🐍 Python & Automasi", en: "🐍 Python & Automation" },
    readingTime: { id: "6 mnt baca", en: "6 min read" },
    date: { id: "14 Jul 2026", en: "Jul 14, 2026" },
    dateIso: "2026-07-14",
    author: "HardCode Studio",
    title: {
      id: "Dari Spreadsheet Berantakan ke Dashboard CRUD: Panduan Menata Data Bisnis",
      en: "From Messy Spreadsheets to Clean CRUD Dashboards: Business Data Modernization",
    },
    excerpt: {
      id: "Kapan operasional bisnis harus beralih dari Excel ke database terstruktur? Pelajari tanda-tanda bottleneck dan langkah migrasi bertahap tanpa downtime.",
      en: "When should growing operations transition from Excel to structured relational databases? Recognize critical bottlenecks and execute phased migrations without disruption.",
    },
    tags: ["#internal-tools", "#database", "#crud", "#workflow", "#automation"],
    content: {
      id: `
        <p class="article-lead">Spreadsheet (Google Sheets atau Microsoft Excel) adalah alat terbaik di dunia untuk memulai bisnis. Spreadsheet fleksibel, mudah diedit, dan tidak membutuhkan keahlian coding. Namun ketika transaksi mulai melonjak dan jumlah staf bertambah, spreadsheet sering kali berubah menjadi <strong>bom waktu operasional</strong>.</p>

        <h3>5 Tanda Bisnismu Sudah Melebihi Batas Wajar Spreadsheet</h3>
        <ol class="article-list">
          <li><strong>Data Rusak Akibat Salah Hapus:</strong> Karyawan tanpa sengaja menimpa rumus atau menghapus baris transaksi penting.</li>
          <li><strong>File Terasa Sangat Lemot:</strong> Membuka file butuh waktu lebih dari 10 detik karena sudah menampung puluhan ribu baris data.</li>
          <li><strong>Tidak Ada Batasan Hak Akses (RBAC):</strong> Kamu ingin staf gudang hanya melihat data stok barang, tetapi mereka bisa melihat laporan keuangan omset karena file-nya sama.</li>
          <li><strong>Data Tidak Konsisten:</strong> Penulisan status pesanan bervariasi ("Lunas", "lunas", "Sudah Bayar", "ok") sehingga laporan keuangan tidak bisa direkap otomatis.</li>
          <li><strong>Integrasi Terputus:</strong> Kamu harus menyalin data transaksi secara manual dari WhatsApp ke spreadsheet setiap malam.</li>
        </ol>

        <h3>Langkah Migrasi ke Custom CRUD Dashboard</h3>
        <div class="article-callout">
          <p><strong>Tahap 1: Normalisasi Skema Data</strong> &mdash; Kelompokkan data menjadi entitas yang jelas: Tabel Pengguna, Tabel Produk, Tabel Pesanan, dan Tabel Pembayaran.</p>
          <p><strong>Tahap 2: Buat Form Input yang Tervalidasi</strong> &mdash; Gantikan input bebas dengan dropdown pilihan statis dan validasi tipe angka wajib.</p>
          <p><strong>Tahap 3: Sambungkan Webhook Otomatis</strong> &mdash; Biarkan pesanan dari website atau form customer langsung tersimpan ke database dalam hitungan detik.</p>
        </div>

        <p>Membangun internal tools kustom bukan berarti harus mahal atau rumit. Aplikasi CRUD sederhana dengan antarmuka yang bersih dapat menghemat belasan jam kerja tim setiap minggunya.</p>
      `,
      en: `
        <p class="article-lead">Spreadsheets are the ultimate zero-to-one business tool. They are fast, infinitely flexible, and accessible. However, as operational velocity accelerates and team size expands, unconstrained spreadsheets inevitably become <strong>operational liability bottlenecks</strong>.</p>

        <h3>5 Warning Signs You've Outgrown Spreadsheets</h3>
        <ol class="article-list">
          <li><strong>Accidental Data Corruption:</strong> Team members inadvertently overwriting formulas or deleting audit rows.</li>
          <li><strong>Lagging Load Times:</strong> Files taking over 10 seconds to open due to massive historical rows.</li>
          <li><strong>Lack of Role-Based Permissions (RBAC):</strong> Inability to restrict sensitive margin or financial data from operational fulfillment staff.</li>
          <li><strong>Dirty Inconsistent State:</strong> Fragmented text entries ("PAID", "paid", "Completed", "done") breaking summary metrics.</li>
          <li><strong>Manual Data Entry Overhead:</strong> Spending hours copy-pasting order details across disjointed tools.</li>
        </ol>

        <h3>The Phased Modernization Path</h3>
        <div class="article-callout">
          <p><strong>Phase 1: Relational Schema Design</strong> &mdash; Decompose monolithic sheets into normalized entities (Customers, Items, Invoices, Audit Logs).</p>
          <p><strong>Phase 2: Validated Input Interfaces</strong> &mdash; Replace open-ended text fields with constrained form dropdowns, format masks, and backend schema validations.</p>
          <p><strong>Phase 3: Event-Driven Webhooks</strong> &mdash; Stream transactional events directly into databases automatically.</p>
        </div>
      `,
    },
  },
];
