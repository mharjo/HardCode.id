import { contactEmail } from "../../data/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>{"{ hardcode.id }"}</div>
      <a href={`mailto:${contactEmail}`} className={styles.link}>
        {contactEmail}
      </a>
    </footer>
  );
}
