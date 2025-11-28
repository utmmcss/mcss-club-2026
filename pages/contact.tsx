import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Linkedin, Github, Twitter, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
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
        <section className="hero-gradient text-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 fade-in">
            <h1 className="mb-6 text-white">Get In Touch</h1>
            <p className="text-xl md:text-2xl max-w-3xl text-white/90">
              Have questions? Want to get involved? We'd love to hear from you!
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="mb-6">Send Us a Message</h2>
                <Card>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Name
                        </label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          placeholder="Tell us what's on your mind..."
                          rows={6}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    <Card className="card-hover">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">Email</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <a
                          href="mailto:contact@mcss.club"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          contact@mcss.club
                        </a>
                      </CardContent>
                    </Card>

                    <Card className="card-hover">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">Location</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          University of Toronto Mississauga<br />
                          3359 Mississauga Rd<br />
                          Mississauga, ON L5L 1C6
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="card-hover">
                      <CardHeader>
                        <CardTitle className="text-lg">Follow Us</CardTitle>
                        <CardDescription>Stay connected on social media</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-4">
                          <a
                            href="https://www.instagram.com/utmmcss"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <img src="/instagram.svg" alt="Instagram" className="h-4 w-4" />
                          </a>
                          <a
                            href="https://github.com/utmmcss"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <img src="/github.svg" alt="GitHub" className="h-4 w-4" />
                          </a>
                          <a
                            href="https://www.linkedin.com/company/utmmcss"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <img src="/linkedin.svg" alt="LinkedIn" className="h-4 w-4" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
