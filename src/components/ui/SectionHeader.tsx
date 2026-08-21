import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  index: string;
  title: string;
  headingId: string;
}

export function SectionHeader({ index, title, headingId }: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <span className={styles.index} aria-hidden="true">
        {index}
      </span>
      <h2 id={headingId} className={styles.title}>
        {title}
      </h2>
      <div className={styles.rule} />
    </div>
  );
}
