import type { ReactNode } from "react";
import SectionGlow from "./SectionGlow";
import styles from "./CircuitSpine.module.css";

type SpineSectionProps = {
  id: string;
  tone: "ink" | "paper";
  label: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export function SpineSection({
  id,
  tone,
  label,
  title,
  children,
  className = "",
}: SpineSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`${styles[tone]} ${className}`}
    >
      {tone === "ink" && <SectionGlow seed={6} />}
      <div className={styles.frame}>
        <div className={styles.trace} aria-hidden="true">
          <span className={styles.trunk} />
          <span className={styles.branch} />
          <span className={styles.node} />
        </div>
        <div className={styles.content}>
          <header className={styles.heading}>
            <p className={`${styles.eyebrow} font-sub`}>{label}</p>
            <h2 id={`${id}-title`} className={`${styles.title} font-heading`}>
              {title}
            </h2>
          </header>
          {children}
        </div>
      </div>
    </section>
  );
}
