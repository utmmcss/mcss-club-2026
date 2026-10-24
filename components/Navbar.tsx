import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react";

const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Team", path: "/team" },
  { name: "Events", path: "/events" },
  { name: "Contact", path: "/contact" },
];

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mcss-sky";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isActive = (path: string) => router.pathname === path;

  // Close on route change.
  useEffect(() => {
    const close = () => setIsOpen(false);
    router.events.on("routeChangeStart", close);
    return () => router.events.off("routeChangeStart", close);
  }, [router.events]);

  // Close on Escape (returning focus to the toggle) and lock page scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-50 border-b border-white/15 bg-mcss-ink/95 text-mcss-paper backdrop-blur-md"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" aria-label="MCSS home" className={`flex items-center transition-opacity hover:opacity-80 ${focus}`}>
            <img src="/mcss.svg" alt="MCSS" className="h-11 w-auto" width={124} height={108} />
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            {links.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  aria-current={active ? "page" : undefined}
                  className={`group relative py-2 font-sub text-xs uppercase tracking-[0.25em] ${focus}`}
                >
                  {link.name}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-mcss-gradient-x transition-transform duration-200 motion-reduce:transition-none group-hover:scale-x-100 ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
            <Link
              href="https://linktr.ee/UTM_MCSS"
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-2 border border-white/40 px-4 py-2 font-sub text-xs uppercase tracking-[0.25em] transition-colors duration-200 hover:border-mcss-paper hover:bg-mcss-paper hover:text-mcss-ink motion-reduce:transition-none ${focus}`}
            >
              Join
              <span aria-hidden="true" className="transition-transform duration-200 motion-reduce:transition-none group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className={`-mr-2 p-2 md:hidden ${focus}`}
            onClick={() => setIsOpen((o) => !o)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!isOpen}
        className="absolute left-0 top-full h-[calc(100dvh-4rem)] w-full overflow-y-auto border-t border-white/15 bg-mcss-ink md:hidden"
      >
        <div className="container mx-auto flex flex-col px-4 py-8 sm:px-6">
          {links.map((link, i) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                aria-current={active ? "page" : undefined}
                className={`flex items-baseline gap-4 border-b border-white/15 py-5 font-heading text-4xl uppercase ${
                  active ? "text-mcss-sky" : "text-mcss-paper"
                } ${focus}`}
              >
                <span aria-hidden="true" className="font-sub text-xs tracking-[0.3em] text-mcss-periwinkle">
                  0{i + 1}
                </span>
                {link.name}
              </Link>
            );
          })}
          <Link
            href="https://linktr.ee/UTM_MCSS"
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-8 inline-flex items-center justify-between border border-white/40 px-5 py-4 font-sub text-sm uppercase tracking-[0.25em] ${focus}`}
          >
            Join <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
