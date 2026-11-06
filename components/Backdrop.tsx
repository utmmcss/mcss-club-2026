import { useEffect, useRef } from "react";

export type BackdropKind = "streak" | "cross" | "wave" | "blobs" | "contour" | "horizon" | "smoke";

// Shared by every kind: brand colours on ink, value noise, and `shape`, whose four numbers each kind reads its own way.
const COMMON = `
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;
uniform vec2 r; // canvas size in px
uniform vec4 shape;
uniform float strength;
uniform float mirror; // 1 flips the effect left to right
uniform float t;
const vec3 INK = vec3(11.,11.,14.)/255.;
const vec3 PURPLE = vec3(124.,78.,214.)/255.;
const vec3 PERI = vec3(102.,112.,232.)/255.;
const vec3 SKY = vec3(110.,206.,255.)/255.;
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float v=0., a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<4;i++){ v+=a*noise(p); p=m*p; a*=.5; } return v; }
float fbm3(vec2 p){ float v=0., a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<3;i++){ v+=a*noise(p); p=m*p; a*=.5; } return v; }
// A ribbon of light climbing left to right: starts at s.x, rises s.y across, purple into sky.
float ribbonPath(float x, vec2 s, float phase){
  return s.x + s.y * pow(x, 1.35) + (fbm(vec2(x*2.5 - t*.06 + phase, t*.04 + phase)) - .5) * .28;
}
// slope is the path's steepness in screen pixels, which keeps the ribbon the same width where it bends steeply.
vec3 ribbon(vec2 uv, float x, float curve, float phase, float slope){
  float d = (uv.y - curve) * r.y / max(r.x, r.y) * 1.8 / sqrt(1. + slope*slope);
  float wide = exp(-d*d * 30.);
  float core = exp(-d*d * 900.);
  float wisps = fbm3(vec2(x*6. - t*.1 + phase, d*10.));
  vec3 col = mix(PURPLE, PERI, smoothstep(.0, .5, x));
  col = mix(col, SKY, smoothstep(.45, 1., x));
  return col * (wide * (.45 + .6*wisps) + core * .6);
}
`;

