import { useEffect, useRef } from "react";
import styles from "@/components/RowReveal.module.css";

export function useRowReveal<T extends HTMLElement>(
  refreshKey?: unknown,
  selector = "[data-reveal-row]",
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!root || motion.matches || !("IntersectionObserver" in window)) return;

    const rows = Array.from(root.querySelectorAll<HTMLElement>(selector));
    const observer = new IntersectionObserver((entries) => {
      let stagger = 0;
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        const row = target as HTMLElement;
        row.style.setProperty("--reveal-delay", `${Math.min(stagger++, 3) * 50}ms`);
        row.classList.add(styles.visible);
        observer.unobserve(row);
      });
    }, { threshold: 0.05 });

    rows.forEach((row) => {
      if (row.classList.contains(styles.visible)) return;
      row.classList.add(styles.pending);
      observer.observe(row);
    });

    const finish = () => {
      if (!motion.matches) return;
      observer.disconnect();
      rows.forEach((row) => {
        row.classList.add(styles.visible);
        row.classList.remove(styles.pending);
      });
    };

    const onFocus = (event: FocusEvent) => {
      const row = rows.find((item) => item.contains(event.target as Node));
      if (!row) return;
      row.classList.add(styles.visible);
      row.classList.remove(styles.pending);
      observer.unobserve(row);
    };

    motion.addEventListener("change", finish);
    root.addEventListener("focusin", onFocus);

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", finish);
      root.removeEventListener("focusin", onFocus);
      rows.forEach((row) => {
        row.classList.remove(styles.pending);
        row.style.removeProperty("--reveal-delay");
      });
    };
  }, [refreshKey, selector]);

  return ref;
}
