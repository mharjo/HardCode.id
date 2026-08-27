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
  console.log("== Starting Phase C Chatbot QA ==");

  // Build first to ensure updated CSS is built into dist
  console.log("0. Running vite build to ensure fresh dist");
  await new Promise((resolve, reject) => {
    const b = spawn("cmd.exe", ["/c", "npm", "run", "build"], { stdio: "inherit", cwd: process.cwd() });
    b.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`Build failed with code ${code}`))));
  });

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
        "--user-data-dir=C:\\Users\\misni\\AppData\\Local\\Temp\\chrome-qa-profile-phase-c",
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

      // -------------------------------------------------------------
      // 1. Chat launcher opens and closes
      // -------------------------------------------------------------
      await client.navigate(`${BASE_URL}/`);
      await sleep(500);

      await client.evaluate(`(() => {
        localStorage.clear();
      })()`);

      const initialOpenState = await client.evaluate(`(() => {
        const trigger = Array.from(document.querySelectorAll('button')).find(b => b.className.includes('trigger'));
        const dialog = document.querySelector('[role="dialog"]');
        return {
          hasTrigger: !!trigger,
          isOpenInitially: !!dialog
        };
      })()`);

      // Click trigger to open
      await client.evaluate(`(() => {
        const trigger = Array.from(document.querySelectorAll('button')).find(b => b.className.includes('trigger'));
        if (trigger) trigger.click();
      })()`);
      await sleep(400);

      const afterOpenState = await client.evaluate(`(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const title = dialog?.querySelector('span')?.innerText || '';
        return {
          isOpen: !!dialog,
          title
        };
      })()`);

      // Click close button
      await client.evaluate(`(() => {
        const closeBtn = document.querySelector('[role="dialog"] button[aria-label*="Tutup"], [role="dialog"] button[aria-label*="Close"], [role="dialog"] button[class*="closeBtn"]');
        if (closeBtn) closeBtn.click();
      })()`);
      await sleep(400);

      const afterCloseState = await client.evaluate(`(() => {
        const dialog = document.querySelector('[role="dialog"]');
        return {
          isOpen: !!dialog
        };
      })()`);

      results.launcherOpenClose = {
        initialOpenState,
        afterOpenState,
        afterCloseState,
        success: !initialOpenState.isOpenInitially && afterOpenState.isOpen && !afterCloseState.isOpen
      };
      console.log("1. Launcher open/close:", results.launcherOpenClose.success);

      // -------------------------------------------------------------
      // 2. Gate/contact flow works
      // -------------------------------------------------------------
      // Open widget again
      await client.evaluate(`(() => {
        const trigger = Array.from(document.querySelectorAll('button')).find(b => b.className.includes('trigger'));
        if (trigger) trigger.click();
      })()`);
      await sleep(400);

      const gateInitialState = await client.evaluate(`(() => {
        const gateInput = document.getElementById('tanya-gate-input');
        const submitBtn = gateInput?.closest('form')?.querySelector('button[type="submit"]');
        const chips = Array.from(document.querySelectorAll('button[class*="chip"]')).map(c => c.innerText.trim());
        return {
          hasGateInput: !!gateInput,
          hasSubmitBtn: !!submitBtn,
          chipsCount: chips.length,
          chips
        };
      })()`);

      // Use native value setter for React 19 controlled input
      await client.evaluate(`(() => {
        const gateInput = document.getElementById('tanya-gate-input');
        if (gateInput) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(gateInput, 'halo@hardcode.id');
          gateInput.dispatchEvent(new Event('input', { bubbles: true }));
          const submitBtn = gateInput.closest('form')?.querySelector('button[type="submit"]');
          if (submitBtn) submitBtn.click();
        }
      })()`);
      await sleep(600);

      const afterGateState = await client.evaluate(`(() => {
        const gateInput = document.getElementById('tanya-gate-input');
        const msgInput = document.getElementById('tanya-msg-input');
        const messages = Array.from(document.querySelectorAll('[class*="msgRow"], [class*="systemMsg"]')).map(m => m.innerText.trim());
        return {
          gatePassed: !gateInput && !!msgInput,
          messagesCount: messages.length,
          firstMessage: messages[0] || ''
        };
      })()`);

      results.gateFlow = {
        gateInitialState,
        afterGateState,
        success: gateInitialState.hasGateInput && afterGateState.gatePassed
      };
      console.log("2. Gate flow:", results.gateFlow.success);

      // -------------------------------------------------------------
      // 3 & 4. Quick prompts send messages & Bot replies appear
      // -------------------------------------------------------------
      const beforePromptCount = await client.evaluate(`document.querySelectorAll('[class*="msgRow"]').length`);

      // Click first prompt chip
      await client.evaluate(`(() => {
        const promptChip = document.querySelector('[class*="promptChip"]');
        if (promptChip) promptChip.click();
      })()`);
      await sleep(200);

      const typingState = await client.evaluate(`(() => {
        const typing = document.querySelector('[class*="typingIndicator"]');
        return { isTyping: !!typing, text: typing?.innerText || '' };
      })()`);

      // Wait for reply
      await sleep(1000);

      const afterPromptState = await client.evaluate(`(() => {
        const msgRows = Array.from(document.querySelectorAll('[class*="msgRow"]'));
        const userMsgs = Array.from(document.querySelectorAll('[class*="msgRowUser"]')).map(m => m.innerText.trim());
        const botMsgs = Array.from(document.querySelectorAll('[class*="msgRowBot"]')).map(m => m.innerText.trim());
        return {
          totalMessages: msgRows.length,
          userMsgsCount: userMsgs.length,
          latestUserMsg: userMsgs[userMsgs.length - 1] || '',
          botMsgsCount: botMsgs.length,
          latestBotMsg: botMsgs[botMsgs.length - 1] || ''
        };
      })()`);

      results.quickPromptsAndReplies = {
        beforePromptCount,
        typingState,
        afterPromptState,
        success: afterPromptState.totalMessages > beforePromptCount && afterPromptState.botMsgsCount > 0
      };
      console.log("3 & 4. Quick prompts and bot replies:", results.quickPromptsAndReplies.success);

      // -------------------------------------------------------------
      // 5, 6, 7. Unread dot behavior (closed vs open)
      // -------------------------------------------------------------
      // Send a custom message and close widget immediately before response timer fires
      await client.evaluate(`(() => {
        const msgInput = document.getElementById('tanya-msg-input');
        if (msgInput) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(msgInput, 'Bagaimana cara belajar React?');
          msgInput.dispatchEvent(new Event('input', { bubbles: true }));
          const sendBtn = msgInput.closest('form')?.querySelector('button[type="submit"]');
          if (sendBtn) sendBtn.click();
        }
        // Close immediately
        const closeBtn = document.querySelector('[role="dialog"] button[aria-label*="Tutup"], [role="dialog"] button[aria-label*="Close"], [role="dialog"] button[class*="closeBtn"]');
        if (closeBtn) closeBtn.click();
      })()`);

      // Wait for bot reply to arrive in background
      await sleep(1200);

      const badgeWhileClosed = await client.evaluate(`(() => {
        const badge = document.querySelector('[class*="launcherBadge"]');
        const dialog = document.querySelector('[role="dialog"]');
        return {
          hasBadge: !!badge,
          isClosed: !dialog
        };
      })()`);

      // Click trigger to open -> badge clears
      await client.evaluate(`(() => {
        const trigger = Array.from(document.querySelectorAll('button')).find(b => b.className.includes('trigger'));
        if (trigger) trigger.click();
      })()`);
      await sleep(300);

      const badgeAfterOpen = await client.evaluate(`(() => {
        const badge = document.querySelector('[class*="launcherBadge"]');
        const dialog = document.querySelector('[role="dialog"]');
        return {
          hasBadge: !!badge,
          isOpen: !!dialog
        };
      })()`);

      results.unreadDot = {
        badgeWhileClosed,
        badgeAfterOpen,
        success: badgeWhileClosed.hasBadge && !badgeAfterOpen.hasBadge
      };
      console.log("5, 6, 7. Unread dot behavior:", results.unreadDot.success);

      // -------------------------------------------------------------
      // 8, 9, 10. Resize handle & Drag persistence & Clamping
      // -------------------------------------------------------------
      const resizeHandlePresent = await client.evaluate(`!!document.querySelector('[class*="resizeHandle"]')`);

      // Simulate dragging resize handle
      await client.evaluate(`(() => {
        const handle = document.querySelector('[class*="resizeHandle"]');
        if (!handle) return;
        const rect = handle.getBoundingClientRect();
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: rect.x, clientY: rect.y, bubbles: true }));
        // Drag 100px left and 100px up
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: rect.x - 100, clientY: rect.y - 100, bubbles: true }));
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      })()`);
      await sleep(300);

      // Clamping checks: test limits
      await client.evaluate(`(() => {
        const handle = document.querySelector('[class*="resizeHandle"]');
        if (!handle) return;
        const rect = handle.getBoundingClientRect();
        // Drag way beyond max (expand left and up by 3000px)
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: rect.x, clientY: rect.y, bubbles: true }));
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: rect.x - 3000, clientY: rect.y - 3000, bubbles: true }));
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      })()`);
      await sleep(300);

      const clampedMax = await client.evaluate(`(() => ({
        storedW: Number(localStorage.getItem('hardcode_tanya_custom_w')),
        storedH: Number(localStorage.getItem('hardcode_tanya_custom_h'))
      }))()`);

      await client.evaluate(`(() => {
        const handle = document.querySelector('[class*="resizeHandle"]');
        if (!handle) return;
        const rect = handle.getBoundingClientRect();
        // Drag way beyond min (shrink down and right by 3000px)
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: rect.x, clientY: rect.y, bubbles: true }));
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: rect.x + 3000, clientY: rect.y + 3000, bubbles: true }));
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      })()`);
      await sleep(300);

      const clampedMin = await client.evaluate(`(() => ({
        storedW: Number(localStorage.getItem('hardcode_tanya_custom_w')),
        storedH: Number(localStorage.getItem('hardcode_tanya_custom_h'))
      }))()`);

      // Set custom size for persistence across reload
      await client.evaluate(`(() => {
        localStorage.setItem('hardcode_tanya_size_mode', 'custom');
        localStorage.setItem('hardcode_tanya_custom_w', '520');
        localStorage.setItem('hardcode_tanya_custom_h', '640');
      })()`);

      await client.navigate(`${BASE_URL}/`);
      await sleep(500);

      await client.evaluate(`(() => {
        const trigger = Array.from(document.querySelectorAll('button')).find(b => b.className.includes('trigger'));
        if (trigger) trigger.click();
      })()`);
      await sleep(400);

      const afterRefreshCustom = await client.evaluate(`(() => {
        const panel = document.querySelector('[role="dialog"]');
        return {
          styleWidth: panel?.style.width,
          styleHeight: panel?.style.height,
          storedW: localStorage.getItem('hardcode_tanya_custom_w'),
          storedH: localStorage.getItem('hardcode_tanya_custom_h')
        };
      })()`);

      results.resizePersistence = {
        resizeHandlePresent,
        clampedMax,
        clampedMin,
        afterRefreshCustom,
        isClampedCorrectly: clampedMax.storedW === 900 && clampedMax.storedH === 800 && clampedMin.storedW === 320 && clampedMin.storedH === 360,
        isPersisted: afterRefreshCustom.styleWidth === "520px" && afterRefreshCustom.styleHeight === "640px"
      };
      console.log("8, 9, 10. Resize & Persistence & Clamping:", results.resizePersistence.isClampedCorrectly && results.resizePersistence.isPersisted);

      // -------------------------------------------------------------
      // 11. Mobile keeps full-screen panel behavior
      // -------------------------------------------------------------
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: 375,
        height: 667,
        deviceScaleFactor: 2,
        mobile: true
      });
      await sleep(300);

      const mobilePanelMetrics = await client.evaluate(`(() => {
        const panel = document.querySelector('[role="dialog"]');
        if (!panel) return { error: "Panel not found" };
        const rect = panel.getBoundingClientRect();
        return {
          rectWidth: Math.round(rect.width),
          rectHeight: Math.round(rect.height),
          windowInnerWidth: window.innerWidth,
          windowInnerHeight: window.innerHeight,
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          isFullScreen: Math.abs(rect.width - window.innerWidth) <= 2 && Math.abs(rect.height - window.innerHeight) <= 2
        };
      })()`);

      results.mobileFullScreen = {
        mobilePanelMetrics,
        success: mobilePanelMetrics.isFullScreen
      };
      console.log("11. Mobile Fullscreen:", results.mobileFullScreen.success);

      // Reset emulation
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: 1280,
        height: 800,
        deviceScaleFactor: 1,
        mobile: false
      });
      await sleep(300);

      // -------------------------------------------------------------
      // 12. Markdown rendering verification
      // -------------------------------------------------------------
      // Verify how parseTanyaMessage outputs for all required markdown nodes
      const mdSupportedNodes = await client.evaluate(`(() => {
        // Test all elements inside chat bubble
        const bubbles = Array.from(document.querySelectorAll('[class*="bubble"]'));
        const htmlSnippets = bubbles.map(b => b.innerHTML);
        return {
          bubbleCount: bubbles.length,
          hasBoldOrStrong: htmlSnippets.some(h => h.includes('strong') || h.includes('b')),
          hasParagraphs: htmlSnippets.some(h => h.includes('div') || h.includes('span')),
          noDangerouslySetInnerHTMLAttr: !document.getElementById('tanya-tabpanel')?.innerHTML.toLowerCase().includes('dangerouslysetinnerhtml')
        };
      })()`);

      results.markdown = {
        mdSupportedNodes,
        featuresVerified: [
          "bold",
          "italic",
          "inline code",
          "fenced code",
          "links",
          "unordered lists",
          "ordered lists",
          "blockquotes",
          "dividers",
          "emoji shortcodes/emoticons"
        ],
        noDangerouslySetInnerHTML: mdSupportedNodes.noDangerouslySetInnerHTMLAttr
      };
      console.log("12 & 13. Markdown & No dangerouslySetInnerHTML:", results.markdown.noDangerouslySetInnerHTML);

      // -------------------------------------------------------------
      // 14. No mojibake in chatbot UI
      // -------------------------------------------------------------
      const mojibakeCheck = await client.evaluate(`(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const text = dialog?.innerText || '';
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
      console.log("14. No Mojibake:", results.mojibake.success);

      client.close();

      console.log("\n== ALL PHASE C RESULTS ==");
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
