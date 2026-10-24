import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamCard from "@/components/TeamCard";
import TeamGallery from "@/components/TeamGallery";
import SectionGlow from "@/components/SectionGlow";
import effects from "@/components/BrandEffects.module.css";
import { PageHero } from "@/components/PageHero";
import { useRowReveal } from "@/hooks/useRowReveal";
import reveal from "@/components/RowReveal.module.css";

const Team = () => {
  // Gallery drifts the cards right to left; grid shows everyone at once.
  const [view, setView] = useState<"gallery" | "grid">("gallery");
  const revealRef = useRowReveal<HTMLDivElement>(view);
  const executives = [
    { name: "Emily Su", role: "President", image: "/emily.jpg", linkedin: "https://www.linkedin.com/in/emilysucanada", social: "https://www.instagram.com/emz.y" },
    { name: "Farah Baseet", role: "President", image: "/farah.jpg", linkedin: "https://www.linkedin.com/in/farah-baseet-87297333b/", social: "https://github.com/FarahBaseet" },
    { name: "Kaiden Rai", role: "VP Internal Affairs", image: "/kaiden.jpg", linkedin: "https://www.linkedin.com/in/kaidenrai/" },
    { name: "Ryan Hui", role: "VP External", image: "/ryan.jpg", linkedin: "https://www.linkedin.com/in/ryanc-hui/" },
    { name: "Sana Shahzad", role: "Co-VP Marketing", image: "/sana.jpg", linkedin: "https://www.linkedin.com/in/sanashahzad/" },
    { name: "Elif Sude Yasar", role: "Co-VP Marketing", image: "/elif.jpg", linkedin: "https://www.linkedin.com/in/elif-yasar/" },
    { name: "Carol Wang", role: "Event Director", image: "/carol.jpg", linkedin: "https://www.linkedin.com/in/carol-wang-3b6101204/" },
    { name: "Gabriel You", role: "Tech Co-Director", image: "/gabriel.jpg", linkedin: "https://www.linkedin.com/in/gabeyou/" },
    { name: "Mir Asim Ali", role: "Tech Co-Director", image: "/mir.jpg", linkedin: "https://www.linkedin.com/in/mirasimali/" },
    { name: "Shanta Islam", role: "Finance Director", image: "/shanta.jpg", linkedin: "https://www.linkedin.com/in/shanta-islam-158051338/" },
    { name: "Diego Pachas", role: "DeerHacks Co-Director", image: "/diego.jpg", linkedin: "https://www.linkedin.com/in/diego-pachas-b09b51173/" },
    { name: "Wareesha Imran", role: "DeerHacks Co-Director", image: "/wareesha.jpg", linkedin: "https://www.linkedin.com/in/wareesha-imran-911671317/" },
    { name: "Areesh Noman", role: "DeerHacks Co-Director", image: "/areesh.jpg", linkedin: "https://www.linkedin.com/in/areesh-noman-4464a0354/" },
    { name: "Joshua Wuebbolt", role: "Senior Advisor", image: "/joshua.jpg", linkedin: "https://www.linkedin.com/in/joshuawuebbolt/" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <PageHero eyebrow="04 / TEAM" title="Meet Our Team">
          Dedicated students working together to build an amazing community.
        </PageHero>

        <section className="bg-mcss-paper text-mcss-ink py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
              <div className="space-y-3">
                <h2>Executive Team <span className="heading-figures">2026-27</span></h2>
                <p className="text-lg text-muted-foreground">
                  The people running MCSS for the 2026–27 school year.
                </p>
              </div>
              <div role="group" aria-label="Team layout" className="flex">
                {(["gallery", "grid"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={view === v}
                    onClick={() => setView(v)}
                    className={`-ml-px h-11 border border-mcss-ink/15 px-4 font-sub text-xs uppercase tracking-[0.2em] transition-colors duration-150 first:ml-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mcss-ink motion-reduce:transition-none ${view === v ? "border-mcss-ink bg-mcss-ink text-mcss-paper" : "text-mcss-ink hover:bg-mcss-ink/5"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {view === "grid" && (
              <div ref={revealRef} className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-5 lg:gap-x-6">
                {executives.map((member) => (
                  <div key={member.name} data-reveal-row className={reveal.item}>
                    <TeamCard {...member} />
                  </div>
                ))}
              </div>
            )}
          </div>
          {view === "gallery" && <TeamGallery members={executives} />}
        </section>
      </main>

      {/* One glow behind the closing section and the footer, so the two read as one surface. */}
      <div className="relative isolate overflow-hidden bg-mcss-ink text-mcss-paper">
        <SectionGlow seed={11} />
        <section aria-labelledby="join-heading" className="relative py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-8">
              <h2 id="join-heading">Want to Join Our Team?</h2>
              <div className="min-w-0">
                <p className="mb-6 text-lg text-mcss-paper/80">
                  We're always looking for passionate students to join our executive team.
                  Applications open at the beginning of each academic year.
                </p>
                <a
                  href="/contact"
                  className={`${effects.primaryButton} group inline-flex items-center gap-3 border border-mcss-paper bg-mcss-paper px-6 py-3 font-sub text-sm uppercase tracking-[0.2em] text-mcss-ink transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mcss-paper motion-reduce:transition-none`}
                >
                  Get In Touch
                  <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>
        <Footer glow={false} />
      </div>
    </div>
  );
};

export default Team;
