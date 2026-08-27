import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";
import { getBotResponse, type QuickPromptId } from "./chatResponses";
import {
  DEFAULT_QUOTE_STATE,
  generateQuoteSummaryText,
  toggleQuoteFeature as toggleQuoteFeatureId,
  type QuoteComplexityId,
  type QuoteFeatureId,
  type QuoteCategoryId,
  type QuoteState,
} from "./quoteConfig";

export type ChatMode = "chat" | "quote";
export type ChatSize = "normal" | "wide" | "fullpage";
export type ChatSizeMode = "default" | "large" | "compact" | "custom";
export type MessageRole = "bot" | "user" | "system";

const CHAT_SIZE_MODES = ["default", "large", "compact", "custom"] as const satisfies readonly ChatSizeMode[];
const CUSTOM_WIDTH_MIN = 320;
const CUSTOM_WIDTH_MAX = 900;
const CUSTOM_HEIGHT_MIN = 360;
const CUSTOM_HEIGHT_MAX = 800;

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  time: string;
  actions?: import("./chatResponses").BotAction[];
}

const QUOTA_TOTAL = 5;
const TOPIC_CHIPS: { topic: string; labelKey: "bot_gate_chip1" | "bot_gate_chip2" | "bot_gate_chip3" | "bot_gate_chip_quote" }[] = [
  { topic: "Konsultasi 1-on-1", labelKey: "bot_gate_chip1" },
  { topic: "Belajar Coding & AI", labelKey: "bot_gate_chip2" },
  { topic: "Bikin Project MVP", labelKey: "bot_gate_chip3" },
  { topic: "Estimasi Project / Quote", labelKey: "bot_gate_chip_quote" },
];

function nowTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function parseStoredNumber(value: string | null, fallback: number, min: number, max: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? clampNumber(parsed, min, max) : fallback;
}

function parseStoredSizeMode(value: string | null): ChatSizeMode {
  return CHAT_SIZE_MODES.includes(value as ChatSizeMode) ? (value as ChatSizeMode) : "default";
}

interface ChatContextValue {
  isOpen: boolean;
  mode: ChatMode;
  size: ChatSize;
  sizeMode: ChatSizeMode;
  customW: number;
  customH: number;
  gatePassed: boolean;
  contact: string;
  selectedTopic: string;
  messages: ChatMessage[];
  quota: number;
  quotaTotal: number;
  isReplying: boolean;
  isQuoteVisited: boolean;
  quoteBannerDismissed: boolean;
  quote: QuoteState;
  hasUnread: boolean;

  openWidget: () => void;
  closeWidget: () => void;
  toggleWidget: () => void;
  switchMode: (mode: ChatMode) => void;
  setSize: Dispatch<SetStateAction<ChatSize>>;
  setCustomW: Dispatch<SetStateAction<number>>;
  setCustomH: Dispatch<SetStateAction<number>>;
  setSizeMode: Dispatch<SetStateAction<ChatSizeMode>>;
  setSelectedTopic: (topic: string) => void;
  submitGate: (contact: string) => void;
  sendMessage: (text: string) => void;
  sendQuickPrompt: (id: QuickPromptId, text: string) => void;
  dismissQuoteBanner: () => void;

