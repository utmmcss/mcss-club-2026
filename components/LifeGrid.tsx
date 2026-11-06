import { useEffect, useRef } from "react";
import styles from "./SectionGlow.module.css";

const CELL = 12; // CSS pixels per cell, including the 2px gap
const STEP_MS = 140; // about 7 generations a second
const PURPLE = [124, 78, 214], PERI = [102, 112, 232], SKY = [110, 206, 255];

// Small seeded generator, so each section starts from its own board but the same one every visit.
const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const mix = (a: number[], b: number[], k: number) => a.map((v, i) => Math.round(v + (b[i] - v) * k));

type LifeGridProps = {
  seed?: number;
  /** Where the cells glow brightest, as fractions of the box from the top left. */
  focus?: [number, number];
  strength?: number;
};

/**
 * Conway's Game of Life on a wrapping grid. Live cells glow and leave a short fading trail; the board is topped up with
 * gliders whenever it settles, and moving the pointer over the section drops new cells. It only steps while on screen and
 * in a visible tab, and draws one settled board for reduced motion. Canvas 2D, so it works without WebGL.
 */
export default function LifeGrid({ seed = 0, focus = [0.85, 0.45], strength = 1 }: LifeGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fx, fy] = focus;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const random = rng(seed * 7919 + 1);
    let cols = 0, rows = 0, cells = new Uint8Array(0), next = new Uint8Array(0), heat = new Float32Array(0);
    let colours: string[] = [], glow = new Float32Array(0);
    let timer = 0, onScreen = false, quiet = 0, sinceGlider = 0;

    const at = (x: number, y: number) => ((y + rows) % rows) * cols + ((x + cols) % cols);
    const glider = (x: number, y: number) => {
      // The five cells of a glider, flipped at random so they head off in all four diagonal directions.
      const sx = random() < 0.5 ? 1 : -1, sy = random() < 0.5 ? 1 : -1;
      for (const [dx, dy] of [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]]) cells[at(x + dx * sx, y + dy * sy)] = 1;
    };

    const build = () => {
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(box.width * dpr));
      canvas.height = Math.max(1, Math.round(box.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(1, Math.ceil(box.width / CELL));
      rows = Math.max(1, Math.ceil(box.height / CELL));
      cells = new Uint8Array(cols * rows);
      next = new Uint8Array(cols * rows);
      heat = new Float32Array(cols * rows);
      for (let i = 0; i < cells.length; i++) cells[i] = random() < 0.18 ? 1 : 0;
      // Colour runs purple to sky across the box; brightness falls off away from the focus, so the text side stays calm.
      colours = Array.from({ length: cols }, (_, x) => {
        const k = x / Math.max(1, cols - 1);
        const [r, g, b] = k < 0.5 ? mix(PURPLE, PERI, k * 2) : mix(PERI, SKY, (k - 0.5) * 2);
        return `rgb(${r},${g},${b})`;
      });
      glow = new Float32Array(cols * rows);
      const span = Math.max(box.width, box.height);
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const d = Math.hypot((x * CELL - fx * box.width) / span, (y * CELL - fy * box.height) / span);
          glow[y * cols + x] = (0.12 + Math.exp(-d * 2.2)) * strength;
        }
    };

    const step = () => {
      let changes = 0, alive = 0;
      for (let y = 0; y < rows; y++) {
        const up = ((y - 1 + rows) % rows) * cols, mid = y * cols, down = ((y + 1) % rows) * cols;
        for (let x = 0; x < cols; x++) {
          const l = (x - 1 + cols) % cols, r = (x + 1) % cols;
          const n = cells[up + l] + cells[up + x] + cells[up + r] + cells[mid + l] + cells[mid + r] + cells[down + l] + cells[down + x] + cells[down + r];
          const i = mid + x;
          const live = n === 3 || (n === 2 && cells[i] === 1) ? 1 : 0;
          next[i] = live;
          changes += live ^ cells[i];
          alive += live;
          heat[i] = live ? 1 : heat[i] * 0.6;
        }
      }
      [cells, next] = [next, cells];
      // A settled board is just blinkers and blocks, so keep it lively with a glider now and then, and more when it stalls.
      quiet = changes < cells.length * 0.004 ? quiet + 1 : 0;
      sinceGlider++;
      if (quiet > 12 || sinceGlider > 40 || alive < cells.length * 0.02) {
        const count = quiet > 12 || alive < cells.length * 0.02 ? 6 : 1;
        for (let k = 0; k < count; k++) glider(Math.floor(random() * cols), Math.floor(random() * rows));
        quiet = 0;
        sinceGlider = 0;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, cols * CELL, rows * CELL);
      for (let x = 0; x < cols; x++) {
        ctx.fillStyle = colours[x];
        for (let y = 0; y < rows; y++) {
          const i = y * cols + x;
          const h = heat[i];
          if (h < 0.04) continue;
          // Live cells are solid; the trail left by a dying cell is fainter and fades over a few generations.
          ctx.globalAlpha = Math.min(1, glow[i] * (cells[i] ? 0.5 : h * 0.22));
          ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      step();
      draw();
    };
    const play = () => {
      if (still || timer || !onScreen || document.hidden) return;
      timer = window.setInterval(tick, STEP_MS);
    };
    const pause = () => {
      clearInterval(timer);
      timer = 0;
    };
    const settle = () => {
      build();
      // Run ahead before the first paint (a few milliseconds), so the noise has thinned into recognisable shapes.
      for (let k = 0; k < 220; k++) step();
      draw();
    };

    // Moving the pointer over the section drops a few live cells under it, which the rules then pick up.
    const onPointer = (e: PointerEvent) => {
      if (!timer) return;
      const box = canvas.getBoundingClientRect();
      const px = e.clientX - box.left, py = e.clientY - box.top;
      if (px < 0 || py < 0 || px > box.width || py > box.height) return;
      const cx = Math.floor(px / CELL), cy = Math.floor(py / CELL);
      for (let k = 0; k < 3; k++) cells[at(cx + Math.floor(random() * 3) - 1, cy + Math.floor(random() * 3) - 1)] = 1;
    };

    let lastWidth = -1;
    const ro = new ResizeObserver(([entry]) => {
      // Only a width change rebuilds the board, so the address bar showing and hiding on a phone doesn't reset it.
      const width = Math.round(entry.contentRect.width);
      if (width === lastWidth) return;
      lastWidth = width;
      settle();
    });
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) play();
        else pause();
      },
      { rootMargin: "200px" },
    );
    const onVisibility = () => (document.hidden ? pause() : play());

    ro.observe(canvas);
    io.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    if (!still) window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [seed, fx, fy, strength]);

  return (
    <div className={styles.glow} aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
