import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeHero from "@/components/HomeHero";
import { SpineSection } from "@/components/CircuitSpine";
import EventSkeleton from "@/components/events/EventSkeleton";
import EventCard from "@/components/EventCard";
import EventDetailsDialog from "@/components/events/EventsDetailsDialog";
import { fetchWithCache } from "@/lib/eventCache";
import styles from "./index.module.css";

const pillars = [
  { title: "Coding Workshops", description: "Mentorship programs, study groups, and academic resources to help you succeed." },
  { title: "Info Sessions", description: "Regular workshops, tech talks, and networking events with industry professionals." },
  { title: "Innovation & Community", description: "Foster creativity through hackathons, projects, and gaming events!" },
];

const involved = [
  { title: "Attend Events", description: "Join our workshops, tech talks, and social events to learn and connect with peers.", href: "/events", cta: "Browse Events" },
  { title: "Volunteer", description: "Help organize events, mentor students, and contribute to our growing community.", href: "/contact", cta: "Get In Touch" },
  { title: "Join the Community", description: "Connect with fellow students, share resources, and stay updated on opportunities.", href: "https://discord.gg/KTdrQkjgjb", cta: "Join the Discord" },
];

const Index = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchWithCache("/api/events");
        setUpcomingEvents((data.events || []).filter((e: any) => e.isUpcoming));
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <HomeHero />

        <SpineSection id="about" tone="paper" label="01 / About" title="FOR THE STUDENTS">
          <div className={styles.aboutGrid}>
            <div>
              <p>
                Hello students and welcome! The UTM Mathematical and Computational Sciences Society (MCSS) is the official academic society for the Math and Computational Sciences Department.
              </p>
              <p>
                Our mission is to represent students, support their academic, social, and career growth, maintain communication among students and faculty, and encourage meaningful interaction beyond lectures, tutorials, and labs.
              </p>
            </div>
            <ul className={`${styles.pillars} font-sub`}>
              {pillars.map((pillar) => (
                <li key={pillar.title}><b>{pillar.title}</b><span>{pillar.description}</span></li>
              ))}
            </ul>
          </div>
        </SpineSection>

        <SpineSection id="events" tone="ink" label="02 / Events" title="UPCOMING EVENTS">
          <p className="mb-10 max-w-xl text-lg text-mcss-paper/70">
            Join us for exciting workshops, talks, and networking opportunities.
          </p>
          {loading ? (
            <EventSkeleton rows={3} tone="ink" />
          ) : upcomingEvents.length === 0 ? (
            <p className="border-y border-white/15 py-12 font-sub text-sm uppercase tracking-[0.2em] text-mcss-paper/70">
              No upcoming events yet — check back soon.
            </p>
          ) : (
            <div className={styles.inkEvents}>
              {upcomingEvents.slice(0, 3).map((event, index) => (
                <EventCard key={event.id || index} {...event} onClick={() => setSelectedEvent(event)} />
              ))}
            </div>
          )}
          <EventDetailsDialog event={selectedEvent} onClose={() => setSelectedEvent(null)} />
          <Link
            href="/events"
            className="group mt-10 inline-flex min-h-[44px] items-center gap-2 border border-white/40 px-5 py-3 font-sub text-xs uppercase tracking-[0.25em] transition-colors duration-200 hover:border-mcss-paper hover:bg-mcss-paper hover:text-mcss-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mcss-sky motion-reduce:transition-none"
          >
            View all events
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">→</span>
          </Link>
        </SpineSection>

        <SpineSection id="get-involved" className={styles.involved} tone="paper" label="03 / Get involved" title="GET INVOLVED">
          <p className="mb-10 max-w-xl text-lg text-muted-foreground">
            Whether you&apos;re a first-year student or a senior, there&apos;s a place for you in MCSS.
          </p>
          <ul className="border-t border-mcss-ink/15">
            {involved.map((item) => (
              <li key={item.title} className={`${styles.involvedRow} grid gap-4 border-b border-mcss-ink/15 py-8 md:grid-cols-12 md:items-center md:gap-8`}>
                <h3 className="text-2xl leading-tight md:col-span-4 md:text-3xl">{item.title}</h3>
                <p className="text-muted-foreground md:col-span-5">{item.description}</p>
                <Link
                  href={item.href}
                  {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group inline-flex min-h-[44px] items-center gap-2 font-sub text-xs uppercase tracking-[0.25em] underline-offset-8 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mcss-ink md:col-span-3 md:justify-end"
                >
                  {item.cta}
                  <span aria-hidden="true" className={styles.involvedArrow}>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </SpineSection>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
