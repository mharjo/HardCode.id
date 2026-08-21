import type { LearningModule, LearningTrack } from "../../data/learning";
import { translations } from "../../data/translations";

/** Modules whose `tracks` include the given track, or all modules for `"all"`. */
export function filterModulesByTrack(modules: LearningModule[], track: LearningTrack | "all"): LearningModule[] {
  if (track === "all") return modules;
  return modules.filter((module) => module.tracks.includes(track));
}

/** Case-insensitive substring match against title/summary/tags/search terms in both locales, mirroring SOURCE's `filterDetailCards`. */
function matchesModuleSearch(module: LearningModule, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    translations.id[module.titleKey],
    translations.en[module.titleKey],
    module.summary.id,
    module.summary.en,
    module.tags.join(" "),
    module.searchTerms.join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function filterModulesBySearch(modules: LearningModule[], query: string): LearningModule[] {
  return modules.filter((module) => matchesModuleSearch(module, query));
}

export interface LearningFilterParams {
  track: LearningTrack | "all";
  search: string;
}

/**
 * Combines track + search filters and drives both the roadmap and the
 * syllabus list from one filtered set. SOURCE ran two independent filters
 * (track only affected the roadmap, search only the card list) — unified
 * here for a simpler mental model; see migration-step.md.
 */
export function filterLearningModules(modules: LearningModule[], params: LearningFilterParams): LearningModule[] {
  return filterModulesBySearch(filterModulesByTrack(modules, params.track), params.search);
}
