import type { CSSProperties } from "react";
import styles from "./SectionGlow.module.css";

export default function SectionGlow({ seed = 0 }: { seed?: number }) {
  // Seed picks one of three waves, mirrors some of them and shifts the crop, so neighbouring sections differ.
  const position = {
    "--glow-wave": `url("/glow-wave-${"abc"[seed % 3]}.webp")`,
    "--glow-flip": Math.floor(seed / 3) % 2 ? -1 : 1,
    "--glow-pos": `50% ${(seed * 37) % 100}%`,
  } as CSSProperties;

  return (
    <div className={styles.glow} style={position} aria-hidden="true">
      <span className={styles.wave} />
    </div>
  );
}