const GLOW: Record<BackdropKind, string> = {
  // shape.xy: the ribbon.
  streak: `vec3 glow(vec2 uv, float x){
    return ribbon(uv, x, ribbonPath(x, shape.xy, 0.), 0., 0.) + PURPLE * .18 * exp(-length(vec2(x, uv.y) - vec2(.15, 0.)) * 2.5);
  }`,
  // shape.xy: the rising ribbon; shape.zw: a dimmer one running the other way, so the two make an X.
  // Between them runs a thin line squeezed by the pair, like x·sin(1/x) between ±x: it can never leave the gap, so it
  // swings wide at the edges and tightens, faster and faster, into the crossing.
  cross: `vec3 glow(vec2 uv, float x){
    float up = ribbonPath(x, shape.xy, 0.), down = ribbonPath(1. - x, shape.zw, 7.);
    float mid = (up + down) * .5, gap = (up - down) * .5;
    float squeezed = mid + .85 * gap * sin(1.6 / (abs(gap) + .05) - t * .5);
    float dist = (uv.y - squeezed) * r.y;
    float fade = smoothstep(.02, .1, abs(gap)); // let go before the wiggle gets finer than the pixels
    #ifdef GL_OES_standard_derivatives
    float slope = abs(dFdx(squeezed)) * r.y;
    dist /= sqrt(1. + slope * slope); // even width on the steep swings
    fade *= smoothstep(9., 4., slope);
    #endif
    float line = (exp(-dist*dist * .35) * .4 + exp(-dist*dist * .02) * .12) * fade;
    return ribbon(uv, x, up, 0., 0.) + ribbon(uv, 1. - x, down, 7., 0.) * .6 + mix(SKY, vec3(1.), .35) * line
      + PURPLE * .18 * exp(-length(vec2(x, uv.y) - vec2(.15, 0.)) * 2.5);
  }`,
  // shape.x: where the ribbon starts; shape.y: how far it climbs across; shape.z: how far it swings up and down;
  // shape.w: how many bends across the box. A fainter strand follows a step behind, so the two weave as they drift.
  wave: `vec3 glow(vec2 uv, float x){
    float k = shape.w * 6.2832, ph = x * k - t * .18;
    float drift = (fbm3(vec2(x*2. - t*.05, t*.03)) - .5) * .12;
    float path = shape.x + shape.y * x + shape.z * sin(ph) + drift;
    float path2 = shape.x + shape.y * x + shape.z * .8 * sin(ph - 1.1) + drift;
    float toPx = r.y / r.x;
    float slope = (shape.y + shape.z * k * cos(ph)) * toPx;
    float slope2 = (shape.y + shape.z * .8 * k * cos(ph - 1.1)) * toPx;
    return ribbon(uv, x, path, 0., slope) + ribbon(uv, x, path2, 3., slope2) * .45
      + PURPLE * .18 * exp(-length(vec2(x, uv.y) - vec2(.15, 0.)) * 2.5);
  }`,
  // shape.x: planet centre across the box; shape.y: how high the rim's crest sits; shape.z: radius as a fraction of the
  // longer side. Positioning the crest rather than the centre keeps the rim where it's asked for on short and tall boxes.
  horizon: `vec3 glow(vec2 uv, float x){
    float rad = shape.z * max(r.x, r.y);
    vec2 p = (vec2(x, uv.y) * r - vec2(shape.x * r.x, shape.y * r.y - rad)) / rad;
    float a = atan(p.y, p.x);
    float d = length(p) - 1. + (fbm3(vec2(a*5., t*.15)) - .5) * 8. / rad; // a few pixels of shimmer on the rim
    vec3 rimC = mix(PURPLE, SKY, .5 + .5*sin(a*2.6 - t*.25));
    float edge = 1.5 / rad; // the planet's edge fades over a pixel or two instead of stepping
    float inside = smoothstep(edge, -edge, d);
    // The halo spreads ~160px into the sky and ~350px down the surface, so the planet darkens away from its rim.
    float halo = exp(-abs(d) * rad / (d > 0. ? 160. : 350.));
    return rimC * (exp(-abs(d) * rad / 18.) * 1.1 + halo * .3)
      + inside * (PURPLE * (.1 * exp(d * rad / 200.) + .05 * exp(d * 2.5)) + rimC * exp(d * rad / 40.) * .25);
  }`,
  // A folded ribbon of light on black, like the silk in dark mesh-gradient landing pages: a slow domain warp folds it,
  // its edges catch the light, and its face brightens and dims as it twists. shape.xy: where it sits; shape.z: its size.
  blobs: `vec3 glow(vec2 uv, float x){
    vec2 a = r / max(r.x, r.y);
    vec2 p = (vec2(x, uv.y) - shape.xy) * a / shape.z;
    vec2 q = vec2(fbm3(p * .8 + t * .02), fbm3(p * .8 + vec2(5.2, 1.3) - t * .017)) - .5;
    vec2 w = p + q * 1.1;
    float env = exp(-dot(p, p) * .45);
    float twist = .5 + .5 * sin(w.x * 1.8 + w.y * 1.2 + q.y * 5. - t * .05);
    vec3 col = vec3(0.);
    for (int i = 0; i < 2; i++) {
      float fi = float(i);
      float mid = (.5 - fi * 1.1) * w.x + .28 * sin(w.x * (2.1 - fi * .5) + t * .04 + fi * 2.) + fi * .1;
      float width = (.34 + .16 * sin(w.x * 1.6 - t * .03 + fi)) * (1. - fi * .2);
      float d = (w.y - mid) / width;
      float body = exp(-d * d * 1.3);
      float rim = exp(-(abs(d) - .9) * (abs(d) - .9) * 14.);
      vec3 base = mix(PURPLE, PERI, smoothstep(-.9, .9, w.x + fi));
      col += (base * body * (.3 + .7 * twist) + mix(PERI, SKY, twist) * rim * twist * .75) * (1. - fi * .45);
    }
    return col * env * 1.2;
  }`,
  // Level lines of a slowly drifting surface, like a topographic map; every fourth line is brighter.
  // shape.xy: where the lines glow brightest; shape.z: how fast they fade away from there.
  contour: `vec3 glow(vec2 uv, float x){
    vec2 p = vec2(x, uv.y) * r / max(r.x, r.y) * 1.6;
    float h = fbm3(p + vec2(t * .02, -t * .015));
    float v = h * 34.;
    float w = .05;
    #ifdef GL_OES_standard_derivatives
    w = max(fwidth(v), 1e-4);
    #endif
    // Distance to the nearest level in pixels, so every line is the same width however steep the surface is.
    float line = 1. - smoothstep(.5, 1.5, (.5 - abs(fract(v) - .5)) / w);
    line *= smoothstep(.5, .2, w);
    float major = 1. - step(.5, mod(floor(v + .5), 4.));
    vec3 col = mix(PURPLE, SKY, smoothstep(.38, .62, h));
    float focus = exp(-length((vec2(x, uv.y) - shape.xy) * r / max(r.x, r.y)) * shape.z);
    return col * line * (.35 + .4 * major) * (.18 + focus) + PURPLE * .12 * focus;
  }`,
  // shape.xy: where the smoke gathers. Two noise lookups warp a third, so the plumes curl as they drift.
  smoke: `vec3 glow(vec2 uv, float x){
    vec2 p = vec2(x, uv.y) * r / max(r.x, r.y) * 2.6;
    vec2 q = vec2(fbm3(p + vec2(0., t*.035)), fbm3(p + vec2(5.2, 1.3) - t*.03));
    float n = fbm(p + 2.4*q + vec2(t*.02, 0.));
    float strands = fbm3(p*3. + q*3. - t*.04); // finer curls inside each plume
    float plume = smoothstep(.28, .78, n) * (.55 + .7*strands);
    vec3 col = mix(PURPLE, PERI, smoothstep(.3, .7, q.x));
    col = mix(col, SKY, smoothstep(.5, .8, q.y) * .85);
    float focus = exp(-length((vec2(x, uv.y) - shape.xy) * r / max(r.x, r.y)) * 1.8);
    return col * plume * (.22 + 1.1*focus);
  }`,
};

