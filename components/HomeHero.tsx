import Link from "next/link";
import { useRef } from "react";
import LogoSequence from "@/components/LogoSequence";
import styles from "./HomeHero.module.css";
import effects from "./BrandEffects.module.css";

export default function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="hero-title">
      <div aria-hidden="true" className={styles.mesh} />
      <span aria-hidden="true" className={`${styles.crosshair} ${styles.topLeft}`} />
      <span aria-hidden="true" className={`${styles.crosshair} ${styles.topRight}`} />
      <div className={styles.copy}>
        <p className={`${styles.meta} font-sub`}>MCSS · 2026 – 2027</p>
        <h1 id="hero-title" className={`${styles.headline} font-heading`}>
          <span>Mathematical &amp;</span>{" "}
          <span>Computational</span>{" "}
          <span className={effects.gradientText}>Sciences Society</span>
        </h1>
        <p className={styles.lede}>
          University of Toronto Mississauga. A place to learn, build, and connect beyond the classroom.
        </p>
        <div className={`${styles.actions} font-sub`}>
          <Link href="/events" className={`${styles.cta} ${styles.primary} ${effects.primaryButton}`}>
            Explore events <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/contact" className={styles.cta}>
            Find your community <span aria-hidden="true">→</span>
          </Link>
        </div>
        <p className={`${styles.tags} font-sub`}>Math / Computer Science / Statistics</p>
      </div>
      <div className={styles.stage}>
        <LogoSequence heroRef={heroRef} />
      </div>
      <span className={styles.connector} aria-hidden="true" />
      <span className={styles.head} aria-hidden="true" />
    </section>
  );
}
