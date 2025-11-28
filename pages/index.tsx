import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Lightbulb, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import EventDetailsDialog from "@/components/events/EventsDetailsDialog";
import mcssbg from "@/public/hero-bg.jpg";
import { useEffect, useState } from "react";

const Index = () => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  
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
  
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading events...</p>
        </div>
      );
    }

  const pillars = [
    {
      icon: Users,
      title: "Coding Workshops",
      description: "Mentorship programs, study groups, and academic resources to help you succeed.",
    },
    {
      icon: Calendar,
      title: "Info Sessions",
      description: "Regular workshops, tech talks, and networking events with industry professionals.",
    },
    {
      icon: Lightbulb,
      title: "Innovation & Community",
      description: "Foster creativity through hackathons, projects, and gaming events!",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="relative hero-gradient text-white py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={mcssbg.src} 
            alt="MCSS Hero" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 fade-in">
          <div className="max-w-3xl">
            <p className="text-xl md:text-2xl mb-4 text-white/90">
              University of Toronto Mississauga
            </p>
            <h1 className="mb-6 text-white">
              Mathematical & Computational Sciences Society
            </h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">FOR THE STUDENTS</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hello students and welcome! The UTM Mathematical and Computational Sciences Society (MCSS) is the official academic society for the Math and Computational Sciences Department. Our mission is to represent students, support their academic, social, and career growth, maintain communication among students and faculty, and encourage meaningful interaction beyond lectures, tutorials, and labs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <Card key={index} className="card-hover text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <pillar.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{pillar.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="mb-4">Upcoming Events</h2>
              <p className="text-lg text-muted-foreground">
                Join us for exciting workshops, talks, and networking opportunities.
              </p>
            </div>
            <Button asChild variant="ghost" className="hidden md:flex">
              <Link href="/events">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.slice(0, 3).map((event, index) => (
              <EventCard key={index} {...event} onClick={() => setSelectedEvent(event)} />
            ))}
          </div>
          <EventDetailsDialog event={selectedEvent} onClose={() => setSelectedEvent(null)} />
          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="ghost">
              <Link href="/events">
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">Get Involved</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're a first-year student or a senior, there's a place for you in MCSS.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Attend Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Join our workshops, tech talks, and social events to learn and connect with peers.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/events">Browse Events</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Volunteer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Help organize events, mentor students, and contribute to our growing community.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/contact">Get In Touch</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Join the Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Connect with fellow students, share resources, and stay updated on opportunities.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/contact">Become a Member</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Index;
