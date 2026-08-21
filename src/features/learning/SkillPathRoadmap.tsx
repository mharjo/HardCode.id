import type { LearningModule, LearningStage, LearningTrack } from "../../data/learning";
import { learningTrackTabs } from "../../data/learning";
import { useI18n } from "../../i18n/I18nContext";
import styles from "./SkillPathRoadmap.module.css";

interface SkillPathRoadmapProps {
  modules: LearningModule[];
  stages: LearningStage[];
  track: LearningTrack | "all";
  onTrackChange: (track: LearningTrack | "all") => void;
}

const STATS: Array<{ key: "learn_path_stats_mods" | "learn_path_stats_tracks" | "learn_path_stats_stages" | "learn_path_stats_pace" }> = [
  { key: "learn_path_stats_mods" },
  { key: "learn_path_stats_tracks" },
  { key: "learn_path_stats_stages" },
  { key: "learn_path_stats_pace" },
];

/** Scrolls to and focuses a module's detail card in the syllabus list below the roadmap, mirroring SOURCE's `scrollToLearnCard` + flash-highlight. */
function jumpToModule(moduleId: string) {
  const target = document.getElementById(moduleId);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "center" });
  target.focus({ preventScroll: true });
}

export function SkillPathRoadmap({ modules, stages, track, onTrackChange }: SkillPathRoadmapProps) {
  const { t, locale } = useI18n();
  const modulesById = new Map(modules.map((module) => [module.id, module]));

  return (
    <section className={styles.container} aria-labelledby="skill-path-heading">
      <div className={styles.top}>
        <span className={styles.badgeTag}>{t("learn_path_badge")}</span>
        <h2 id="skill-path-heading" className={styles.title}>
          {t("learn_path_title")}
        </h2>
        <p className={styles.desc}>{t("learn_path_desc")}</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.trackFilters} role="tablist" aria-label={t("learn_path_title")}>
          {learningTrackTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={track === tab.value}
              className={`${styles.trackBtn} ${track === tab.value ? styles.trackBtnActive : ""}`}
              onClick={() => onTrackChange(tab.value)}
            >
              {t(tab.key)}
            </button>
          ))}
        </div>
        <div className={styles.stats}>
          {STATS.map((stat) => (
            <div key={stat.key} className={styles.statItem}>
              {t(stat.key)}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.flow}>
        {stages.map((stage, index) => {
          const stageModules = stage.moduleIds
            .map((id) => modulesById.get(id))
            .filter((module): module is LearningModule => Boolean(module));
          if (stageModules.length === 0) return null;

          return (
            <div key={stage.stage}>
              <div className={styles.stageRow} data-stage={stage.stage}>
                <div className={styles.stageHeader}>
                  <div className={styles.stageTitleWrap}>
                    <span className={styles.stageDot} aria-hidden="true" />
                    <h3 className={styles.stageTitle}>{t(stage.titleKey)}</h3>
                  </div>
                  <span className={styles.stageBadge}>{t(stage.badgeKey)}</span>
                </div>
                <div className={styles.nodesGrid}>
                  {stageModules.map((module) => (
                    <a
                      key={module.id}
                      href={`#${module.id}`}
                      className={`${styles.nodeCard} ${module.isCapstone ? styles.nodeCardCapstone : ""}`}
                      onClick={(event) => {
                        event.preventDefault();
                        jumpToModule(module.id);
                      }}
                    >
                      <div className={styles.nodeHeader}>
                        <span className={styles.nodeNumPill}>
                          {t("learn_module_prefix")} {String(module.number).padStart(2, "0")}
                          {module.isCapstone ? " · CAPSTONE" : ""}
                        </span>
                        <span className={styles.nodeTrackBadge}>{module.trackBadge[locale]}</span>
                      </div>
                      <h4 className={styles.nodeTitle}>{t(module.titleKey)}</h4>
                      <p className={styles.nodeSummary}>{module.summary[locale]}</p>
                      <div className={styles.nodeTags}>
                        {module.tags.map((tag) => (
                          <span key={tag} className={styles.nodeTag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className={styles.nodeFooter}>
                        <span>{module.prerequisite[locale]}</span>
                        <span className={styles.nodeAction}>{t("learn_path_node_action")}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              {index < stages.length - 1 && (
                <div className={styles.connector} aria-hidden="true">
                  <span className={styles.connectorLine} />
                  <span className={styles.connectorIcon}>{stages[index + 1]?.stage === 4 ? "★" : "↓"}</span>
                  <span className={styles.connectorLine} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className={styles.hint}>{t("learn_path_hint")}</p>
    </section>
  );
}
