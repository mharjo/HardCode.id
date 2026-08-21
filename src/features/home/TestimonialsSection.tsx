import { useCallback, useEffect, useRef, useState } from "react";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { testimonials } from "../../data/testimonials";
import { useI18n } from "../../i18n/I18nContext";
import styles from "./TestimonialsSection.module.css";

const AUTOPLAY_INTERVAL_MS = 6000;

export function TestimonialsSection() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const goTo = useCallback((next: number) => {
    setIndex(((next % count) + count) % count);
  }, [count]);

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTOPLAY_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, count]);

  return (
    <section id="testimoni" aria-labelledby="testimoni-heading">
      <SectionHeader index="04" title={t("sec_testimonials_title")} headingId="testimoni-heading" />

      <div
        className={styles.container}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className={styles.viewport}>
          <div
            className={styles.track}
            style={{ transform: `translateX(-${index * 100}%)` }}
            role="group"
            aria-roledescription="carousel"
            aria-live="polite"
          >
            {testimonials.map((testimonial) => (
              <figure key={testimonial.id} className={styles.card} aria-hidden={testimonials[index]?.id !== testimonial.id}>
                <div className={styles.quoteMark} aria-hidden="true">
                  &ldquo;
                </div>
                <blockquote className={styles.quote}>{t(testimonial.quoteKey)}</blockquote>
                <figcaption className={styles.authorRow}>
                  <div className={styles.avatar} aria-hidden="true">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className={styles.author}>{testimonial.author}</div>
                    <span className={styles.role}>{t(testimonial.roleKey)}</span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span>
              {index + 1} / {count}
            </span>{" "}
            <span>· {t("testi_autoslide")}</span>
          </div>
          <div className={styles.dots}>
            {testimonials.map((testimonial, dotIndex) => (
              <button
                key={testimonial.id}
                type="button"
                className={`${styles.dot} ${dotIndex === index ? styles.dotActive : ""}`}
                aria-label={`${dotIndex + 1}`}
                aria-current={dotIndex === index}
                onClick={() => goTo(dotIndex)}
              />
            ))}
          </div>
          <div className={styles.navBtns}>
            <button type="button" className={styles.navBtn} onClick={goPrev} aria-label={t("testi_prev_aria")}>
              ←
            </button>
            <button type="button" className={styles.navBtn} onClick={goNext} aria-label={t("testi_next_aria")}>
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
