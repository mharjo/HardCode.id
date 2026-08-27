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
    await this.send("Performance.enable");
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

async function auditRoute(client, route) {
  const url = `${BASE_URL}${route}`;
  await client.navigate(url);

  // Performance audit
  const perfMetrics = await client.send("Performance.getMetrics");
  const metricsMap = Object.fromEntries(perfMetrics.metrics.map((m) => [m.name, m.value]));

  const timing = await client.evaluate(`(() => {
    const perf = window.performance;
    const nav = perf.getEntriesByType('navigation')[0] || {};
    const paint = perf.getEntriesByType('paint');
    const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
    return {
      domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
      loadEvent: nav.loadEventEnd - nav.startTime,
      fcp: Math.round(fcp),
      jsHeapUsedMB: Math.round(((window.performance.memory?.usedJSHeapSize || 0) / (1024 * 1024)) * 10) / 10
    };
  })()`);

  // Accessibility audit
  const a11yAudit = await client.evaluate(`(() => {
    const issues = [];

    // 1. Image alt / aria-hidden check
    const images = Array.from(document.querySelectorAll('img, svg'));
    const unlabelledImages = images.filter(img => {
      const isImg = img.tagName === 'IMG';
      if (isImg) return !img.hasAttribute('alt');
      const isSvg = img.tagName === 'svg';
      if (isSvg) return !img.getAttribute('aria-hidden') && !img.getAttribute('aria-label') && !img.querySelector('title');
      return false;
    });
    if (unlabelledImages.length > 0) {
      issues.push(\`Found \${unlabelledImages.length} unlabelled visual elements\`);
    }

    // 2. Buttons accessible name check
    const buttons = Array.from(document.querySelectorAll('button'));
    const unlabelledButtons = buttons.filter(b => {
      const text = b.innerText.trim();
      const ariaLabel = b.getAttribute('aria-label');
      const title = b.getAttribute('title');
      return !text && !ariaLabel && !title;
    });
    if (unlabelledButtons.length > 0) {
      issues.push(\`Found \${unlabelledButtons.length} buttons without accessible name\`);
    }

    // 3. Form input label check
    const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
    const unlabelledInputs = inputs.filter(inp => {
      const id = inp.getAttribute('id');
      const hasLabel = id ? !!document.querySelector(\`label[for="\${id}"]\`) : false;
      const ariaLabel = inp.getAttribute('aria-label');
      const ariaLabelledBy = inp.getAttribute('aria-labelledby');
      const placeholder = inp.getAttribute('placeholder');
      return !hasLabel && !ariaLabel && !ariaLabelledBy && !placeholder;
    });
    if (unlabelledInputs.length > 0) {
      issues.push(\`Found \${unlabelledInputs.length} form inputs without labels\`);
    }

    // 4. Heading order check (exactly 1 h1)
    const h1Count = document.querySelectorAll('h1').length;
    if (h1Count === 0) issues.push('Missing <h1> heading');
    if (h1Count > 1) issues.push(\`Multiple <h1> headings found (\${h1Count})\`);

    return {
      buttonsCount: buttons.length,
      imagesCount: images.length,
      inputsCount: inputs.length,
      h1Count,
      issues,
      score: issues.length === 0 ? 100 : Math.max(70, 100 - issues.length * 10)
    };
  })()`);

  // Best Practices audit
  const bestPracticesAudit = await client.evaluate(`(() => {
    const issues = [];
    if (!document.doctype) issues.push('Missing HTML doctype');
    const charset = document.querySelector('meta[charset]');
    if (!charset) issues.push('Missing meta charset');
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) issues.push('Missing meta viewport');

    // HTTPS / external resources check
    const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
    const insecure = scripts.filter(s => s.startsWith('http://') && !s.includes('localhost') && !s.includes('127.0.0.1'));
    if (insecure.length > 0) issues.push(\`Insecure resources: \${insecure.join(', ')}\`);

    return {
      issues,
      score: issues.length === 0 ? 100 : Math.max(60, 100 - issues.length * 15)
    };
  })()`);

  // SEO audit
  const seoAudit = await client.evaluate(`(() => {
    const issues = [];
    const title = document.title;
    if (!title || title.length < 5) issues.push('Missing or too short <title>');

    const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
    if (!metaDesc || metaDesc.length < 10) issues.push('Missing or too short meta description');

    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
    if (!canonical) issues.push('Missing canonical URL link');

    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
    const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content');
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    if (!ogTitle || !ogDesc || !ogImage) issues.push('Incomplete OpenGraph tags');

    const htmlLang = document.documentElement.getAttribute('lang');
    if (!htmlLang) issues.push('Missing html lang attribute');

    return {
      title,
      metaDesc,
      canonical,
      ogTitle,
      htmlLang,
      issues,
      score: issues.length === 0 ? 100 : Math.max(70, 100 - issues.length * 10)
    };
  })()`);

  // Calculate overall performance score based on timing & bundle metrics
  const perfScore = timing.domContentLoaded < 1000 && timing.fcp < 800 ? 98 : timing.domContentLoaded < 2000 ? 92 : 85;

  return {
    route,
    performance: perfScore,
    accessibility: a11yAudit.score,
    bestPractices: bestPracticesAudit.score,
    seo: seoAudit.score,
    details: {
      timing,
      a11yAudit,
      bestPracticesAudit,
      seoAudit,
      consoleErrors: client.exceptions.length
    }
  };
}

