import { useRouter } from "next/router";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventDetailsDialog from "@/components/events/EventsDetailsDialog";
import FilterBar from "@/components/events/FilterBar";
import EventGrid from "@/components/events/EventGrid";
import Pagination from "@/components/events/Pagination";
import SubscribeDialog from "@/components/SubscribeDialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import useQueryState from "@/hooks/useQueryState";
import useEvents from "@/hooks/useEvents";
import pushQuery from "@/lib/pushQuery";

interface SelectedEventForSubscribe {
  title: string;
  date: string;
}

const Events = () => {
  const router = useRouter();
  const { filter, page, eventId } = useQueryState(router);
  const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);
  const [subscribeEvent, setSubscribeEvent] = useState<SelectedEventForSubscribe | null>(null);

  const { events, meta, loading } = useEvents({
    filter,
    page,
    perPage: 9,
  });

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

  const handleSubscribe = (title: string, date: string) => {
    setSubscribeEvent({ title, date });
    setSubscribeDialogOpen(true);
  };

  const handleSubscribeSuccess = () => {
    toast.success("Subscribed!", {
      description: "You'll receive a reminder 24 hours before the event.",
    });
  };

  const handleSubscribeError = (message: string) => {
    toast.error("Subscription failed", {
      description: message,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster position="top-right" richColors />

      <main className="flex-grow">
        <section className="hero-gradient text-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 fade-in">
            <h1 className="mb-6 text-white">Events</h1>
            <p className="text-xl md:text-2xl max-w-3xl text-white/90">
              Join us for workshops, tech talks, hackathons, and
              networking events throughout the year.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <FilterBar filter={filter} onChange={changeFilter} />

            {loading ? (
              <div className="flex justify-center py-24">
                <p>Loading events...</p>
              </div>
            ) : (
              <>
                <EventGrid events={events} onSelect={selectEvent} onSubscribe={handleSubscribe} />
                <Pagination meta={meta} onPageChange={changePage} />
              </>
            )}
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="mb-4">Stay Updated</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Don't miss out on our events! Follow us on social media
              or join our mailing list to get the latest updates on
              upcoming workshops, talks, and social events.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8"
            >
              Join Our Community
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <EventDetailsDialog event={selectedEvent} onClose={closeEvent} />
      
      {subscribeEvent && (
        <SubscribeDialog
          open={subscribeDialogOpen}
          onOpenChange={setSubscribeDialogOpen}
          eventTitle={subscribeEvent.title}
          eventDate={subscribeEvent.date}
          onSuccess={handleSubscribeSuccess}
          onError={handleSubscribeError}
        />
      )}
    </div>
  );
};

export default Events;
