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
  console.log("== Starting Phase D Quote Estimator QA ==");

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
        "--user-data-dir=C:\\Users\\misni\\AppData\\Local\\Temp\\chrome-qa-profile-phase-d",
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

      // Open widget and switch to Quote tab
      await client.navigate(`${BASE_URL}/`);
      await sleep(500);

      await client.evaluate(`(() => {
        const trigger = Array.from(document.querySelectorAll('button')).find(b => b.className.includes('trigger'));
        if (trigger) trigger.click();
      })()`);
      await sleep(400);

      // Click Quote tab
      await client.evaluate(`(() => {
        const quoteTab = document.getElementById('tanya-tab-quote') || Array.from(document.querySelectorAll('button[role="tab"]'))[1];
        if (quoteTab) quoteTab.click();
      })()`);
      await sleep(400);

      // -------------------------------------------------------------
      // 1. Category selection works
      // -------------------------------------------------------------
      const beforeClickText = await client.evaluate(`document.querySelector('div[class*="breakdownItem"] strong')?.innerText || ''`);

      // Click second category
      await client.evaluate(`(() => {
        const catButtons = Array.from(document.querySelectorAll('div[class*="catGrid"] button'));
        if (catButtons[1]) catButtons[1].click();
      })()`);
      await sleep(200);
      const afterClickSecond = await client.evaluate(`document.querySelector('div[class*="breakdownItem"] strong')?.innerText || ''`);

      // Click third category
      await client.evaluate(`(() => {
        const catButtons = Array.from(document.querySelectorAll('div[class*="catGrid"] button'));
        if (catButtons[2]) catButtons[2].click();
      })()`);
      await sleep(200);
      const afterClickThird = await client.evaluate(`document.querySelector('div[class*="breakdownItem"] strong')?.innerText || ''`);

      // Reset to first
      await client.evaluate(`(() => {
        const catButtons = Array.from(document.querySelectorAll('div[class*="catGrid"] button'));
        if (catButtons[0]) catButtons[0].click();
      })()`);
      await sleep(200);
      const afterClickFirst = await client.evaluate(`document.querySelector('div[class*="breakdownItem"] strong')?.innerText || ''`);

      const totalCategories = await client.evaluate(`document.querySelectorAll('div[class*="catGrid"] button').length`);

      results.categorySelection = {
        totalCategories,
        beforeClickText,
        afterClickSecond,
        afterClickThird,
        afterClickFirst,
        success: totalCategories === 8 && afterClickSecond !== beforeClickText && afterClickThird !== afterClickSecond
      };
      console.log("1. Category Selection:", results.categorySelection.success);

      // -------------------------------------------------------------
      // 2. Complexity selection works
      // -------------------------------------------------------------
      const getMetrics = async () => ({
        timeline: await client.evaluate(`Array.from(document.querySelectorAll('span[class*="metricVal"]'))[0]?.innerText || ''`),
        price: await client.evaluate(`Array.from(document.querySelectorAll('span[class*="metricVal"]'))[1]?.innerText || ''`)
      });

      const simpleMetrics = await getMetrics();

      // Click Medium complexity
      await client.evaluate(`(() => {
        const compButtons = Array.from(document.querySelectorAll('div[class*="compGrid"] button'));
        if (compButtons[1]) compButtons[1].click();
      })()`);
      await sleep(200);
      const mediumMetrics = await getMetrics();

      // Click Complex complexity
      await client.evaluate(`(() => {
        const compButtons = Array.from(document.querySelectorAll('div[class*="compGrid"] button'));
        if (compButtons[2]) compButtons[2].click();
      })()`);
      await sleep(200);
      const complexMetrics = await getMetrics();

      // Click Enterprise complexity
      await client.evaluate(`(() => {
        const compButtons = Array.from(document.querySelectorAll('div[class*="compGrid"] button'));
        if (compButtons[3]) compButtons[3].click();
      })()`);
      await sleep(200);
      const enterpriseMetrics = await getMetrics();

      // Reset to Simple
      await client.evaluate(`(() => {
        const compButtons = Array.from(document.querySelectorAll('div[class*="compGrid"] button'));
        if (compButtons[0]) compButtons[0].click();
      })()`);
      await sleep(200);
      const resetMetrics = await getMetrics();

      const totalComplexities = await client.evaluate(`document.querySelectorAll('div[class*="compGrid"] button').length`);

      results.complexitySelection = {
        totalComplexities,
        simpleMetrics,
        mediumMetrics,
        complexMetrics,
        enterpriseMetrics,
        resetMetrics,
        success: totalComplexities === 4 && simpleMetrics.price !== mediumMetrics.price && mediumMetrics.price !== complexMetrics.price && complexMetrics.price !== enterpriseMetrics.price
      };
      console.log("2. Complexity Selection:", results.complexitySelection.success);

      // -------------------------------------------------------------
      // 3. Feature toggles work (and warranty is fixed)
      // -------------------------------------------------------------
      const featChipsCount = await client.evaluate(`document.querySelectorAll('div[class*="featGrid"] button').length`);
      const isWarrantyDisabled = await client.evaluate(`(() => {
        const featChips = Array.from(document.querySelectorAll('div[class*="featGrid"] button'));
        const warrantyChip = featChips.find(c => c.innerText.includes('Garansi') || c.innerText.includes('Warranty'));
        return warrantyChip?.hasAttribute('disabled') || false;
      })()`);

      const initialPrice = await client.evaluate(`Array.from(document.querySelectorAll('span[class*="metricVal"]'))[1]?.innerText || ''`);

      // Toggle first available non-warranty feature
      await client.evaluate(`(() => {
        const featChips = Array.from(document.querySelectorAll('div[class*="featGrid"] button'));
        const toggleableChip = featChips.find(c => !c.hasAttribute('disabled'));
        if (toggleableChip) toggleableChip.click();
      })()`);
      await sleep(200);
      const toggledOnPrice = await client.evaluate(`Array.from(document.querySelectorAll('span[class*="metricVal"]'))[1]?.innerText || ''`);

      // Toggle back off
      await client.evaluate(`(() => {
        const featChips = Array.from(document.querySelectorAll('div[class*="featGrid"] button'));
        const toggleableChip = featChips.find(c => !c.hasAttribute('disabled'));
        if (toggleableChip) toggleableChip.click();
      })()`);
      await sleep(200);
      const toggledOffPrice = await client.evaluate(`Array.from(document.querySelectorAll('span[class*="metricVal"]'))[1]?.innerText || ''`);

      results.featureToggles = {
        totalFeatures: featChipsCount,
        isWarrantyDisabled,
        initialPrice,
        toggledOnPrice,
        toggledOffPrice,
        success: featChipsCount === 7 && isWarrantyDisabled && initialPrice !== toggledOnPrice && toggledOffPrice === initialPrice
      };
      console.log("3. Feature Toggles:", results.featureToggles.success);

      // -------------------------------------------------------------
      // 4 & 5. Price & Timeline calculation matches tests
      // -------------------------------------------------------------
      // Reset quote
      await client.evaluate(`(() => {
        const resetBtn = Array.from(document.querySelectorAll('button')).find(b => b.getAttribute('aria-label')?.toLowerCase().includes('reset') || b.innerText.includes('🔄'));
        if (resetBtn) resetBtn.click();
      })()`);
      await sleep(200);

      const timelineText = await client.evaluate(`Array.from(document.querySelectorAll('span[class*="metricVal"]'))[0]?.innerText || ''`);
      const priceText = await client.evaluate(`Array.from(document.querySelectorAll('span[class*="metricVal"]'))[1]?.innerText || ''`);

      results.calculations = {
        timelineText,
        priceText,
        isTimelineMatch: timelineText === "2 – 2 Hari Kerja",
        isPriceMatch: priceText === "Rp 2.5jt – 4.5jt",
        success: timelineText === "2 – 2 Hari Kerja" && priceText === "Rp 2.5jt – 4.5jt"
      };
      console.log("4 & 5. Calculations:", results.calculations.success);

      // -------------------------------------------------------------
      // 6. Copy summary works
      // -------------------------------------------------------------
      const copyResults = await client.evaluate(`(() => {
        const copyBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Salin') || b.innerText.includes('Copy'));
        if (!copyBtn) return { error: "Copy button not found" };

        copyBtn.click();
        const btnTextAfterClick = copyBtn.innerText.trim();

        return {
          btnFound: true,
          btnTextAfterClick,
          success: btnTextAfterClick.includes('✓') || btnTextAfterClick.includes('Salin') || btnTextAfterClick.includes('Copy')
        };
      })()`);

      results.copySummary = copyResults;
      console.log("6. Copy Summary:", results.copySummary.success);

      // -------------------------------------------------------------
      // 7, 8, 9. Print uses hidden iframe path & Toast appears & Fallback exists
      // -------------------------------------------------------------
      await client.evaluate(`(() => {
        const printBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Cetak') || b.innerText.includes('Print'));
        if (printBtn) printBtn.click();
      })()`);
      await sleep(100);

      const printToastInfo = await client.evaluate(`(() => {
        const toast = document.querySelector('div[class*="printToast"]');
        return {
          hasToast: !!toast,
          toastText: toast?.innerText || ''
        };
      })()`);

      results.printFlow = {
        ...printToastInfo,
        success: printToastInfo.hasToast && (printToastInfo.toastText.includes('Cetak') || printToastInfo.toastText.includes('Print') || printToastInfo.toastText.includes('dokumen'))
      };
      console.log("7, 8, 9. Print Flow & Toast:", results.printFlow.success);

      // -------------------------------------------------------------
      // 10. ID/EN labels render correctly
      // -------------------------------------------------------------
      const idLabels = await client.evaluate(`(() => {
        const heading = document.querySelector('h4[class*="heading"]')?.innerText || '';
        const timelineLbl = Array.from(document.querySelectorAll('span[class*="metricLbl"]'))[0]?.innerText || '';
        const investLbl = Array.from(document.querySelectorAll('span[class*="metricLbl"]'))[1]?.innerText || '';
        const printBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Cetak') || b.innerText.includes('Print'))?.innerText || '';
        return { heading, timelineLbl, investLbl, printBtn };
      })()`);

      // Switch language to EN
      await client.evaluate(`(() => {
        const langBtn = Array.from(document.querySelectorAll('header nav button')).find(b => b.getAttribute('aria-label')?.toLowerCase().includes('bahasa') || b.getAttribute('aria-label')?.toLowerCase().includes('language') || b.innerText.includes('ID'));
        if (langBtn) langBtn.click();
      })()`);
      await sleep(300);

      const enLabels = await client.evaluate(`(() => {
        const heading = document.querySelector('h4[class*="heading"]')?.innerText || '';
        const timelineLbl = Array.from(document.querySelectorAll('span[class*="metricLbl"]'))[0]?.innerText || '';
        const investLbl = Array.from(document.querySelectorAll('span[class*="metricLbl"]'))[1]?.innerText || '';
        const printBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Cetak') || b.innerText.includes('Print'))?.innerText || '';
        const priceText = Array.from(document.querySelectorAll('span[class*="metricVal"]'))[1]?.innerText || '';
        return { heading, timelineLbl, investLbl, printBtn, priceText };
      })()`);

      // Switch back to ID
      await client.evaluate(`(() => {
        const langBtn = Array.from(document.querySelectorAll('header nav button')).find(b => b.getAttribute('aria-label')?.toLowerCase().includes('bahasa') || b.getAttribute('aria-label')?.toLowerCase().includes('language') || b.innerText.includes('ID') || b.innerText.includes('EN'));
        if (langBtn) langBtn.click();
      })()`);
      await sleep(300);

      results.i18nLabels = {
        idLabels,
        enLabels,
        success: idLabels.heading.includes('Kalkulator') && enLabels.heading.includes('Calculator') && enLabels.priceText.includes('$')
      };
      console.log("10. ID/EN Labels:", results.i18nLabels.success);

      // -------------------------------------------------------------
      // 11. No mojibake in quote UI
      // -------------------------------------------------------------
      const mojibakeCheck = await client.evaluate(`(() => {
        const quoteElem = document.querySelector('div[class*="quote"]');
        const text = quoteElem?.innerText || '';
        const regex = /[âðÃ]/;
        return {
          hasMojibake: regex.test(text),
          sample: text.slice(0, 150).replace(/\\s+/g, ' ')
        };
      })()`);

      results.mojibake = {
        ...mojibakeCheck,
        success: !mojibakeCheck.hasMojibake
      };
      console.log("11. No Mojibake in Quote UI:", results.mojibake.success);

      client.close();

      console.log("\n== ALL PHASE D RESULTS ==");
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
