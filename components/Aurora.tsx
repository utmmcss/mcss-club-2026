import { useEffect, useRef } from "react";
import styles from "./Aurora.module.css";

/** Decorative background; the parent should establish a positioning context. */
export default function Aurora({ className = "", backlight = false }: { className?: string; backlight?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || backlight) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    let visible = false;
    let frame = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;

    function tick() {
      x += (targetX - x) * 0.075;
      y += (targetY - y) * 0.075;
      const settled = Math.abs(targetX - x) + Math.abs(targetY - y) < 0.005;
      if (settled) {
        x = targetX;
        y = targetY;
      }
      element.style.setProperty("--mx", `${x}vw`);
      element.style.setProperty("--my", `${y}vh`);
      frame = settled ? 0 : requestAnimationFrame(tick);
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      // Clamp each axis to 4% of the viewport. No layout reads in the frame loop.
      targetX = Math.max(-4, Math.min(4, (event.clientX / window.innerWidth - 0.5) * 8));
      targetY = Math.max(-4, Math.min(4, (event.clientY / window.innerHeight - 0.5) * 8));
      if (!frame) frame = requestAnimationFrame(tick);
    }

    function updateMotion() {
      const moving = visible && !reducedMotion.matches;
      element.style.setProperty("--aurora-play-state", moving ? "running" : "paused");
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
      frame = 0;
      if (moving && !coarsePointer.matches) {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        frame = requestAnimationFrame(tick);
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateMotion();
    });
    observer.observe(element);
    reducedMotion.addEventListener("change", updateMotion);
    coarsePointer.addEventListener("change", updateMotion);

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", updateMotion);
      coarsePointer.removeEventListener("change", updateMotion);
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, [backlight]);

  return (
    <div ref={ref} className={`${styles.aurora} ${backlight ? styles.backlight : ""} ${className}`} aria-hidden="true">
      <div className={styles.field}>
        <span className={styles.blob} />
        <span className={styles.blob} />
        <span className={styles.blob} />
      </div>
    </div>
  );
}
