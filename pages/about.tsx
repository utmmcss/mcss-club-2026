import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionGlow from "@/components/SectionGlow";
import { PageHero } from "@/components/PageHero";
import { useRowReveal } from "@/hooks/useRowReveal";
import reveal from "@/components/RowReveal.module.css";

const beliefs = [
  "Every student deserves access to quality education and resources",
  "Collaboration and community are essential for growth",
  "Diversity and inclusion strengthen our community",
  "Innovation happens when students are empowered to experiment",
];

const pillars = [
  {
    title: "Coding Workshops",
    description: "We offer coding workshops for students to learn how to use different technologies to build their own projects.",
    points: [
      "Peer mentorship programs",
      "Study sessions and exam prep",
      "Academic resource sharing",
      "Career guidance and support",
    ],
  },
  {
    title: "Info Sessions",
    description: "Through workshops, tech talks, and networking events, we help students develop the skills and connections needed for successful careers.",
    points: [
      "Industry guest speakers",
      "Technical workshops",
      "Resume and interview prep",
      "Networking opportunities",
    ],
  },
  {
    title: "Innovation & Community",
    description: "We foster creativity and collaboration through hackathons, projects, and gaming events that bring our community together.",
    points: [
      "Annual hackathons",
      "Collaborative projects",
      "Gaming Events",
      "Community building initiatives",
    ],
  },
];

const num = (i: number) => String(i + 1).padStart(2, "0");
const wrap = "container mx-auto px-4 sm:px-6 lg:px-8";

const About = () => {
  const revealRef = useRowReveal<HTMLElement>();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main ref={revealRef} className="flex-grow">
        {/* Hero (Ink) */}
        <PageHero eyebrow="01 / ABOUT" title="About MCSS">
          The official academic society for students in UTM's Mathematical &amp; Computational Sciences department.
        </PageHero>

        {/* Mission + beliefs (Paper) */}
        <section className="bg-mcss-paper text-mcss-ink py-12 md:py-16">
          <div className={wrap}>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-10">
              <div className="min-w-0">
                <h2 className="mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground">
                  MCSS represents students in the Mathematical &amp; Computational Sciences department at UTM.
                  We promote students' common interests, provide academic, social, and career support, keep
                  communication open between students and the department's faculty and staff, and encourage
                  student and faculty interaction outside lectures, tutorials, and labs.
                </p>
              </div>
              <div className="min-w-0">
                <h2 className="mb-4">What We Believe</h2>
                <ol>
                  {beliefs.map((belief, i) => (
                    <li key={belief} data-reveal-row className={`${reveal.row} grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-4 py-4 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5`}>
                      <span aria-hidden="true" className="font-heading text-3xl leading-none sm:text-4xl">{num(i)}</span>
                      <p className="text-lg">{belief}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* History (Ink) */}
        <section className="relative isolate overflow-hidden bg-mcss-ink text-mcss-paper py-12 md:py-16">
          <SectionGlow seed={8} />
          <div className={wrap}>
            <h2 className="mb-6">Our History</h2>
            <div className="grid gap-6 text-lg text-mcss-paper/80 md:grid-cols-2 md:gap-8">
              <p>
                Founded in 2010, MCSS has grown from a small group of passionate students into
                one of the most active student societies at UTM. Over the years, we've hosted
                hundreds of events, supported thousands of students, and built lasting relationships
                with industry partners.
              </p>
              <p>
                Today, MCSS continues to evolve, adapting to the changing landscape of technology
                while staying true to our core mission: supporting and empowering math and
                computational sciences students at UTM.
              </p>
            </div>
          </div>
        </section>

        {/* Pillars (Paper) */}
        <section className="bg-mcss-wash text-mcss-ink py-12 md:py-16">
          <div className={wrap}>
            <div>
              <h2>Our Three Core Pillars</h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Everything we do is guided by these three fundamental principles that shape our community.
              </p>
            </div>

            <ol className="mt-6 md:mt-8">
              {pillars.map((pillar, i) => (
                <li key={pillar.title} data-reveal-row className={`${reveal.row} grid grid-cols-[3rem_minmax(0,1fr)] gap-4 py-6 sm:gap-6 lg:grid-cols-[4rem_minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-8`}>
                  <span aria-hidden="true" className="font-heading text-4xl leading-none sm:text-5xl lg:text-6xl">{num(i)}</span>
                  <div className="min-w-0">
                    <h3 className="mb-3">{pillar.title}</h3>
                    <p className="text-muted-foreground">{pillar.description}</p>
                  </div>
                  <ul className="col-start-2 grid content-start gap-2 sm:grid-cols-2 lg:col-start-auto">
                    {pillar.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span aria-hidden="true" className="font-sub">→</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
