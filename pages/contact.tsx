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
    
    // Basic validation
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
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Linkedin className="h-5 w-5" />
                          </a>
                          <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Github className="h-5 w-5" />
                          </a>
                          <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Twitter className="h-5 w-5" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <Card className="card-hover">
                  <CardHeader>
                    <CardTitle>Office Hours</CardTitle>
                    <CardDescription>Drop by to chat with our team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Monday - Friday:</span>
                        <span className="font-medium">2:00 PM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="font-medium">IB 345</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
