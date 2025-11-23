import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamCard from "@/components/TeamCard";

const Team = () => {
  const executives = [
    {
      name: "Saurabh Nair",
      role: "President",
      image: "/saurabh.jpg",
      linkedin: "https://www.linkedin.com/in/saurabhnair13113/",
      social: "https://saurabhnair.com",
    },
    {
      name: "Emily Su",
      role: "VP Internal Affairs",
      image: "/emily.jpg",
      linkedin: "https://www.linkedin.com/in/emilysucanada",
      social: "https://www.instagram.com/emz.y",
    },
    {
      name: "Ana Elisa",
      role: "Events Director",
      image: "/ana.jpg",
      linkedin: "www.linkedin.com/in/ana-elisa-l",
      social: "www.linkedin.com/in/ana-elisa-l",
    },
    {
      name: "Yashda Gupta",
      role: "VP Finance",
      image: "/yashda.jpg",
      linkedin: "https://www.linkedin.com/in/yashdagupta/",
      social: "https://www.linkedin.com/in/yashdagupta/",
    },
    {
      name: "Joshua Wuebbolt",
      role: "Events Director",
      image: "/joshua.jpg",
      linkedin: "https://www.linkedin.com/in/joshuawuebbolt/",
      social: "https://joshuawuebbolt.com",
    },
    {
      name: "Farah Baseet",
      role: "DeerHacks Coordinator",
      image: "/farah.png",
      linkedin: "https://www.linkedin.com/in/farah-baseet-87297333b/",
      social: "https://github.com/FarahBaseet",
    },
    {
      name: "Elif Sude	Yasar",
      role: "VP Marketing",
      image: "/elif.jpg",
      linkedin: "https://www.linkedin.com/in/elif-yasar/",
      social: "https://www.linkedin.com/in/elif-yasar/",
    },
    {
      name: "Aarushi Alreja",
      role: "VP External Affairs",
      image: "/aarushi.jpg",
      linkedin: "https://linkedin.com/in/aarushi-alreja",
      social: "https://github.com/aarushi-codes",
    },
    {
      name: "Dev Vora",
      role: "Tech Director",
      image: "/dev.jpg",
      linkedin: "https://www.linkedin.com/in/devvora/",
      social: "https://github.com/realdevvora",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="hero-gradient text-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 fade-in">
            <h1 className="mb-6 text-white">Meet Our Team</h1>
            <p className="text-xl md:text-2xl max-w-3xl text-white/90">
              Dedicated students working together to build an amazing community.
            </p>
          </div>
        </section>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="mb-4">Executive Team 2025</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our team for the 2025 school year!
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {executives.map((member, index) => (
                <TeamCard key={index} {...member} />
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="mb-4">Want to Join Our Team?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              We're always looking for passionate students to join our executive team. 
              Applications open at the beginning of each academic year.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Team;
