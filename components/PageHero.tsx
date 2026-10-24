import { useId, type ReactNode } from "react";
import SectionGlow from "./SectionGlow";
import styles from "./PageHero.module.css";

export const Crosshair = ({ className = "" }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={`pointer-events-none absolute h-4 w-4 opacity-60 before:absolute before:top-[7px] before:h-px before:w-4 before:bg-current after:absolute after:left-[7px] after:h-4 after:w-px after:bg-current ${className}`}
  />
);

export const PageHero = ({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) => {
  const gradientId = useId();

  return (
    <section className="relative isolate overflow-hidden border-b border-white/15 bg-mcss-ink py-10 text-mcss-paper md:py-14">
      <SectionGlow seed={Number(eyebrow.slice(0, 2)) || 0} />
      <Crosshair className="left-4 top-4 sm:left-6 lg:left-8" />
      <Crosshair className="right-4 top-4 sm:right-6 lg:right-8" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-3">
          <p className="font-sub text-xs uppercase tracking-[0.3em]">{eyebrow}</p>
          <span aria-hidden="true" className="h-px flex-1 bg-white/15" />
        </div>
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-10">
          <div className="min-w-0">
            <h1 className="break-words">{title}</h1>
            {children && <p className="mt-3 max-w-2xl text-lg text-mcss-paper/80 md:text-xl">{children}</p>}
          </div>
          <div aria-hidden="true" className={`${styles.trace} hidden lg:block`}>
            <svg className={styles.drawing} viewBox="0 0 240 120" focusable="false">
              <defs>
                <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="20" y1="12" x2="220" y2="92">
                  <stop stopColor="var(--mcss-sky)" />
                  <stop offset="0.5" stopColor="var(--mcss-periwinkle)" />
                  <stop offset="1" stopColor="var(--mcss-purple)" />
                </linearGradient>
              </defs>
              <path stroke={`url(#${gradientId})`} className={styles.line} d="M 20 12 H 132 V 92 H 220" />
              <rect stroke={`url(#${gradientId})`} className={styles.node} x="214" y="86" width="12" height="12" />
            </svg>
            <span className={styles.head} />
          </div>
        </div>
      </div>
    </section>
  );
};
