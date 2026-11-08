import { useEffect, useRef, useState, type RefObject } from "react";
import styles from "./LogoSequence.module.css";

type Manifest = {
  segments: { intro: [number, number]; exit: [number, number] };
  introFps: number;
  sizes: Record<"desktop" | "mobile", [number, number]>;
  pattern: string;
  exitPulseX: number;
  exitSpan?: number; // scroll progress the exit frames cover; past it the last frame holds
};
const base = "/sequences/logo";
export default function LogoSequence({ heroRef }: { heroRef: RefObject<HTMLElement> }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setup = useRef<{ variant: "desktop" | "mobile"; deadline: number }>();
  const [motion, setMotion] = useState(false);
  useEffect(() => {
    setup.current = {
      variant: rootRef.current.getBoundingClientRect().width * (window.devicePixelRatio || 1) <= 720 ? "mobile" : "desktop",
      deadline: performance.now() + 1500, // deadline is stricter than my assignments
    };
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = rootRef.current, canvas = canvasRef.current, hero = heroRef.current;
    const context = canvas?.getContext("2d");
    if (!motion || !root || !hero || !context) return;
    const { variant, deadline } = setup.current;
    const images: HTMLImageElement[] = [], requests: HTMLImageElement[] = [];
    let manifest: Manifest;
    let phase: "loading" | "intro" | "rest" | "stopped" = "loading";
    let visible = true, startedAt = 0, progress = 0, shown = 0, drawn = -1, raf = 0; // shown: eased progress that frames and --exit follow
    const settled: boolean[] = [];
    let buffered = -1, onBuffer = () => {}; // every frame up to `buffered` has loaded (or failed)
    const stopped = () => phase === "stopped";
    function stop() {
      phase = "stopped";
      cancelAnimationFrame(raf);
      requests.forEach(image => { image.src = ""; });
      delete root.dataset.ready;
    }
    function draw(index: number, force = false) {
      if (!images[index] || (index === drawn && !force)) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
      drawn = index;
      root.dataset.ready = "true";
    }
    function exitIndex() {
      const [first, last] = manifest.segments.exit;
      const index = shown ? first + Math.round(Math.min(1, shown / (manifest.exitSpan ?? 1)) * (last - first)) : manifest.segments.intro[1];
      return images[index] ? index : manifest.segments.intro[1];
    }
    function render(now: number) {
      raf = 0;
      if (stopped()) return;
      let index = exitIndex();
      if (phase === "intro") {
        const [first, last] = manifest.segments.intro;
        index = Math.min(last, first + Math.floor((now - startedAt) * manifest.introFps / 1000));
        if (index > buffered) { 
          index = buffered;
          startedAt = now - (index - first) * 1000 / manifest.introFps; // frames running late so we just pretend the animation started later xd
        }
        if (index < last) raf = requestAnimationFrame(render);
        else {
          phase = "rest";
          raf = requestAnimationFrame(settle); // ease to wherever the page was scrolled during the intro
        }
      }
      draw(index);
    }
    function settle() {
      raf = 0;
      if (stopped() || phase !== "rest") return;
      shown = Math.abs(progress - shown) < 1e-4 ? progress : shown + (progress - shown) * 0.16;
      hero.style.setProperty("--exit", shown.toFixed(4));
      draw(exitIndex());
      if (shown !== progress) raf = requestAnimationFrame(settle);
    }
    function onScroll() {
      if (!visible || !manifest || stopped()) return;
      const box = hero.getBoundingClientRect();
      progress = Math.max(0, Math.min(1, -box.top / Math.max(1, box.height)));
      if (phase !== "rest") return; // the intro always finishes before the exit (and connector line) take over
      if (!raf) raf = requestAnimationFrame(settle);
    }
    function resize() {
      if (!manifest || stopped()) return;
      const box = root.getBoundingClientRect(), heroBox = hero.getBoundingClientRect();
      if (!box.width || !box.height) return;
      hero.style.setProperty("--connector-x", `${box.left - heroBox.left + box.width * manifest.exitPulseX}px`);
      hero.style.setProperty("--connector-y", `${box.bottom - heroBox.top}px`);
      const [width, height] = manifest.sizes[variant];
      const scale = Math.min(window.devicePixelRatio || 1, width / box.width, height / box.height);
      const w = Math.max(1, Math.floor(box.width * scale)), h = Math.max(1, Math.floor(box.height * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        draw(drawn, true);
      }
      onScroll();
    }
    const load = ([first, last]: [number, number]) => Promise.all(Array.from({ length: last - first + 1 }, async (_, offset) => {
      const index = first + offset, image = new Image();
      requests.push(image);
      image.src = `${base}/${variant}/${manifest.pattern.replace(/\{i:0(\d+)\}/, (_, width) => String(index).padStart(Number(width), "0"))}`;
      await image.decode().catch(() => {}); // one bad frame is skipped (draw() holds the last good one), never fatal
      if (!stopped() && image.naturalWidth) images[index] = image;
      settled[index] = true;
      while (settled[buffered + 1]) buffered++;
      onBuffer();
    }));
    const intersection = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) visible = true;
      onScroll(); // Publish the endpoint before ignoring offscreen scrolls.
      visible = entry.isIntersecting;
    });
    intersection.observe(hero);
    const sizing = new ResizeObserver(resize);
    [root, hero].forEach(element => sizing.observe(element));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    void (async () => {
      try {
        const response = await fetch(`${base}/manifest.json`);
        if (!response.ok) throw new Error("Sequence unavailable");
        manifest = await response.json();
        if (stopped()) return;
        resize();
        const [first, last] = manifest.segments.intro;
        buffered = first - 1;
        const intro = load(manifest.segments.intro);
        // Start once a short buffer is in; the rest of the intro streams in while it plays.
        await new Promise<void>(resolve => {
          onBuffer = () => { if (buffered >= Math.min(first + 11, last)) resolve(); };
          void intro.then(() => resolve());
        });
        onBuffer = () => {};
        if (stopped()) return;
        if (phase === "loading" && performance.now() <= deadline) {
          phase = "intro";
          startedAt = performance.now();
          render(startedAt);
        } else phase = "rest"; // A late buffer leaves the rest poster in place.
        await intro;
        await load(manifest.segments.exit);
        onScroll();
      } catch {
        if (!stopped()) stop();
      }
    })();
    return () => {
      stop();
      intersection.disconnect();
      sizing.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      ["--exit", "--connector-x", "--connector-y"].forEach(name => hero.style.removeProperty(name));
    };
  }, [motion, heroRef]);
  return <div ref={rootRef} className={styles.sequence} aria-hidden="true">
    <img src={`${base}/rest.webp`} srcSet={`${base}/rest-mobile.webp 720w, ${base}/rest.webp 1440w`}
      sizes="(max-width: 767px) 80vw, min(53.6vw, 98svh)" width={1440} height={1440} alt="" decoding="async"
      onError={event => {
        const image = event.currentTarget;
        image.removeAttribute("srcset");
        if (!image.src.endsWith("/mcss.svg")) image.src = "/mcss.svg";
      }} />
    {motion && <canvas ref={canvasRef} aria-hidden="true" />}
  </div>;
}
