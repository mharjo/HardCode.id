import { useEffect, useRef } from "react";
import { useI18n } from "../../i18n/I18nContext";
import { ChatConversation } from "./ChatConversation";
import { ChatProvider, useChat, type ChatSize } from "./ChatContext";
import { ChatGate } from "./ChatGate";
import { QuoteEstimator } from "./QuoteEstimator";
import styles from "./ChatWidget.module.css";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ChatWidgetInner() {
  const { t } = useI18n();
  const { isOpen, mode, size, gatePassed, toggleWidget, closeWidget, switchMode, setSize, isQuoteVisited } = useChat();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggleSize = (target: ChatSize) => {
    setSize((current) => (current === target ? "normal" : target));
  };

  useEffect(() => {
    if (isOpen) {
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (firstFocusable ?? panelRef.current)?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeWidget();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeWidget]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerActive : ""}`}
        onClick={toggleWidget}
        aria-label={isOpen ? t("bot_close_aria") : t("bot_btn_aria")}
        title={t("bot_btn_aria")}
      >
        <span className={styles.triggerIcon} aria-hidden="true">
          {isOpen ? "×" : "{ }"}
        </span>
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          tabIndex={-1}
          className={`${styles.panel} ${size === "wide" ? styles.panelWide : ""} ${size === "fullpage" ? styles.panelFullpage : ""}`}
          role="dialog"
          aria-label={t("bot_dialog_aria")}
        >
          <div className={styles.header}>
            <div className={styles.titleRow}>
              <span className={styles.title}>
                <span className={styles.brace}>{"{"}</span>tanya<span className={styles.brace}>{"}"}</span>
                <span className={styles.badge}>assistant</span>
              </span>

              <div className={styles.headerActions}>
                <button
                  type="button"
                  className={styles.headerBtn}
                  onClick={() => toggleSize("wide")}
                  aria-label={t("bot_btn_expand")}
                  title={t("bot_btn_expand")}
                >
                  ⤢
                </button>
                <button
                  type="button"
                  className={styles.headerBtn}
                  onClick={() => toggleSize("fullpage")}
                  aria-label={t("bot_btn_fullpage")}
                  title={t("bot_btn_fullpage")}
                >
                  ⛶
                </button>
                <button type="button" className={styles.closeBtn} onClick={closeWidget} aria-label={t("bot_close_aria")} title={t("bot_close_aria")}>
                  &times;
                </button>
              </div>
            </div>

            <div className={styles.tabs} role="tablist" aria-label={t("bot_dialog_aria")}>
              <button
                type="button"
                role="tab"
                id="tanya-tab-chat"
                aria-selected={mode === "chat"}
                aria-controls="tanya-tabpanel"
                className={`${styles.tab} ${mode === "chat" ? styles.tabActive : ""}`}
                onClick={() => switchMode("chat")}
              >
                {t("bot_tab_chat")}
              </button>
              <button
                type="button"
                role="tab"
                id="tanya-tab-quote"
                aria-selected={mode === "quote"}
                aria-controls="tanya-tabpanel"
                className={`${styles.tab} ${mode === "quote" ? styles.tabActive : ""}`}
                onClick={() => switchMode("quote")}
              >
                {t("bot_tab_quote")}
                {isQuoteVisited && <span className={styles.tabDot} aria-hidden="true" />}
              </button>
            </div>
          </div>

          <div className={styles.content} id="tanya-tabpanel" role="tabpanel">
            {mode === "chat" ? gatePassed ? <ChatConversation /> : <ChatGate /> : <QuoteEstimator />}
          </div>
        </div>
      )}
    </>
  );
}

export function ChatWidget() {
  return (
    <ChatProvider>
      <ChatWidgetInner />
    </ChatProvider>
  );
}