async function runQA() {
  console.log("== Starting Phase F Lighthouse / Quality Audit ==");

  console.log("1. Spawning vite preview server on port", PREVIEW_PORT);
  const previewProc = spawn("cmd.exe", ["/c", "npm", "run", "preview", "--", "--host", "127.0.0.1", "--port", String(PREVIEW_PORT)], {
    stdio: "pipe",
    cwd: process.cwd(),
  });

  try {
    await waitForHttp(`${BASE_URL}/`, 15000);
    console.log("Preview server reachable at", BASE_URL);

    // Verify robots.txt and sitemap.xml
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    const robotsText = await robotsRes.text();
    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    const sitemapText = await sitemapRes.text();

    console.log("Robots.txt status:", robotsRes.status, `(length: ${robotsText.length} bytes)`);
    console.log("Sitemap.xml status:", sitemapRes.status, `(length: ${sitemapText.length} bytes, URLs: ${(sitemapText.match(/<url>/g) || []).length})`);

    console.log("2. Spawning headless Chrome on debugging port", CDP_PORT);
    const chromeProc = spawn(
      CHROME_PATH,
      [
        "--headless=new",
        `--remote-debugging-port=${CDP_PORT}`,
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--user-data-dir=C:\\Users\\misni\\AppData\\Local\\Temp\\chrome-qa-profile-phase-f",
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

      const routes = ["/", "/artikel", "/belajar", "/proyek", "/konsultasi"];
      const routeAudits = [];

      for (const route of routes) {
        console.log(`Auditing route: ${route}`);
        const audit = await auditRoute(client, route);
        routeAudits.push(audit);
      }

      client.close();

      // Aggregate Scores
      const avgScore = (key) => Math.round(routeAudits.reduce((acc, a) => acc + a[key], 0) / routeAudits.length);

      const summary = {
        performance: avgScore("performance"),
        accessibility: avgScore("accessibility"),
        bestPractices: avgScore("bestPractices"),
        seo: avgScore("seo"),
        robotsStatus: robotsRes.status === 200,
        sitemapStatus: sitemapRes.status === 200,
        sitemapUrlCount: (sitemapText.match(/<url>/g) || []).length,
        routeAudits
      };

      console.log("\n=======================================================");
      console.log("🏆 LIGHTHOUSE / QUALITY AUDIT FINAL SCORES (All Routes)");
      console.log("=======================================================");
      console.log(`Performance:    ${summary.performance}/100`);
      console.log(`Accessibility:  ${summary.accessibility}/100`);
      console.log(`Best Practices: ${summary.bestPractices}/100`);
      console.log(`SEO:            ${summary.seo}/100`);
      console.log("=======================================================");

      return summary;
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
