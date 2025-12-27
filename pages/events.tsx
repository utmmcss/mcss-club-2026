import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import SubscribeDialog from "@/components/SubscribeDialog";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface SelectedEvent {
  title: string;
  date: string;
}

const Events = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        const events = data.events || [];

        const upcoming = events.filter((e: any) => e.isUpcoming);
        const past = events.filter((e: any) => !e.isUpcoming);

        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const handleSubscribe = (title: string, date: string) => {
    setSelectedEvent({ title, date });
    setDialogOpen(true);
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
      <Toaster position="top-right" richColors />
      
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
            <div className="mb-12">
              <h2 className="mb-4">Upcoming Events</h2>
              <p className="text-lg text-muted-foreground">
                Mark your calendars for these exciting upcoming events!
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event: any, index) => (
                <EventCard
                  key={index}
                  {...event}
                  isUpcoming={true}
                  onSubscribe={handleSubscribe}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="mb-4">Past Events</h2>
              <p className="text-lg text-muted-foreground">
                Check out some of the amazing events we've hosted recently.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event, index) => (
                <EventCard key={index} {...event} />
              ))}
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

      {/* Subscribe Dialog */}
      {selectedEvent && (
        <SubscribeDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          eventTitle={selectedEvent.title}
          eventDate={selectedEvent.date}
          onSuccess={handleSubscribeSuccess}
          onError={handleSubscribeError}
        />
      )}
    </div>
  );
};

export default Events;