  setQuoteCategory: (category: QuoteCategoryId) => void;
  setQuoteComplexity: (complexity: QuoteComplexityId) => void;
  toggleQuoteFeature: (feature: QuoteFeatureId) => void;
  resetQuote: () => void;
  applyQuoteToConsultation: () => void;
  sendQuoteToChat: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { t, locale } = useI18n();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [mode, setMode] = useState<ChatMode>("chat");
  const [size, setSize] = useState<ChatSize>("normal");
  const [gatePassed, setGatePassed] = useState(false);
  const [contact, setContact] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quota, setQuota] = useState(QUOTA_TOTAL);
  const [isReplying, setIsReplying] = useState(false);
  const [isQuoteVisited, setIsQuoteVisited] = useState(false);
  const [quoteBannerDismissed, setQuoteBannerDismissed] = useState(false);
  const [quote, setQuote] = useState<QuoteState>(DEFAULT_QUOTE_STATE);
  const [sizeMode, setSizeMode] = useState<ChatSizeMode>(() => {
    try {
      return parseStoredSizeMode(localStorage.getItem("hardcode_tanya_size_mode"));
    } catch {
      return "default";
    }
  });
  const [customW, setCustomW] = useState(() => {
    try {
      return parseStoredNumber(localStorage.getItem("hardcode_tanya_custom_w"), 420, CUSTOM_WIDTH_MIN, CUSTOM_WIDTH_MAX);
    } catch {
      return 420;
    }
  });
  const [customH, setCustomH] = useState(() => {
    try {
      return parseStoredNumber(localStorage.getItem("hardcode_tanya_custom_h"), 500, CUSTOM_HEIGHT_MIN, CUSTOM_HEIGHT_MAX);
    } catch {
      return 500;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("hardcode_tanya_size_mode", sizeMode);
      localStorage.setItem("hardcode_tanya_custom_w", String(customW));
      localStorage.setItem("hardcode_tanya_custom_h", String(customH));
    } catch {
      // localStorage can be unavailable in restricted browser contexts.
    }
  }, [customH, customW, sizeMode]);

  const openWidget = useCallback(() => {
    setIsOpen(true);
    setHasUnread(false);
  }, []);

  const closeWidget = useCallback(() => setIsOpen(false), []);

  const toggleWidget = useCallback(() => {
    setIsOpen((open) => {
      if (!open) setHasUnread(false);
      return !open;
    });
  }, []);

  const switchMode = useCallback((next: ChatMode) => {
    setMode(next);
    if (next === "quote") setIsQuoteVisited(true);
  }, []);

  const appendMessage = useCallback((role: MessageRole, text: string, actions?: import("./chatResponses").BotAction[]) => {
    setMessages((current) => [...current, { id: makeId(), role, text, time: nowTime(), ...(actions ? { actions } : {}) }]);
    if (role === "bot") {
      setIsOpen((open) => {
        if (!open) setHasUnread(true);
        return open;
      });
    }
  }, []);

  const replyTo = useCallback(
    (userText: string, quickPromptId?: QuickPromptId) => {
      setIsReplying(true);
      window.setTimeout(() => {
        const response = getBotResponse(userText, locale, quote, quickPromptId);
        if (response.matchedCategory) {
          setQuote((current) => ({ ...current, category: response.matchedCategory! }));
        }
        appendMessage("bot", response.text, response.actions);
        setIsReplying(false);
      }, 650);
    },
    [appendMessage, locale, quote],
  );

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isReplying) return;

      if (quota <= 0) {
        appendMessage("bot", t("bot_quota_alert_exhausted"));
        return;
      }

      appendMessage("user", trimmed);
      setQuota((q) => Math.max(0, q - 1));
      replyTo(trimmed);
    },
    [appendMessage, isReplying, quota, replyTo, t],
  );

  const sendQuickPrompt = useCallback(
    (id: QuickPromptId, text: string) => {
      if (isReplying) return;
      if (quota <= 0) {
        appendMessage("bot", t("bot_quota_alert_exhausted"));
        return;
      }
      appendMessage("user", text);
      setQuota((q) => Math.max(0, q - 1));
      replyTo(text, id);
    },
    [appendMessage, isReplying, quota, replyTo, t],
  );

  const submitGate = useCallback(
    (contactValue: string) => {
      const trimmed = contactValue.trim();
      if (!trimmed) return;

      setContact(trimmed);
      setGatePassed(true);
      setMessages([
        { id: makeId(), role: "system", text: t("bot_sys_start"), time: nowTime() },
        {
          id: makeId(),
          role: "bot",
          text: `${t("bot_greeting_pre")}**${t("bot_greeting_b1")}**${t("bot_greeting_mid1")}**${t("bot_greeting_b2")}**${t("bot_greeting_mid2")}**${t("bot_greeting_b3")}**${t("bot_greeting_end")}`,
          time: nowTime(),
        },
      ]);

      if (selectedTopic) {
        const topicMsgMap: Record<string, { id: string; en: string }> = {
          "Konsultasi 1-on-1": {
            id: "Saya ingin bertanya tentang Konsultasi 1-on-1",
            en: "I would like to ask about the 1-on-1 Consultation",
          },
          "Belajar Coding & AI": {
            id: "Saya ingin bertanya tentang Belajar Coding & AI",
            en: "I would like to ask about Learning Coding & AI",
          },
          "Bikin Project MVP": {
            id: "Saya ingin bertanya tentang Bikin Project MVP",
            en: "I would like to ask about Building a Custom Project / MVP",
          },
          "Estimasi Project / Quote": {
            id: "Saya ingin bertanya tentang Estimasi Project / Quote",
            en: "I would like to ask about Project Estimates & Quotes",
          },
        };
        const entry = topicMsgMap[selectedTopic];
        const msg = entry ? entry[locale] : `${locale === "en" ? "I would like to ask about" : "Saya ingin bertanya tentang"} ${selectedTopic}`;
        window.setTimeout(() => sendMessage(msg), 0);
      }
    },
    [locale, selectedTopic, sendMessage, t],
  );

  const dismissQuoteBanner = useCallback(() => setQuoteBannerDismissed(true), []);

  const setQuoteCategory = useCallback((category: QuoteCategoryId) => {
    setQuote((current) => ({ ...current, category }));
  }, []);

  const setQuoteComplexity = useCallback((complexity: QuoteComplexityId) => {
    setQuote((current) => ({ ...current, complexity }));
  }, []);

  const toggleQuoteFeature = useCallback((feature: QuoteFeatureId) => {
    setQuote((current) => ({ ...current, features: toggleQuoteFeatureId(current.features, feature) }));
  }, []);

  const resetQuote = useCallback(() => setQuote(DEFAULT_QUOTE_STATE), []);

  const applyQuoteToConsultation = useCallback(() => {
    const summary = generateQuoteSummaryText(quote, locale);
    closeWidget();
    navigate("/konsultasi", { state: { prefillNotes: summary, prefillTopic: "Validasi Ide & Rencana Bikin Project" } });
  }, [closeWidget, locale, navigate, quote]);

  const sendQuoteToChat = useCallback(() => {
    if (!gatePassed) setGatePassed(true);
    switchMode("chat");

    const summary = generateQuoteSummaryText(quote, locale);
    appendMessage("user", locale === "en" ? `I generated a project estimate.\n${summary}` : `Saya membuat kalkulasi estimasi project.\n${summary}`);
    setQuota((q) => Math.max(0, q - 1));

    setIsReplying(true);
    window.setTimeout(() => {
      const intro =
        locale === "en"
          ? "Here is your calculated quote breakdown based on our transparent engineering rates. Want to discuss the technical architecture or customize further? You can book a **Free 60-Min 1-on-1 Consultation** anytime!"
          : "Berikut adalah rincian kalkulasi estimasi project kamu berdasarkan tarif rekayasa software transparan kami. Mau bedah arsitektur teknis atau diskusi fitur khusus? Yuk jadwalkan **Sesi 1-on-1 Gratis 60 Menit**!";
      appendMessage("bot", intro, [{ type: "consult" }]);
      setIsReplying(false);
    }, 550);
  }, [appendMessage, gatePassed, locale, quote, switchMode]);

  const value = useMemo<ChatContextValue>(
    () => ({
      isOpen,
      mode,
      size,
      customW,
      customH,
      sizeMode,
      gatePassed,
      contact,
      selectedTopic,
      messages,
      quota,
      quotaTotal: QUOTA_TOTAL,
      isReplying,
      isQuoteVisited,
      quoteBannerDismissed,
      quote,
      hasUnread,
      openWidget,
      closeWidget,
      toggleWidget,
      switchMode,
      setSize,
      setSelectedTopic,
      submitGate,
      sendMessage,
      sendQuickPrompt,
      dismissQuoteBanner,
      setQuoteCategory,
      setQuoteComplexity,
      toggleQuoteFeature,
      resetQuote,
      applyQuoteToConsultation,
      sendQuoteToChat,
      setCustomW,
      setCustomH,
      setSizeMode,
    }),
    [
      isOpen,
      mode,
      size,
      customW,
      customH,
      sizeMode,
      gatePassed,
      contact,
      selectedTopic,
      messages,
      quota,
      isReplying,
      isQuoteVisited,
      quoteBannerDismissed,
      quote,
      hasUnread,
      openWidget,
      closeWidget,
      toggleWidget,
      switchMode,
      setSelectedTopic,
      submitGate,
      sendMessage,
      sendQuickPrompt,
      dismissQuoteBanner,
      setQuoteCategory,
      setQuoteComplexity,
      toggleQuoteFeature,
      resetQuote,
      applyQuoteToConsultation,
      sendQuoteToChat,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}

export { TOPIC_CHIPS };
