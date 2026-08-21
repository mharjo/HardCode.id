import type { TranslationKey } from "./translations";

export interface HowItWorksStep {
  id: string;
  number: number;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}

export const steps: HowItWorksStep[] = [
  { id: "cerita", number: 1, titleKey: "step1_title", descKey: "step1_desc" },
  { id: "selaraskan", number: 2, titleKey: "step2_title", descKey: "step2_desc" },
  { id: "jalan", number: 3, titleKey: "step3_title", descKey: "step3_desc" },
];
