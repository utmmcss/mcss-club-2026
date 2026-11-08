import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { useRowReveal } from "@/hooks/useRowReveal";
import reveal from "@/components/RowReveal.module.css";

const field =
  "h-12 rounded-none border-mcss-ink/20 bg-transparent px-4 text-base text-mcss-ink shadow-none ring-0 ring-offset-0 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mcss-ink md:text-base";
const label = "mb-2 block font-sub text-xs font-normal uppercase tracking-[0.2em] text-mcss-ink";
const channels = [
  { label: "Email", value: "mcss@utmsu.ca", href: "mailto:mcss@utmsu.ca" },
  { label: "Discord", value: "discord.gg/KTdrQkjgjb", href: "https://discord.gg/KTdrQkjgjb" },
  { label: "Instagram", value: "@utmmcss", href: "https://www.instagram.com/utmmcss" },
  { label: "GitHub", value: "utmmcss", href: "https://github.com/utmmcss" },
  { label: "LinkedIn", value: "utmmcss", href: "https://www.linkedin.com/company/utmmcss" },
];
// The form doesn't send anywhere yet, so it stays hidden until it's wired to a backend.
const showForm = false;

const Contact = () => {
  const revealRef = useRowReveal<HTMLUListElement>();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });

    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <PageHero eyebrow="05 / CONTACT" title="Get In Touch">
          Have questions? Want to get involved? We'd love to hear from you!
        </PageHero>

        <section className="bg-mcss-wash py-12 text-mcss-ink md:py-16">
          <div className="container mx-auto grid gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-10 lg:px-8">
            <div className="min-w-0">
              <h2>Find Us</h2>
              <p className="mt-4 max-w-md text-lg text-muted-foreground">
                Discord is the quickest way to reach us, whether it's a question, event chat or finding teammates.
                For sponsorships, partnerships or anything official, send us an email.
              </p>
              <span className="mt-8 block font-sub text-xs uppercase tracking-[0.2em] text-muted-foreground">Location</span>
              <address className="mt-2 text-base not-italic">
                University of Toronto Mississauga<br />
                3359 Mississauga Rd<br />
                Mississauga, ON L5L 1C6
              </address>
            </div>

            <div className="min-w-0">
              <h2 className="mb-4 font-sub text-xs font-normal uppercase tracking-[0.3em]">Channels</h2>
              <ul ref={revealRef}>
                {channels.map((c) => (
                  <li key={c.label} data-reveal-row className={reveal.row}>
                    <a
                      href={c.href}
                      {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center justify-between gap-4 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mcss-ink"
                    >
                      <span className="min-w-0">
                        <span className="block font-sub text-xs uppercase tracking-[0.2em] text-muted-foreground">{c.label}</span>
                        <span className="block break-all font-sub text-xl md:text-2xl">{c.value}</span>
                      </span>
                      <span aria-hidden="true" className="shrink-0 text-2xl transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">→</span>
                    </a>
                  </li>
                ))}
              </ul>

              {showForm && <div className="mt-10 min-w-0">
              <h2 className="mb-4 font-sub text-xs font-normal uppercase tracking-[0.3em]">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className={label}>Name</label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    aria-required="true"
                    className={field}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={label}>Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    aria-required="true"
                    className={field}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="message" className={label}>Message</label>
                  <Textarea
                    id="message"
                    placeholder="Tell us what's on your mind..."
                    rows={6}
                    aria-required="true"
                    className={`${field} h-auto py-3`}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <Button
                  type="submit"
                  className="group h-12 w-full rounded-none bg-mcss-ink px-8 font-sub text-sm uppercase tracking-[0.2em] text-mcss-paper hover:bg-mcss-ink/90 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mcss-ink motion-reduce:transition-none sm:w-auto"
                >
                  Send <span aria-hidden="true" className="ml-2 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">→</span>
                </Button>
              </form>
              </div>}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
