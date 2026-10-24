import Link from "next/link";
import SectionGlow from "./SectionGlow";

const nav = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Team", href: "/team" },
  { name: "Events", href: "/events" },
  { name: "Contact", href: "/contact" },
];

const socials = [
  { name: "Discord", href: "https://discord.gg/KTdrQkjgjb" },
  { name: "Instagram", href: "https://www.instagram.com/utmmcss" },
  { name: "GitHub", href: "https://github.com/utmmcss" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/utmmcss" },
];

const eyebrow = "mb-5 font-sub text-xs uppercase tracking-[0.3em] text-mcss-periwinkle";
const linkCls =
  "group inline-flex items-center gap-2 font-sub text-sm hover:text-mcss-sky focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mcss-sky";
const arrow =
  "text-mcss-sky transition-transform duration-200 motion-reduce:transition-none group-hover:translate-x-1";

// Pass glow={false} when the footer sits inside a wrapper that already has the glow.
const Footer = ({ glow = true }: { glow?: boolean }) => (
  <footer className={`relative isolate overflow-hidden text-mcss-paper ${glow ? "bg-mcss-ink" : ""}`}>
    {glow && <SectionGlow seed={7} />}
    {["left-4 top-4", "right-4 top-4", "left-4 bottom-4", "right-4 bottom-4"].map((pos) => (
      <span key={pos} aria-hidden="true" className={`absolute ${pos} font-sub text-lg font-light leading-none text-mcss-paper/60`}>
        +
      </span>
    ))}
    <div className="container relative mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="mb-6 font-sub text-xs uppercase tracking-[0.3em]">MCSS · 2026 – 2027</p>
          <img src="/mcss.svg" alt="MCSS" className="h-32 w-auto md:h-44" width={124} height={108} />
        </div>

        <nav aria-label="Footer" className="md:col-span-2">
          <h2 className={eyebrow}>Navigate</h2>
          <ul className="space-y-3">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.name}
                  <span aria-hidden="true" className={arrow}>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <h2 className={eyebrow}>Socials</h2>
          <ul className="space-y-3">
            {socials.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  {s.name}
                  <span aria-hidden="true" className={arrow}>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className={eyebrow}>Contact</h2>
          <a href="mailto:mcss@utmsu.ca" className={`${linkCls} break-all`}>
            mcss@utmsu.ca
          </a>
        </div>
      </div>

      <hr className="mt-16 border-0 border-t border-white/15" />
      <div className="mt-6 flex flex-col gap-2 font-sub text-xs uppercase tracking-[0.2em] text-mcss-paper/70 sm:flex-row sm:justify-between">
        <p>University of Toronto Mississauga</p>
        <p>© {new Date().getFullYear()} Mathematical &amp; Computational Sciences Society</p>
      </div>
    </div>
  </footer>
);

export default Footer;
