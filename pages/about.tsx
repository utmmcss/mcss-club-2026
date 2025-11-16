import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  const pillars = [
    {
      icon: Users,
      title: "Student Support",
      description: "We provide mentorship programs, study groups, and academic resources to ensure every student has the support they need to excel in their studies.",
      points: [
        "Peer mentorship programs",
        "Study sessions and exam prep",
        "Academic resource sharing",
        "Career guidance and support",
      ],
    },
    {
      icon: Target,
      title: "Professional Development",
      description: "Through workshops, tech talks, and networking events, we help students develop the skills and connections needed for successful careers.",
      points: [
        "Industry guest speakers",
        "Technical workshops",
        "Resume and interview prep",
        "Networking opportunities",
      ],
    },
    {
      icon: Trophy,
      title: "Innovation & Community",
      description: "We foster creativity and collaboration through hackathons, projects, and social events that bring our community together.",
      points: [
        "Annual hackathons",
        "Collaborative projects",
        "Social and networking events",
        "Community building initiatives",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="hero-gradient text-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 fade-in">
            <h1 className="mb-6 text-white">About MCSS</h1>
            <p className="text-xl md:text-2xl max-w-3xl text-white/90">
              Building the future of technology, one student at a time.
            </p>
          </div>
        </section>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-6 text-center">Our Mission</h2>
              <p className="text-lg text-muted-foreground text-center mb-12">
                The Mississauga Computer Science Society (MCSS) is the official computer science student 
                society at the University of Toronto Mississauga. We are dedicated to fostering a vibrant 
                community where students can learn, grow, and thrive in the field of computer science.
              </p>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="mb-4">What We Believe</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Every student deserves access to quality education and resources</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Collaboration and community are essential for growth</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Diversity and inclusion strengthen our community</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Innovation happens when students are empowered to experiment</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-6 text-center">Our History</h2>
              <Card>
                <CardContent className="pt-6 text-muted-foreground">
                  <p className="mb-4">
                    Founded in 2010, MCSS has grown from a small group of passionate students into 
                    one of the most active student societies at UTM. Over the years, we've hosted 
                    hundreds of events, supported thousands of students, and built lasting relationships 
                    with industry partners.
                  </p>
                  <p>
                    Today, MCSS continues to evolve, adapting to the changing landscape of technology 
                    while staying true to our core mission: supporting and empowering computer science 
                    students at UTM.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-4 text-center">Our Three Core Pillars</h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              Everything we do is guided by these three fundamental principles that shape our community.
            </p>
            
            <div className="space-y-8 max-w-5xl mx-auto">
              {pillars.map((pillar, index) => (
                <Card key={index} className="card-hover">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <pillar.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-2">{pillar.title}</CardTitle>
                        <p className="text-muted-foreground">{pillar.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {pillar.points.map((point, idx) => (
                        <li key={idx} className="flex gap-2 text-muted-foreground">
                          <span className="text-primary mt-1">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
