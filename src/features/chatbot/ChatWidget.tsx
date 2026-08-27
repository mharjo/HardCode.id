import { useEffect, useRef } from "react";
import { useI18n } from "../../i18n/I18nContext";
import { ChatConversation } from "./ChatConversation";
import { ChatProvider, useChat, type ChatSize, type ChatSizeMode } from "./ChatContext";
import { ChatGate } from "./ChatGate";
import { QuoteEstimator } from "./QuoteEstimator";
import styles from "./ChatWidget.module.css";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const SIZE_CLASSES: Record<ChatSizeMode, string> = {
  default: "",
  large: styles.panelLarge ?? "",
  compact: styles.panelCompact ?? "",
  custom: styles.panelCustom ?? "",
};

function ChatWidgetInner() {
  const { t } = useI18n();
  const { isOpen, mode, size, sizeMode, customW, customH, gatePassed, toggleWidget, closeWidget, switchMode, setSize, isQuoteVisited, hasUnread, setCustomW, setCustomH, setSizeMode } = useChat();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggleSize = (target: ChatSize) => {
    setSize((current) => (current === target ? "normal" : target));
  };

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = sizeMode === "custom" ? customW : panelRef.current?.offsetWidth || 420;
    const startH = sizeMode === "custom" ? customH : panelRef.current?.offsetHeight || 500;

    setSizeMode("custom");

    const onMouseMove = (moveEvent: MouseEvent) => {
      // Bottom right handle drag: increasing clientX (moving right) makes it expand left?
      // If we subtract moveEvent from start, dragging left increases width.
      // But bottom-right handle usually means dragging right increases width.
      // Let's implement standard drag right = increase width.
      // Note: for a right-aligned element this might behave weirdly unless we reposition it, but we stick to standard width change.
      // Actually since it's pinned to the right, to increase its size user has to drag left.
      // So deltaX = startX - moveEvent.clientX; dragging left increases width.
      const deltaX = startX - moveEvent.clientX;
      // deltaY = startY - moveEvent.clientY; dragging up increases height.
      const deltaY = startY - moveEvent.clientY;

      setCustomW(Math.min(Math.max(startW + deltaX, 320), 900));
      setCustomH(Math.min(Math.max(startH + deltaY, 360), 800));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
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
        {hasUnread && !isOpen && <span className={styles.launcherBadge} aria-hidden="true" />}
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          tabIndex={-1}
          className={`${styles.panel} ${SIZE_CLASSES[sizeMode]} ${size === "wide" ? styles.panelWide : ""} ${size === "fullpage" ? styles.panelFullpage : ""}`}
          style={sizeMode === "custom" && size !== "fullpage" ? { width: customW, height: customH } : undefined}
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
          {size !== "fullpage" && (
            <div
              className={styles.resizeHandle}
              onMouseDown={startResize}
              aria-hidden="true"
            />
          )}
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
