import type { TranslationKey } from "./translations";

export interface FaqItem {
  id: string;
  questionKey: TranslationKey;
  answerKey: TranslationKey;
  searchTerms: string[];
}

export const faqItems: FaqItem[] = [
  {
    id: "faq-konsultasi",
    questionKey: "faq_q1",
    answerKey: "faq_a1",
    searchTerms: ["sesi", "1-on-1", "konsultasi", "mentoring", "gratis", "free", "call", "google meet"],
  },
  {
    id: "faq-biaya",
    questionKey: "faq_q2",
    answerKey: "faq_a2",
    searchTerms: ["biaya", "harga", "tarif", "bayar", "project", "les privat", "paket", "estimasi", "budget"],
  },
  {
    id: "faq-pemula",
    questionKey: "faq_q3",
    answerKey: "faq_a3",
    searchTerms: ["pemula", "belum pernah coding", "logika dasar", "bahasa mudah"],
  },
  {
    id: "faq-durasi",
    questionKey: "faq_q4",
    answerKey: "faq_a4",
    searchTerms: ["berapa lama", "waktu", "mahir", "target", "pace", "sesi", "timeline"],
  },
  {
    id: "faq-teknologi",
    questionKey: "faq_q5",
    answerKey: "faq_a5",
    searchTerms: ["project custom", "teknologi", "web", "python", "ai", "ekosistem modern"],
  },
  {
    id: "faq-kurikulum",
    questionKey: "faq_q6",
    answerKey: "faq_a6",
    searchTerms: ["materi belajar", "kurikulum baku", "tailor made", "fleksibel", "topik relevan"],
  },
];
