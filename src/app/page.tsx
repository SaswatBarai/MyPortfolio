"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Tabs } from "@/components/ui/tabs";
import { ProjectCard } from "@/components/ProjectCard";
import { TechStack } from "@/components/TechStack";
import { Github, Twitter, Linkedin } from "lucide-react";

import project1 from "@/assets/crypto-wallet-interface.jpg";
import project2 from "@/assets/project2-fsP8Ek-i.jpg";
import project3 from "@/assets/social-media-app-interface.png";
import project4 from "@/assets/web.archive.org_web_20250402202821_https___dev.gxuri.in_ (1).png";
import Navbar from "@/components/Navbar";
import { ExperienceCard } from "@/components/ExperienceHome";
import { HireMe } from "@/components/HireMe"; // ✅ Separate HireMe component
import { redirect, RedirectType } from "next/navigation";
import Preloader from "@/components/Preloader";
import ScheduleCallModal from "@/components/ScheduleCallModal";

const projects = [
  {
    title: "LMS Microservices Platform",
    date: "Oct 2025 - Present",
    description:
      "Architected a scalable LMS using Node.js and TypeScript microservices, securing 10+ API endpoints via Kong API Gateway and HashiCorp Vault to support 1,000+ concurrent users.",
    tags: ["Node.js", "TypeScript", "Kafka", "Redis", "Kong", "Vault"],
    image: project1,
    links: {
      github: "#",
    },
  },
  {
    title: "Hiky (Real-time Messaging Platform)",
    date: "May 2024 - Sept 2024",
    description:
      "Built a real-time messaging platform with React.js and Node.js, achieving sub-100ms latency using WebSockets and Redis Pub/Sub for scalable cross-instance communication.",
    tags: ["React.js", "Node.js", "WebSockets", "Redis", "JWT/PASETO"],
    image: project3,
    links: {
      github: "#",
    },
  },
];

const experiences = [
  {
    company: "CNX10 ITER (Technical Club)",
    role: "Backend Engineer",
    duration: "Jan 2024 - Present",
    type: ["Leadership", "On-site"],
    description: [
      "Architect and deploy server-side logic using Node.js and Express, supporting community-led technical projects for 500+ active members.",
      "Optimize database performance in MongoDB by implementing efficient indexing and schema normalization.",
      "Reduced API response times by 20% across internal management tools.",
    ],
    tech: "Node.js, Express, MongoDB, API Design, Indexing, Schema Design",
  },
];

const achievements = [
  "Runner-up in the college-level finals of Smart India Hackathon for building software solutions to real-world problem statements.",
  "Mentored 45+ students in backend and frontend development through technical workshops, code reviews, and debugging sessions.",
];

// const blogs = [
//   {
//     title: "Why Minimal UI Wins in 2025",
//     date: "September 15, 2025",
//     description:
//       "Exploring why minimal, clean design continues to dominate modern web development and how Gen-Z developers approach UI.",
//     tags: ["UI/UX", "Design", "Trends"],
//     image: project1,
//     link: "#",
//   },
//   {
//     title: "Building a Portfolio that Lands Internships",
//     date: "August 10, 2025",
//     description:
//       "A breakdown of what tech recruiters look for in portfolios, and how you can craft one that stands out in minutes.",
//     tags: ["Career", "Portfolio", "Internship"],
//     image: project3,
//     link: "#",
//   },
// ];

const Index = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const filteredProjects = projects;

  return (
    <div
      className="min-h-screen bg-background relative"
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
    >
      <Preloader />
      {/* Spotlight Layer */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(400px circle at ${cursor.x}px ${cursor.y}px, rgba(255,255,255,0.08), transparent 80%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-[400px_1fr] gap-12">
            {/* Sidebar */}
            <aside className="space-y-8 md:sticky md:top-[73px] md:self-start md:max-h-[calc(100vh-73px)] md:overflow-y-auto">
              <div>
                <h1 className="text-4xl font-bold mb-2">Saswat Barai</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Backend Engineer and CSE Undergrad
                </p>
                <p className="text-sm text-foreground mb-6 leading-relaxed">
                  I&apos;m a Computer Science undergraduate at{" "}
                  <span className="font-semibold">Siksha &apos;O&apos; Anusandhan (ITER)</span>{" "}
                  focused on building scalable backend systems and production-grade web applications.
                  I work across microservices, distributed systems, and real-time platforms using modern
                  JavaScript and TypeScript ecosystems.
                </p>

                <div className="flex gap-2 mb-8">
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setScheduleOpen(true)}
                  >
                    Schedule a call
                  </Button>
                  <Button variant="outline">Resume</Button>
                  <Button variant="outline" size="icon"
                   onClick={() => redirect("https://github.com/SaswatBarai", RedirectType.push)}
                  >
                    <Github  className="h-4 w-4"
                    />
                  </Button>
                  <Button variant="outline" size="icon"
                   onClick={() => redirect("https://twitter.com/saswat_ig", RedirectType.push)}
                  >
                    <Twitter className="h-4 w-4"
                   
                    />
                  </Button>
                  <Button variant="outline" size="icon"
                  onClick={() => redirect("https://www.linkedin.com/in/saswat-barai/", RedirectType.push)}
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3 text-sm">
                  <TechStack
                    category="Languages"
                    technologies="JavaScript, TypeScript, Java, Python, PostgreSQL, C, HTML5/CSS3"
                  />
                  <TechStack category="Frameworks" technologies="Next.js, React.js, Node.js, Express, Redux, Tailwind CSS" />
                  <TechStack category="Data & ML" technologies="NumPy, Pandas, Scikit-learn, Machine Learning" />
                  <TechStack category="DevOps & Infra" technologies="Docker, Kafka, Kong API Gateway, HashiCorp Vault, Redis" />
                  <TechStack category="Observability & Cloud" technologies="Prometheus, Grafana, ELK Stack, AWS (EC2/S3), Firebase, Git/GitHub, Postman" />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main>
              {/* Projects */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <section id="projects" className="space-y-6">
                  <h2 className="text-3xl font-bold">Projects</h2>
                  <div className="space-y-6">
                    {filteredProjects.map((project) => (
                      <ProjectCard key={project.title} {...project} />
                    ))}
                  </div>
                  <div className="text-right sm:text-left mt-4">
                    <a
                      href="#"
                      className="inline-flex items-center text-primary font-semibold group transition-all duration-300 "
                    >
                     <span className=" text-zinc-300 sm:ml-2 mr-2 hover:text-zinc-50 hover:decoration-sky-500 "> View All Projects </span>
                      <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                      <span className="block border-b-2 border-primary scale-x-0 group-hover:scale-x-100 transform transition-transform duration-300 origin-left"></span>
                    </a>
                  </div>
                </section>

                {/* Experience */}
                <section id="experience" className="space-y-6 mt-6">
                  <h2 className="text-3xl  font-bold">Experience</h2>
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <ExperienceCard key={exp.company} {...exp} />
                    ))}
                  </div>
                </section>

                <section id="achievements" className="space-y-6 mt-6">
                  <h2 className="text-3xl font-bold">Achievements</h2>
                  <div className="border border-border rounded-lg p-4 sm:p-6 bg-card">
                    <ul className="space-y-3 text-sm sm:text-base text-foreground">
                      {achievements.map((achievement) => (
                        <li key={achievement} className="flex gap-2">
                          <span className="text-muted-foreground">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </Tabs>

              {/* Hire Me */}
              <section id="hire-me" className="space-y-6">
                <HireMe />
              </section>
            </main>
          </div>
        </div>
      </div>
      <ScheduleCallModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </div>
  );
};

export default Index;