const MAIN = `void main(){
  vec2 uv = gl_FragCoord.xy / r;
  gl_FragColor = vec4(INK + glow(uv, mix(uv.x, 1. - uv.x, mirror)) * strength, 1.);
}`;

// The glow is soft, so drawing below full size and letting CSS scale it up looks the same for a fraction of the work.
// Smoke has no sharp core at all, so it goes lower still.
const SCALE: Record<BackdropKind, number> = { streak: 0.5, cross: 0.5, wave: 0.5, blobs: 0.5, contour: 0.5, horizon: 0.5, smoke: 0.35 };
const FRAME_MS = 1000 / 30 - 2; // a little slack so a 60Hz screen reliably lands on every other frame

type Shape = [number, number, number?, number?];
type BackdropProps = {
  kind?: BackdropKind;
  /** Shape on landscape and portrait boxes; what the numbers mean depends on the kind (see GLOW). */
  wide?: Shape;
  tall?: Shape;
  /** How bright the light is: 1 for the home hero, lower where text sits across the whole section. */
  strength?: number;
  /** Starts the drift at a different point, so neighbouring sections don't move in step. */
  seed?: number;
  mirror?: boolean;
};

/**
 * WebGL backdrop. The context is only created once the canvas nears the viewport; it draws below full size at 30fps,
 * pauses off screen or in a hidden tab, holds one still frame for reduced motion, and is released on unmount.
 * Without WebGL the canvas stays hidden and the parent's background shows instead.
 */
