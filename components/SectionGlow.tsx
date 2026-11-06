import Backdrop, { type BackdropKind } from "./Backdrop";
import styles from "./SectionGlow.module.css";

// Section defaults, below the home hero's 1 because text runs across the whole width. Smoke is sparse, so it can go higher.
const BRIGHTNESS: Record<BackdropKind, number> = { streak: 0.7, cross: 0.7, wave: 0.6, contour: 1, horizon: 0.6, smoke: 1 };

type Shape = [number, number, number?, number?];
type SectionGlowProps = {
  kind?: BackdropKind;
  seed?: number;
  strength?: number;
  /** Override the seeded choices, e.g. for page heroes whose text always sits on the left. */
  mirror?: boolean;
  wide?: Shape;
  tall?: Shape;
};

export default function SectionGlow({ kind = "streak", seed = 0, strength, mirror, wide, tall }: SectionGlowProps) {
  // Seed mirrors some sections and shifts where the ribbon crosses, so neighbouring streaks differ.
  const v = ((seed * 37) % 100) / 100;
  const defaults: Record<BackdropKind, [Shape, Shape]> = {
    streak: [[-0.3 + v * 0.35, 1.1 - v * 0.3], [0.1 + v * 0.3, 0.7]],
    cross: [[-0.3 + v * 0.35, 1.1 - v * 0.3, -0.12, 1.05], [0.1 + v * 0.3, 0.7, 0.05, 0.75]],
    // About one and a quarter bends across a wide box, gentler on a phone so it doesn't turn vertical.
    wave: [[0.25, 0.4, 0.22, 1.25], [0.3, 0.35, 0.1, 0.75]],
    contour: [[0.85, 0.45, 2.0], [0.7, 0.3, 2.0]],
    // A wide, flat planet whose rim crests near the bottom, below the text.
    horizon: [[0.7, 0.16, 1.6], [0.6, 0.1, 1.4]],
    smoke: [[0.8, 0.15], [0.7, 0.1]],
  };
  return (
    <div className={styles.glow} aria-hidden="true">
      <Backdrop
        kind={kind}
        seed={seed}
        strength={strength ?? BRIGHTNESS[kind]}
        mirror={mirror ?? (kind === "streak" && Math.floor(seed / 3) % 2 === 1)}
        wide={wide ?? defaults[kind][0]}
        tall={tall ?? defaults[kind][1]}
      />
    </div>
  );
}
