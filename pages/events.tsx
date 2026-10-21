import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventDetailsDialog from "@/components/events/EventsDetailsDialog";
import FilterBar from "@/components/events/FilterBar";
import EventGrid from "@/components/events/EventGrid";
import EventSkeleton from "@/components/events/EventSkeleton";
import Pagination from "@/components/events/Pagination";
import { PageHero } from "@/components/PageHero";
import SectionGlow from "@/components/SectionGlow";
import effects from "@/components/BrandEffects.module.css";

import useQueryState from "@/hooks/useQueryState";
import useEvents from "@/hooks/useEvents";
import pushQuery from "@/lib/pushQuery";
import { useRowReveal } from "@/hooks/useRowReveal";
import reveal from "@/components/RowReveal.module.css";

const Events = () => {
  const router = useRouter();
  const { filter, page, eventId } = useQueryState(router);

  const { events, meta, loading } = useEvents({
    filter,
    page,
    perPage: 9,
  });
  const revealRef = useRowReveal<HTMLDivElement>(loading ? null : events, ":scope > div > div");

  const selectedEvent =
    events.find((e: any) => e.id === eventId) ?? null;

  const selectEvent = (id: string) => {
    pushQuery(router, { event: id });
  };

  const closeEvent = () => {
    const q = { ...router.query };
    delete q.event;
    router.push({ pathname: router.pathname, query: q }, undefined, {
      shallow: true,
    });
  };

  const changeFilter = (f: string) => {
    pushQuery(router, { filter: f, page: 1 });
  };

  const changePage = (p: number) => {
    pushQuery(router, { page: p });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <PageHero eyebrow="03 / EVENTS" title="Events">
          Join us for workshops, tech talks, hackathons, and
          networking events throughout the year.
        </PageHero>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <FilterBar filter={filter} onChange={changeFilter} />

            {loading ? (
              <EventSkeleton />
            ) : (
              <>
                <div ref={revealRef} className={reveal.events}>
                  <EventGrid events={events} onSelect={selectEvent} />
                </div>
                <Pagination meta={meta} onPageChange={changePage} />
              </>
            )}
          </div>
        </section>
      </main>

      {/* One glow behind the closing section and the footer, so the two read as one surface. */}
      <div className="relative isolate overflow-hidden bg-mcss-ink text-mcss-paper">
        <SectionGlow seed={9} />
        <section aria-labelledby="updates-heading" className="relative py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-8">
              <div className="min-w-0">
                <h2 id="updates-heading" className="mb-3">Stay Updated</h2>
                <p className="max-w-2xl text-lg text-mcss-paper/80">
                  Don't miss out on our events! Follow us on social media
                  or join our mailing list to get the latest updates on
                  upcoming workshops, talks, and social events.
                </p>
              </div>
              <div className="lg:text-right">
                <a
                  href="https://discord.gg/KTdrQkjgjb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${effects.primaryButton} group inline-flex items-center bg-mcss-paper px-6 py-3 font-sub text-xs font-bold uppercase tracking-[0.2em] text-mcss-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mcss-sky`}
                >
                  Join Our Community
                  <span aria-hidden="true" className="ml-3 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>
        <Footer glow={false} />
      </div>
      <EventDetailsDialog event={selectedEvent} onClose={closeEvent} />
    </div>
  );
};

export default Events;
