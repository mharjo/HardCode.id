import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";
import type { BotAction, BotActionType } from "./chatResponses";
import { parseMarkdownLiteLine } from "./chatResponses";
import { useChat, type ChatMessage } from "./ChatContext";
import { calculateQuote } from "./quoteConfig";
import styles from "./ChatConversation.module.css";

const QUICK_PROMPTS: { promptKey: "bot_prompt1" | "bot_prompt2" | "bot_prompt3" | "bot_prompt4" | "bot_prompt5"; questionKey: "bot_prompt_q1" | "bot_prompt_q2" | "bot_prompt_q3" | "bot_prompt_q4" | "bot_prompt_q5"; id: "q1" | "q2" | "q3" | "q4" | "q5" }[] = [
  { promptKey: "bot_prompt1", questionKey: "bot_prompt_q1", id: "q1" },
  { promptKey: "bot_prompt2", questionKey: "bot_prompt_q2", id: "q2" },
  { promptKey: "bot_prompt5", questionKey: "bot_prompt_q5", id: "q5" },
  { promptKey: "bot_prompt3", questionKey: "bot_prompt_q3", id: "q3" },
  { promptKey: "bot_prompt4", questionKey: "bot_prompt_q4", id: "q4" },
];

function renderMessageText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => (
    <span key={lineIdx} className={styles.line}>
      {parseMarkdownLiteLine(line).map((seg, segIdx) => {
        if (seg.type === "bold") return <strong key={segIdx}>{seg.value}</strong>;
        if (seg.type === "code") return <code key={segIdx}>{seg.value}</code>;
        return <span key={segIdx}>{seg.value}</span>;
      })}
    </span>
  ));
}

function actionLabelKey(type: BotActionType): "bot_action_open_quote" | "bot_action_consult" | "bot_action_projects" | "bot_action_learning" {
  if (type === "open-quote") return "bot_action_open_quote";
  if (type === "consult") return "bot_action_consult";
  if (type === "projects") return "bot_action_projects";
  return "bot_action_learning";
}

function MessageActions({ actions }: { actions: BotAction[] }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { switchMode, closeWidget } = useChat();

  const handleAction = (type: BotActionType) => {
    if (type === "open-quote") {
      switchMode("quote");
      return;
    }
    if (type === "consult") {
      closeWidget();
      navigate("/konsultasi");
      return;
    }
    if (type === "projects") {
      closeWidget();
      navigate("/proyek");
      return;
    }
    closeWidget();
    navigate("/belajar");
  };

  return (
    <div className={styles.messageActions}>
      {actions.map((action) => (
        <button key={action.type} type="button" className={styles.actionBtn} onClick={() => handleAction(action.type)}>
          {t(actionLabelKey(action.type))}
        </button>
      ))}
    </div>
  );
}

function MessageRow({ message }: { message: ChatMessage }) {
  if (message.role === "system") {
    return <div className={styles.systemMsg}>{message.text}</div>;
  }

  const isBot = message.role === "bot";
  return (
    <div className={`${styles.msgRow} ${isBot ? styles.msgRowBot : styles.msgRowUser}`}>
      <div className={`${styles.bubble} ${isBot ? styles.bubbleBot : styles.bubbleUser}`}>{renderMessageText(message.text)}</div>
      {isBot && message.actions && message.actions.length > 0 && <MessageActions actions={message.actions} />}
      <span className={styles.msgTime}>{message.time}</span>
    </div>
  );
}

function QuotaBar() {
  const { t } = useI18n();
  const { quota, quotaTotal } = useChat();

  let statusClass = "";
  if (quota === 0) statusClass = styles.quotaDepleted ?? "";
  else if (quota === 1) statusClass = styles.quotaDanger ?? "";
  else if (quota <= 3) statusClass = styles.quotaWarning ?? "";

  const quotaText =
    quota === 0
      ? t("bot_quota_depleted_txt")
      : quota === 1
        ? t("bot_quota_last_txt")
        : t("bot_quota_left_txt").replace("{rem}", String(quota)).replace("{tot}", String(quotaTotal));

  return (
    <div className={styles.quotaBar}>
      <div className={styles.quotaInfo}>
        <span className={`${styles.quotaDot} ${statusClass}`} aria-hidden="true" />
        <span>{quotaText}</span>
      </div>
      <div
        className={styles.quotaProgress}
        role="progressbar"
        aria-label={t("bot_quota_aria")}
        aria-valuenow={quota}
        aria-valuemin={0}
        aria-valuemax={quotaTotal}
      >
        <div className={styles.segments}>
          {Array.from({ length: quotaTotal }).map((_, i) => (
            <span key={i} className={`${styles.segment} ${i < quota ? `${styles.segmentActive} ${statusClass}` : ""}`} />
          ))}
        </div>
        <span className={`${styles.quotaPill} ${statusClass}`}>
          {quota}/{quotaTotal}
        </span>
      </div>
    </div>
  );
}

export function ChatConversation() {
  const { t, locale } = useI18n();
  const { messages, quota, isReplying, sendMessage, sendQuickPrompt, isQuoteVisited, quoteBannerDismissed, dismissQuoteBanner, switchMode, quote } =
    useChat();
  const [inputValue, setInputValue] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isReplying]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const calc = calculateQuote(quote, locale);
  const showBanner = isQuoteVisited && !quoteBannerDismissed;

  return (
    <div className={styles.chat}>
      {showBanner && (
        <div className={styles.quoteBanner}>
          <div className={styles.quoteBannerLeft}>
            <span className={styles.quoteBannerTag}>{t("quote_active_badge")}</span>
            <span className={styles.quoteBannerTitle}>
              {calc.cat.icon} {locale === "en" ? calc.cat.nameEn : calc.cat.nameId} · {calc.priceText}
            </span>
          </div>
          <div className={styles.quoteBannerActions}>
            <button type="button" className={styles.quoteBannerBtn} onClick={() => switchMode("quote")}>
              {t("quote_banner_view")}
            </button>
            <button type="button" className={styles.closeBtn} onClick={dismissQuoteBanner} aria-label={t("quote_banner_dismiss_aria")}>
              &times;
            </button>
          </div>
        </div>
      )}

      <div className={styles.messages} id="tanya-messages" aria-live="polite" ref={messagesRef}>
        {messages.map((message) => (
          <MessageRow key={message.id} message={message} />
        ))}
        {isReplying && (
          <div className={styles.typingIndicator}>
            <span>{t("bot_typing_text")}</span>
          </div>
        )}
      </div>

      <div className={styles.quickPrompts} role="group" aria-label={t("bot_gate_quick_title")}>
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt.id}
            type="button"
            className={styles.promptChip}
            onClick={() => sendQuickPrompt(prompt.id, t(prompt.questionKey))}
            disabled={isReplying || quota <= 0}
          >
            {t(prompt.promptKey)}
          </button>
        ))}
      </div>

      <QuotaBar />

      <form className={styles.inputRow} onSubmit={handleSubmit}>
        <label htmlFor="tanya-msg-input" className={styles.visuallyHidden}>
          {t("bot_input_label")}
        </label>
        <input
          type="text"
          id="tanya-msg-input"
          className={styles.input}
          placeholder={quota <= 0 ? t("bot_quota_depleted_ph") : t("bot_input_ph")}
          autoComplete="off"
          disabled={quota <= 0 || isReplying}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button type="submit" className={styles.sendBtn} disabled={quota <= 0 || isReplying} aria-label={t("bot_send_btn_aria")}>
          {t("bot_send_btn")}
        </button>
      </form>
    </div>
  );
}
