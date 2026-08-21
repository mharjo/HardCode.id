import type { ProjectType } from "../../data/projects";
import { useI18n } from "../../i18n/I18nContext";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: ProjectType;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useI18n();

  return (
    <div id={project.id} tabIndex={-1} className={styles.card}>
      <div className={styles.asciiWrapper} aria-hidden="true">
        <pre className={styles.asciiArt}>{project.asciiArt}</pre>
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{t(project.titleKey)}</h2>
        {project.bodyParagraphKeys.map((key) => (
          <p key={key}>{t(key)}</p>
        ))}
      </div>
    </div>
  );
}
