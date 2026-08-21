import type { TranslationKey } from "./translations";

export interface ServiceCard {
  id: string;
  icon: string;
  badgeTone: "free" | "paid";
  badgeKey: TranslationKey;
  titleKey: TranslationKey;
  taglineKey: TranslationKey;
  descKey: TranslationKey;
  bulletKeys: TranslationKey[];
  topicsTitleKey: TranslationKey;
  tagKeys: TranslationKey[];
  actionKey: TranslationKey;
  searchTerms: string[];
  /** Internal route the action link should navigate to. Falls back to a `mailto:` CTA when absent (routes not yet built). */
  linkTo?: string;
}

/**
 * Ported from SOURCE `#layanan` service cards. SOURCE's `onclick` routed to
 * `/konsultasi`, `/proyek`, `/belajar` detail views — see migration-step.md.
 */
export const services: ServiceCard[] = [
  {
    id: "konsultasi",
    icon: "[1:1]",
    badgeTone: "free",
    badgeKey: "srv1_badge",
    titleKey: "srv1_title",
    taglineKey: "srv1_tagline",
    descKey: "srv1_desc",
    bulletKeys: ["srv1_li1", "srv1_li2", "srv1_li3"],
    topicsTitleKey: "srv1_topics_title",
    tagKeys: ["srv1_tag1", "srv1_tag2", "srv1_tag3", "srv1_tag4"],
    actionKey: "srv1_action",
    linkTo: "/konsultasi",
    searchTerms: [
      "1-on-1",
      "konsultasi",
      "mentoring",
      "gratis",
      "free",
      "call",
      "google meet",
      "roadmap",
      "tech stack",
    ],
  },
  {
    id: "project",
    icon: "{ }",
    badgeTone: "paid",
    badgeKey: "srv2_badge",
    titleKey: "srv2_title",
    taglineKey: "srv2_tagline",
    descKey: "srv2_desc",
    bulletKeys: ["srv2_li1", "srv2_li2", "srv2_li3"],
    topicsTitleKey: "srv2_topics_title",
    tagKeys: ["srv2_tag1", "srv2_tag2", "srv2_tag3", "srv2_tag4"],
    actionKey: "srv2_action",
    linkTo: "/proyek",
    searchTerms: [
      "project",
      "custom",
      "build",
      "berbayar",
      "automation",
      "tool internal",
      "landing page",
      "integrasi api",
      "workflow",
    ],
  },
  {
    id: "belajar",
    icon: "</>",
    badgeTone: "paid",
    badgeKey: "srv3_badge",
    titleKey: "srv3_title",
    taglineKey: "srv3_tagline",
    descKey: "srv3_desc",
    bulletKeys: ["srv3_li1", "srv3_li2", "srv3_li3"],
    topicsTitleKey: "srv3_topics_title",
    tagKeys: ["srv3_tag1", "srv3_tag2", "srv3_tag3", "srv3_tag4"],
    actionKey: "srv3_action",
    linkTo: "/belajar",
    searchTerms: [
      "belajar",
      "coding",
      "ai privat",
      "pemula",
      "python",
      "web",
      "prompt engineering",
      "les",
      "kursus",
    ],
  },
];
