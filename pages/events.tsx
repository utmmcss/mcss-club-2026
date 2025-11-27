import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EventDetailsDialog from "@/components/events/EventsDetailsDialog";

const Events = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({ page: 1, per_page: 9, total: 0, totalPages: 1, filter: 'all' });
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const router = useRouter();
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const perPage = 9;

  useEffect(() => {
    if (!router.isReady) return;
    const rqFilter = router.query?.filter;
    const rqPage = router.query?.page;
    const qFilter = Array.isArray(rqFilter) ? rqFilter[0] : rqFilter;
    const qPage = Array.isArray(rqPage) ? rqPage[0] : rqPage;
    if (qFilter && typeof qFilter === 'string' && qFilter !== filter) {
      setFilter(qFilter);
    }
    const parsed = parseInt(String(qPage ?? ''), 10);
    if (!Number.isNaN(parsed) && parsed !== page) {
      setPage(parsed);
    }
  }, [router.isReady, router.query.filter, router.query.page]);

  useEffect(() => {
    if (!router.isReady) return;
    async function load() {
      setLoading(true);
      try {
        const currentFilter = filter;
        const currentPage = page;

        const q: any = { page: String(currentPage), per_page: String(perPage) };
        if (currentFilter && currentFilter !== 'all') q.filter = String(currentFilter);
        const query = new URLSearchParams(q).toString();
        const res = await fetch(`/api/events?${query}`);
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        const pageEvents = data.events || [];
        setEvents(pageEvents);
        setMeta(data.meta || { page: currentPage, per_page: perPage, total: pageEvents.length, totalPages: 1, filter: currentFilter });

        const queryEvent = router.query?.event;
        const eventId = Array.isArray(queryEvent) ? queryEvent[0] : queryEvent;
        if (eventId) {
          let found = pageEvents.find((ev: any) => ev.id === eventId);
          if (!found) {
            const allRes = await fetch('/api/events?per_page=1000');
            if (allRes.ok) {
              const allData = await allRes.json();
              found = (allData.events || []).find((ev: any) => ev.id === eventId);
            }
          }
          if (found) setSelectedEvent(found);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router.isReady, filter, page]);

  const closeEvent = () => {
    setSelectedEvent(null);
    const q = { ...router.query } as any;
    delete q.event;
    router.push({ pathname: router.pathname, query: q }, undefined, { shallow: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="hero-gradient text-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 fade-in">
            <h1 className="mb-6 text-white">Events</h1>
            <p className="text-xl md:text-2xl max-w-3xl text-white/90">
              Join us for workshops, tech talks, hackathons, and networking events throughout the year.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="mb-2">Events</h2>
                <p className="text-lg text-muted-foreground">Browse events — filter and paginate as needed.</p>
              </div>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-primary text-white' : 'bg-muted/20'}`}
                  onClick={() => { setFilter('all'); setPage(1); router.push({ pathname: router.pathname, query: { ...router.query, filter: 'all', page: '1' } }, undefined, { shallow: true }); }}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1 rounded ${filter === 'upcoming' ? 'bg-primary text-white' : 'bg-muted/20'}`}
                  onClick={() => { setFilter('upcoming'); setPage(1); router.push({ pathname: router.pathname, query: { ...router.query, filter: 'upcoming', page: '1' } }, undefined, { shallow: true }); }}
                >
                  Upcoming
                </button>
                <button
                  className={`px-3 py-1 rounded ${filter === 'past' ? 'bg-primary text-white' : 'bg-muted/20'}`}
                  onClick={() => { setFilter('past'); setPage(1); router.push({ pathname: router.pathname, query: { ...router.query, filter: 'past', page: '1' } }, undefined, { shallow: true }); }}
                >
                  Past
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <EventCard
                  key={event.id || index}
                  {...event}
                  onClick={() => {
                    setSelectedEvent(event);
                    if (event?.id) {
                      router.push({ pathname: router.pathname, query: { ...router.query, event: event.id } }, undefined, { shallow: true });
                    }
                  }}
                />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                className="px-3 py-1 rounded bg-muted/20"
                disabled={meta.page <= 1}
                onClick={() => { setPage(Math.max(1, meta.page - 1)); router.push({ pathname: router.pathname, query: { ...router.query, page: String(Math.max(1, meta.page - 1)) } }, undefined, { shallow: true }); }}
              >
                Previous
              </button>
              <div>Page {meta.page} of {meta.totalPages}</div>
              <button
                className="px-3 py-1 rounded bg-muted/20"
                disabled={meta.page >= meta.totalPages}
                onClick={() => { setPage(Math.min(meta.totalPages, meta.page + 1)); router.push({ pathname: router.pathname, query: { ...router.query, page: String(Math.min(meta.totalPages, meta.page + 1)) } }, undefined, { shallow: true }); }}
              >
                Next
              </button>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="mb-4">Stay Updated</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Don't miss out on our events! Follow us on social media or join our mailing list 
              to get the latest updates on upcoming workshops, talks, and social events.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8"
            >
              Join Our Community
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <EventDetailsDialog event={selectedEvent} onClose={closeEvent} />
    </div>
  );
};

export default Events;
