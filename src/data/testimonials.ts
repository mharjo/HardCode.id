import type { TranslationKey } from "./translations";

export interface Testimonial {
  id: string;
  initials: string;
  author: string;
  quoteKey: TranslationKey;
  roleKey: TranslationKey;
}

export const testimonials: Testimonial[] = [
  { id: "t1", initials: "DP", author: "D. P.", quoteKey: "testi_q1", roleKey: "testi_role1" },
  { id: "t2", initials: "RS", author: "R. S.", quoteKey: "testi_q2", roleKey: "testi_role2" },
  { id: "t3", initials: "AM", author: "A. M.", quoteKey: "testi_q3", roleKey: "testi_role3" },
  { id: "t4", initials: "FH", author: "F. H.", quoteKey: "testi_q4", roleKey: "testi_role4" },
  { id: "t5", initials: "KW", author: "K. W.", quoteKey: "testi_q5", roleKey: "testi_role5" },
];
