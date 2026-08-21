import type { ProjectType } from "../../data/projects";
import { translations } from "../../data/translations";

/** Case-insensitive substring match against title/body/search terms in both locales, mirroring SOURCE's `filterDetailCards`. */
function matchesProjectSearch(project: ProjectType, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    translations.id[project.titleKey],
    translations.en[project.titleKey],
    ...project.bodyParagraphKeys.map((key) => translations.id[key]),
    ...project.bodyParagraphKeys.map((key) => translations.en[key]),
    project.searchTerms.join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function filterProjectsBySearch(projects: ProjectType[], query: string): ProjectType[] {
  return projects.filter((project) => matchesProjectSearch(project, query));
}
