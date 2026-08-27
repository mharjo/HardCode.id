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
  console.log("== Starting Phase B Back-to-Top QA ==");

  console.log("1. Spawning vite preview server on port", PREVIEW_PORT);
  const previewProc = spawn("cmd.exe", ["/c", "npm", "run", "preview", "--", "--host", "127.0.0.1", "--port", String(PREVIEW_PORT)], {
    stdio: "pipe",
    cwd: process.cwd(),
  });

  try {
    await waitForHttp(`${BASE_URL}/`, 15000);
    console.log("Preview server reachable at", BASE_URL);

    console.log("2. Spawning headless Chrome on debugging port", CDP_PORT);
    const chromeProc = spawn(
      CHROME_PATH,
      [
        "--headless=new",
        `--remote-debugging-port=${CDP_PORT}`,
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--user-data-dir=C:\\Users\\misni\\AppData\\Local\\Temp\\chrome-qa-profile-phase-b",
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

      // 1. Initial State: scrollY = 0 -> Button hidden near top of page
      await client.navigate(`${BASE_URL}/`);
      await sleep(500);

      const topState = await client.evaluate(`(() => {
        window.scrollTo(0, 0);
        const btn = document.querySelector('button[aria-label="Kembali ke atas"], button[aria-label="Back to top"]');
        if (!btn) return { found: false };
        const style = window.getComputedStyle(btn);
        return {
          found: true,
          scrollY: window.scrollY,
          className: btn.className,
          opacity: style.opacity,
          visibility: style.visibility,
          ariaLabel: btn.getAttribute('aria-label'),
          title: btn.getAttribute('title')
        };
      })()`);

      results.hiddenAtTop = {
        ...topState,
        isHidden: topState.found && (topState.opacity === "0" || topState.visibility === "hidden") && !topState.className.includes("visible")
      };
      console.log("1. Hidden near top:", JSON.stringify(results.hiddenAtTop, null, 2));

      // 2. Scroll down -> Button appears after scrolling
      await client.evaluate("window.scrollTo(0, 600)");
      await sleep(300);

      const scrolledState = await client.evaluate(`(() => {
        const btn = document.querySelector('button[aria-label="Kembali ke atas"], button[aria-label="Back to top"]');
        if (!btn) return { found: false };
        const style = window.getComputedStyle(btn);
        return {
          found: true,
          scrollY: window.scrollY,
          className: btn.className,
          opacity: style.opacity,
          visibility: style.visibility,
          ariaLabel: btn.getAttribute('aria-label')
        };
      })()`);

      results.appearsAfterScroll = {
        ...scrolledState,
        isVisible: scrolledState.found && scrolledState.opacity === "1" && scrolledState.visibility === "visible" && scrolledState.className.includes("visible")
      };
      console.log("2. Appears after scroll:", JSON.stringify(results.appearsAfterScroll, null, 2));

      // 3. Click button -> Scrolls to top
      await client.evaluate(`(() => {
        const btn = document.querySelector('button[aria-label="Kembali ke atas"], button[aria-label="Back to top"]');
        if (btn) btn.click();
      })()`);
      await sleep(600);

      const afterClickScrollY = await client.evaluate("window.scrollY");
      results.scrollToTopOnClick = {
        beforeClickScrollY: scrolledState.scrollY,
        afterClickScrollY,
        success: afterClickScrollY <= 5
      };
      console.log("3. Click scrolls to top:", JSON.stringify(results.scrollToTopOnClick, null, 2));

      // 4 & 5 & 6: Translations (ID: Kembali ke atas, EN: Back to top)
      await client.navigate(`${BASE_URL}/`);
      await sleep(400);

      const idAriaLabel = await client.evaluate(`(() => {
        const btn = document.querySelector('button[aria-label="Kembali ke atas"]');
        return btn ? btn.getAttribute('aria-label') : '';
      })()`);

      // Switch language to EN
      await client.evaluate(`(() => {
        const langBtn = Array.from(document.querySelectorAll('header nav button')).find(b => b.getAttribute('aria-label')?.toLowerCase().includes('bahasa') || b.getAttribute('aria-label')?.toLowerCase().includes('language') || b.innerText.includes('ID'));
        if (langBtn) langBtn.click();
      })()`);
      await sleep(300);

      const enAriaLabel = await client.evaluate(`(() => {
        const btn = document.querySelector('button[aria-label="Back to top"]');
        return btn ? btn.getAttribute('aria-label') : '';
      })()`);

      results.translations = {
        idAriaLabel,
        enAriaLabel,
        isIdCorrect: idAriaLabel === "Kembali ke atas",
        isEnCorrect: enAriaLabel === "Back to top"
      };
      console.log("4/5/6. Translations:", JSON.stringify(results.translations, null, 2));

      // 7. Desktop positioning & Non-overlap with chatbot launcher
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: 1280,
        height: 800,
        deviceScaleFactor: 1,
        mobile: false
      });
      await client.evaluate("window.scrollTo(0, 600)");
      await sleep(300);

      const desktopLayout = await client.evaluate(`(() => {
        const bttBtn = document.querySelector('button[aria-label="Kembali ke atas"], button[aria-label="Back to top"]');
        const chatLauncher = Array.from(document.querySelectorAll('button')).find(b => b.className.includes('trigger') || b.querySelector('[aria-label="Tanya AI"], [aria-label="Chat"]'));
        if (!bttBtn || !chatLauncher) return { error: "Buttons not found", hasBtt: !!bttBtn, hasChat: !!chatLauncher };

        const bttRect = bttBtn.getBoundingClientRect();
        const chatRect = chatLauncher.getBoundingClientRect();

        // Check if bounding boxes intersect
        const intersects = !(
          bttRect.right < chatRect.left ||
          bttRect.left > chatRect.right ||
          bttRect.bottom < chatRect.top ||
          bttRect.top > chatRect.bottom
        );

        return {
          bttRect: { top: bttRect.top, bottom: bttRect.bottom, left: bttRect.left, right: bttRect.right, width: bttRect.width, height: bttRect.height },
          chatRect: { top: chatRect.top, bottom: chatRect.bottom, left: chatRect.left, right: chatRect.right, width: chatRect.width, height: chatRect.height },
          gap: chatRect.top - bttRect.bottom,
          intersects,
          noOverlap: !intersects
        };
      })()`);

      results.desktopNonOverlap = desktopLayout;
      console.log("7. Desktop Layout & Non-Overlap:", JSON.stringify(desktopLayout, null, 2));

      // 8. Mobile behavior & Non-overlap (375x667 viewport)
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: 375,
        height: 667,
        deviceScaleFactor: 2,
        mobile: true
      });
      await client.evaluate("window.scrollTo(0, 600)");
      await sleep(300);

      const mobileLayout = await client.evaluate(`(() => {
        const bttBtn = document.querySelector('button[aria-label="Kembali ke atas"], button[aria-label="Back to top"]');
        const chatLauncher = Array.from(document.querySelectorAll('button')).find(b => b.className.includes('trigger'));
        if (!bttBtn || !chatLauncher) return { error: "Buttons not found" };

        const bttRect = bttBtn.getBoundingClientRect();
        const chatRect = chatLauncher.getBoundingClientRect();

        const intersects = !(
          bttRect.right < chatRect.left ||
          bttRect.left > chatRect.right ||
          bttRect.bottom < chatRect.top ||
          bttRect.top > chatRect.bottom
        );

        const style = window.getComputedStyle(bttBtn);

        return {
          scrollY: window.scrollY,
          visibleClass: bttBtn.className.includes('visible'),
          opacity: style.opacity,
          bttRect: { top: bttRect.top, bottom: bttRect.bottom, left: bttRect.left, right: bttRect.right, width: bttRect.width, height: bttRect.height },
          chatRect: { top: chatRect.top, bottom: chatRect.bottom, left: chatRect.left, right: chatRect.right, width: chatRect.width, height: chatRect.height },
          gap: chatRect.top - bttRect.bottom,
          intersects,
          noOverlap: !intersects
        };
      })()`);

      // Also verify clicking back to top works on mobile
      await client.evaluate(`(() => {
        const bttBtn = document.querySelector('button[aria-label="Kembali ke atas"], button[aria-label="Back to top"]');
        if (bttBtn) bttBtn.click();
      })()`);
      await sleep(600);

      const mobileScrollAfterClick = await client.evaluate("window.scrollY");
      results.mobileBehavior = {
        ...mobileLayout,
        mobileScrollAfterClick,
        success: mobileLayout.noOverlap && mobileScrollAfterClick <= 5
      };
      console.log("8. Mobile Behavior:", JSON.stringify(results.mobileBehavior, null, 2));

      client.close();

      console.log("\n== ALL PHASE B RESULTS ==");
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
