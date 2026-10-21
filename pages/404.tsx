import { useEffect, useId, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Crosshair } from "@/components/PageHero";
import effects from "@/components/BrandEffects.module.css";

const NotFound = () => {
  const router = useRouter();
  const traceId = useId();
  const nodeId = useId();
  const [path, setPath] = useState("/???"); // the real path is only known client-side (this page is static)

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", router.asPath);
    const asked = router.asPath.split(/[?#]/)[0];
    setPath(asked.length > 28 ? `${asked.slice(0, 27)}…` : asked);
  }, [router.asPath]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-12 overflow-hidden text-center bg-mcss-ink px-6 py-16 text-mcss-paper sm:px-10">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-mcss-gradient opacity-20 blur-3xl" />
      {["left-5 top-5", "right-5 top-5", "bottom-5 left-5", "bottom-5 right-5"].map((pos) => (
        <Crosshair key={pos} className={pos} />
      ))}

      <p className="relative font-sub text-xs uppercase tracking-[0.3em]">MCSS / ERROR 404</p>

      <div className="relative flex flex-col items-center">
        <h1 className={`${effects.gradientText} font-heading text-[clamp(7rem,32vw,24rem)] leading-[0.85]`}>404</h1>
        <p className="mt-6 font-sub text-2xl font-bold md:text-3xl">This page isn&apos;t in the domain.</p>
        <p className="mt-4 flex flex-wrap items-baseline justify-center gap-x-2 font-serif text-xl italic text-mcss-paper/80 md:text-2xl">
          <span className="inline-flex flex-col items-center leading-none">
            <span>lim</span>
            <span className="mt-1 max-w-[16rem] truncate font-sub text-xs not-italic text-mcss-sky">x → {path}</span>
          </span>
          <span>page(x) = DNE</span>
        </p>
        <p className="mt-3 font-sub text-xs uppercase tracking-[0.2em] text-mcss-paper/60">
          We checked every page on the site. Nothing. <span className="text-mcss-sky">&#8718;</span>
        </p>
        <svg aria-hidden="true" viewBox="0 0 277 40" fill="none" className="mt-8 h-10 w-full max-w-xs" strokeWidth="1.5">
          <defs>
            <linearGradient id={traceId} gradientUnits="userSpaceOnUse" x1="0" y1="30" x2="277" y2="30">
              <stop stopColor="var(--mcss-sky)" />
              <stop offset="0.5" stopColor="var(--mcss-periwinkle)" />
              <stop offset="1" stopColor="var(--mcss-purple)" />
            </linearGradient>
            <linearGradient id={nodeId} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="var(--mcss-sky)" />
              <stop offset="1" stopColor="var(--mcss-purple)" />
            </linearGradient>
          </defs>
          <path d="M0 30 H90 V10 H190 V30 H260" stroke={`url(#${traceId})`} />
          <rect x="260" y="22" width="16" height="16" fill={`url(#${nodeId})`} stroke="var(--mcss-purple)" />
        </svg>
      </div>

      <div className="relative">
        <Link
          href="/"
          className={`${effects.primaryButton} group inline-flex h-12 items-center bg-mcss-paper px-8 font-sub text-sm uppercase tracking-[0.2em] text-mcss-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mcss-paper`}
        >
          Back to the domain <span aria-hidden="true" className="ml-2 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">→</span>
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
