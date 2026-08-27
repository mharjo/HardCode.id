import { spawn } from "node:child_process";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PREVIEW_PORT = 4173;
const CDP_PORT = 9222;
const BASE_URL = `http://127.0.0.1:${PREVIEW_PORT}`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHttp(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 200 || res.status === 304) {
        return true;
      }
    } catch {
      // ignore
    }
    await sleep(250);
  }
  throw new Error(`Timeout waiting for ${url}`);
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.msgId = 0;
    this.pending = new Map();
    this.events = [];
    this.consoleLogs = [];
    this.exceptions = [];
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) {
          reject(msg.error);
        } else {
          resolve(msg.result);
        }
      } else if (msg.method) {
        if (msg.method === "Runtime.consoleAPICalled") {
          const type = msg.params.type;
          const text = msg.params.args.map((a) => a.value ?? a.description ?? JSON.stringify(a)).join(" ");
          this.consoleLogs.push({ type, text });
        } else if (msg.method === "Runtime.exceptionThrown") {
          const text = msg.params.exceptionDetails?.text || "Unknown exception";
          const desc = msg.params.exceptionDetails?.exception?.description || "";
          this.exceptions.push({ text, desc });
        }
      }
    };

    await this.send("Runtime.enable");
    await this.send("Page.enable");
  }

  send(method, params = {}) {
    const id = ++this.msgId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) {
      throw new Error(`Eval failed: ${JSON.stringify(result.exceptionDetails)}`);
    }
    return result.result?.value;
  }

  async navigate(url) {
    this.consoleLogs = [];
    this.exceptions = [];
    await this.send("Page.navigate", { url });
    await sleep(800);
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

async function runQA() {
  console.log("== Starting Phase A Browser QA ==");

  console.log("1. Spawning vite preview server on port", PREVIEW_PORT);
  const previewProc = spawn("cmd.exe", ["/c", "npm", "run", "preview", "--", "--host", "127.0.0.1", "--port", String(PREVIEW_PORT)], {
    stdio: "pipe",
    cwd: process.cwd(),
  });

  try {
    await waitForHttp(`${BASE_URL}/`, 15000);
    console.log("Preview server is reachable at", BASE_URL);

    console.log("2. Spawning headless Chrome on debugging port", CDP_PORT);
    const chromeProc = spawn(
      CHROME_PATH,
      [
        "--headless=new",
        `--remote-debugging-port=${CDP_PORT}`,
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--user-data-dir=C:\\Users\\misni\\AppData\\Local\\Temp\\chrome-qa-profile",
        "about:blank",
      ],
      { stdio: "ignore" }
    );

    try {
      await waitForHttp(`http://127.0.0.1:${CDP_PORT}/json/version`, 10000);
      console.log("Chrome debugging port is reachable.");

      const newTabRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?${encodeURIComponent(BASE_URL)}`, { method: "PUT" });
      const newTabData = await newTabRes.json();
      const wsUrl = newTabData.webSocketDebuggerUrl;

      const client = new CDPClient(wsUrl);
      await client.connect();
      console.log("Connected to CDP WebSocket.");

      const results = {};

      // Test 1: Routes loading without console errors
      const routes = ["/", "/artikel", "/belajar", "/proyek", "/konsultasi"];
      for (const route of routes) {
        await client.navigate(`${BASE_URL}${route}`);
        await sleep(500);

        const pageTitle = await client.evaluate("document.title");
        const rootHtmlLen = await client.evaluate("document.getElementById('root')?.innerHTML.length || 0");
        const heading = await client.evaluate("document.querySelector('h1, h2')?.innerText || ''");
        const errors = client.exceptions.concat(client.consoleLogs.filter((l) => l.type === "error"));

        results[`route_${route}`] = {
          route,
          pageTitle,
          rootHtmlLen,
          heading: heading.replace(/\\r?\\n/g, " "),
          errorCount: errors.length,
          errors,
        };
        console.log(`Route ${route}: title="${pageTitle}", rootBytes=${rootHtmlLen}, errors=${errors.length}`);
      }

      // Test 2: Navbar Parity with SOURCE
      await client.navigate(`${BASE_URL}/`);
      await sleep(500);

      const navDetails = await client.evaluate(`(() => {
        const header = document.querySelector('header');
        if (!header) return { found: false };
        const wordmark = header.querySelector('a')?.innerText || '';
        const nav = header.querySelector('nav');
        if (!nav) return { found: false, hasNav: false };
        const links = Array.from(nav.querySelectorAll('a')).map(a => ({
          href: a.getAttribute('href'),
          text: a.innerText.replace(/\\s+/g, ' ').trim()
        }));
        const buttons = Array.from(nav.querySelectorAll('button')).map(b => ({
          ariaLabel: b.getAttribute('aria-label') || '',
          id: b.id || '',
          className: b.className || '',
          innerText: b.innerText.replace(/\\s+/g, ' ').trim()
        }));
        return {
          found: true,
          hasNav: true,
          wordmark,
          links,
          buttons
        };
      })()`);

      results.navbar = navDetails;

      // Test 3: Language Toggle on Every Route
      results.langToggle = {};
      for (const route of routes) {
        await client.navigate(`${BASE_URL}${route}`);
        await sleep(400);

        const initialDocLang = await client.evaluate("document.documentElement.lang");
        const initialText = await client.evaluate("document.body.innerText.slice(0, 100).replace(/\\s+/g, ' ')");

        await client.evaluate(`(() => {
          const btn = Array.from(document.querySelectorAll('header nav button')).find(b => b.getAttribute('aria-label')?.toLowerCase().includes('bahasa') || b.getAttribute('aria-label')?.toLowerCase().includes('language') || b.innerText.includes('ID') || b.innerText.includes('EN'));
          if (btn) btn.click();
        })()`);
        await sleep(300);

        const enDocLang = await client.evaluate("document.documentElement.lang");
        const enText = await client.evaluate("document.body.innerText.slice(0, 100).replace(/\\s+/g, ' ')");
        const enStoredLang = await client.evaluate("localStorage.getItem('preferred_language') || localStorage.getItem('lang') || ''");

        await client.evaluate(`(() => {
          const btn = Array.from(document.querySelectorAll('header nav button')).find(b => b.getAttribute('aria-label')?.toLowerCase().includes('bahasa') || b.getAttribute('aria-label')?.toLowerCase().includes('language') || b.innerText.includes('ID') || b.innerText.includes('EN'));
          if (btn) btn.click();
        })()`);
        await sleep(300);

        const backIdDocLang = await client.evaluate("document.documentElement.lang");
        const backIdText = await client.evaluate("document.body.innerText.slice(0, 100).replace(/\\s+/g, ' ')");
        const backIdStored = await client.evaluate("localStorage.getItem('preferred_language') || localStorage.getItem('lang') || ''");

        results.langToggle[route] = {
          initial: { docLang: initialDocLang, textSnippet: initialText },
          toggledEn: { docLang: enDocLang, stored: enStoredLang, textSnippet: enText },
          toggledBackId: { docLang: backIdDocLang, stored: backIdStored, textSnippet: backIdText },
          toggleSuccess: (initialDocLang !== enDocLang || initialText !== enText) && enDocLang === "en" && backIdDocLang === "id"
        };
        console.log(`Lang toggle on ${route}: success=${results.langToggle[route].toggleSuccess}`);
      }

      // Test 4: Theme Toggle on Every Route
      results.themeToggle = {};
      for (const route of routes) {
        await client.navigate(`${BASE_URL}${route}`);
        await sleep(400);

        await client.evaluate(`(() => {
          document.documentElement.setAttribute('data-theme', 'light');
          localStorage.setItem('theme', 'light');
        })()`);
        await sleep(100);

        const initialTheme = await client.evaluate("document.documentElement.getAttribute('data-theme')");
        const initialStored = await client.evaluate("localStorage.getItem('theme')");

        await client.evaluate(`(() => {
          const themeBtn = Array.from(document.querySelectorAll('header nav button')).find(b => b.getAttribute('aria-label')?.toLowerCase().includes('mode') || b.getAttribute('aria-label')?.toLowerCase().includes('theme') || b.querySelector('svg'));
          if (themeBtn) themeBtn.click();
        })()`);
        await sleep(300);

        const darkTheme = await client.evaluate("document.documentElement.getAttribute('data-theme')");
        const darkStored = await client.evaluate("localStorage.getItem('theme')");

        await client.evaluate(`(() => {
          const themeBtn = Array.from(document.querySelectorAll('header nav button')).find(b => b.getAttribute('aria-label')?.toLowerCase().includes('mode') || b.getAttribute('aria-label')?.toLowerCase().includes('theme') || b.querySelector('svg'));
          if (themeBtn) themeBtn.click();
        })()`);
        await sleep(300);

        const lightThemeBack = await client.evaluate("document.documentElement.getAttribute('data-theme')");
        const lightStoredBack = await client.evaluate("localStorage.getItem('theme')");

        results.themeToggle[route] = {
          initial: { domTheme: initialTheme, stored: initialStored },
          toggledDark: { domTheme: darkTheme, stored: darkStored },
          toggledBackLight: { domTheme: lightThemeBack, stored: lightStoredBack },
          success: initialTheme === "light" && darkTheme === "dark" && darkStored === "dark" && lightThemeBack === "light" && lightStoredBack === "light"
        };
        console.log(`Theme toggle on ${route}: success=${results.themeToggle[route].success}`);
      }

      // Test 5: Theme Persistence Across Refresh
      await client.navigate(`${BASE_URL}/`);
      await sleep(400);

      await client.evaluate(`(() => {
        const themeBtn = Array.from(document.querySelectorAll('header nav button')).find(b => b.getAttribute('aria-label')?.toLowerCase().includes('mode') || b.getAttribute('aria-label')?.toLowerCase().includes('theme') || b.querySelector('svg'));
        if (themeBtn) themeBtn.click();
      })()`);
      await sleep(200);

      const beforeRefreshTheme = await client.evaluate("document.documentElement.getAttribute('data-theme')");
      const beforeRefreshStored = await client.evaluate("localStorage.getItem('theme')");

      await client.navigate(`${BASE_URL}/`);
      await sleep(500);

      const afterRefreshTheme = await client.evaluate("document.documentElement.getAttribute('data-theme')");
      const afterRefreshStored = await client.evaluate("localStorage.getItem('theme')");

      results.themePersistence = {
        beforeRefreshTheme,
        beforeRefreshStored,
        afterRefreshTheme,
        afterRefreshStored,
        persisted: beforeRefreshTheme === "dark" && afterRefreshTheme === "dark" && afterRefreshStored === "dark"
      };

      client.close();

      console.log("\\n== ALL AUTOMATION RESULTS ==");
      console.log(JSON.stringify(results, null, 2));
      return results;
    } finally {
      chromeProc.kill();
    }
  } finally {
    previewProc.kill();
  }
}

runQA()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("QA execution error:", err);
    process.exit(1);
  });