export default function Backdrop({
  kind = "streak",
  wide = [-0.16, 1.0],
  tall = [0.4, 0.55],
  strength = 1,
  seed = 0,
  mirror = false,
}: BackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Plain strings so the effect only reruns when a value changes, not on every new array literal.
  const wideKey = wide.join(",");
  const tallKey = tall.join(",");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const toVec4 = (key: string) => [0, 1, 2, 3].map((i) => Number(key.split(",")[i]) || 0) as [number, number, number, number];
    const wideShape = toVec4(wideKey);
    const tallShape = toVec4(tallKey);
    const scale = SCALE[kind];
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0, onScreen = false, last = 0;
    let gl: WebGLRenderingContext | null = null;
    let uR: WebGLUniformLocation | null = null, uT: WebGLUniformLocation | null = null, uShape: WebGLUniformLocation | null = null;
    const start = performance.now() - seed * 17000;

    const setup = () => {
      const ctx = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, powerPreference: "low-power" });
      if (!ctx) return false;
      ctx.getExtension("OES_standard_derivatives"); // only the cross uses it, and it draws fine without
      const compile = (type: number, src: string) => {
        const s = ctx.createShader(type)!;
        ctx.shaderSource(s, src);
        ctx.compileShader(s);
        return s;
      };
      const program = ctx.createProgram()!;
      ctx.attachShader(program, compile(ctx.VERTEX_SHADER, "attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}"));
      ctx.attachShader(program, compile(ctx.FRAGMENT_SHADER, COMMON + GLOW[kind] + MAIN));
      ctx.linkProgram(program);
      if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) return false;
      ctx.useProgram(program);
      ctx.bindBuffer(ctx.ARRAY_BUFFER, ctx.createBuffer());
      ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), ctx.STATIC_DRAW);
      ctx.enableVertexAttribArray(0);
      ctx.vertexAttribPointer(0, 2, ctx.FLOAT, false, 0, 0);
      uR = ctx.getUniformLocation(program, "r");
      uT = ctx.getUniformLocation(program, "t");
      uShape = ctx.getUniformLocation(program, "shape");
      ctx.uniform1f(ctx.getUniformLocation(program, "strength"), strength);
      ctx.uniform1f(ctx.getUniformLocation(program, "mirror"), mirror ? 1 : 0);
      gl = ctx;
      return true;
    };

    const resize = () => {
      if (!gl) return;
      const box = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(box.width * scale));
      canvas.height = Math.max(1, Math.round(box.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform4f(uShape, ...(canvas.height > canvas.width ? tallShape : wideShape));
    };
    const draw = () => {
      if (!gl) return;
      gl.uniform1f(uT, 30 + (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    // Everything moves slowly, so 30fps looks the same as 60 for half the work.
    const loop = (now: number) => {
      if (now - last >= FRAME_MS) {
        last = now;
        draw();
      }
      frame = requestAnimationFrame(loop);
    };
    const play = () => {
      if (!gl || still || frame || !onScreen || document.hidden) return;
      frame = requestAnimationFrame(loop);
    };
    const pause = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    let failed = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !gl && !failed) {
          if (!setup()) {
            failed = true;
            return;
          }
          resize();
          draw();
          canvas.style.visibility = "visible";
          ro.observe(canvas);
        }
        onScreen ? play() : pause();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      // Browsers cap live WebGL contexts, so hand this one back rather than waiting for garbage collection.
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [kind, wideKey, tallKey, strength, seed, mirror]);

  // A lost context can't be reused, so a fresh canvas comes with each change of settings.
  return (
    <canvas
      key={`${kind}|${wideKey}|${tallKey}|${strength}|${seed}|${mirror}`}
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", visibility: "hidden" }}
    />
  );
}
