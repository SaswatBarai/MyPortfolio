"use client";
import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { ProjectCard } from "@/components/ProjectCard";
import { TechStack } from "@/components/TechStack";
import { Github, Twitter, Linkedin, FileText, Phone } from "lucide-react";
import Image from "next/image";
import project1 from "@/assets/crypto-wallet-interface.jpg";
import project3 from "@/assets/social-media-app-interface.png";
import Navbar from "@/components/Navbar";
import { ExperienceCard } from "@/components/ExperienceHome";
import { HireMe } from "@/components/HireMe";
import Preloader from "@/components/Preloader";
import ScheduleCallModal from "@/components/ScheduleCallModal";

const projects = [
  {
    title: "LMS Microservices Platform",
    date: "Oct 2025–Present",
    description:
      "Architected a scalable LMS using Node.js and TypeScript microservices, securing 10+ API endpoints via Kong API Gateway and HashiCorp Vault to support 1,000+ concurrent users.",
    tags: ["Node.js", "TypeScript", "Kafka", "Redis", "Kong", "Vault"],
    image: project1,
    links: { github: "#" },
  },
  {
    title: "Hiky — Real-time Messaging",
    date: "May–Sept 2024",
    description:
      "Built a real-time messaging platform with React.js and Node.js, achieving sub-100ms latency using WebSockets and Redis Pub/Sub for scalable cross-instance communication.",
    tags: ["React.js", "Node.js", "WebSockets", "Redis", "JWT/PASETO"],
    image: project3,
    links: { github: "#" },
  },
];

const experiences = [
  {
    company: "CNX10 ITER (Technical Club)",
    role: "Backend Engineer",
    duration: "Jan 2024–Present",
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

const socials = [
  { icon: Github,   label: "GitHub",   href: "https://github.com/SaswatBarai" },
  { icon: Twitter,  label: "Twitter",  href: "https://twitter.com/saswat_ig" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/saswat-barai/" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState("projects");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <div className="min-h-screen bg-background">
      <Preloader />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
        {/* ── Hero banner — full-width editorial header ── */}
        <div className="border-2 border-border mb-6">
          {/* Top rule */}
          <div className="border-b-2 border-border px-3 sm:px-5 py-2 flex items-center justify-between bg-muted">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              portfolio.v3 — {new Date().getFullYear()}
            </span>
            <span className="font-mono text-[10px] text-accent animate-pulse">■ online</span>
          </div>

          <div className="p-4 sm:p-8 md:flex md:items-center md:justify-between gap-6 md:gap-8">
            <div className="flex-1 md:max-w-2xl md:mx-auto text-left">
              <p className="font-mono text-[10px] sm:text-xs text-accent uppercase tracking-[0.14em] sm:tracking-widest mb-2">
                Software Engineer ↗ Backend Systems
              </p>
              <h1 className="text-[2.2rem] sm:text-5xl md:text-6xl font-bold text-foreground leading-[0.95] tracking-tight mb-3 sm:mb-4">
                Saswat<br />Barai
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
                CS undergrad at{" "}
                <span className="text-foreground font-semibold">SOA University (ITER)</span>{" "}
                — building scalable backend systems, microservices, and real-time platforms.
              </p>
            </div>

            {/* Mobile layout: compact side-by-side photo + actions */}
            <div className="mt-5 grid grid-cols-[120px_1fr] gap-3 w-full md:hidden">
              <div className="border-2 border-border bg-card p-1 overflow-hidden h-fit">
                <Image
                  src="/profile.jpg"
                  alt="Saswat Barai"
                  width={120}
                  height={120}
                  className="h-[120px] w-[120px] object-cover object-center scale-110"
                  priority
                />
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setScheduleOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-accent text-accent-foreground font-mono text-[10px] uppercase tracking-[0.14em] transition-colors border-2 border-accent"
                >
                  <Phone className="h-3 w-3" />
                  Schedule Call
                </button>
                <button
                  onClick={() => openExternal("https://drive.google.com")}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-transparent text-foreground font-mono text-[10px] uppercase tracking-[0.14em] transition-colors border-2 border-border"
                >
                  <FileText className="h-3 w-3" />
                  Resume
                </button>
                <div className="grid grid-cols-3 gap-2">
                  {socials.map(({ icon: Icon, label, href }) => (
                    <button
                      key={label}
                      onClick={() => openExternal(href)}
                      title={label}
                      className="flex items-center justify-center py-2 border-2 border-border text-muted-foreground transition-colors"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop/tablet layout: vertical photo + actions */}
            <div className="mt-5 md:mt-0 flex-shrink-0 hidden md:flex flex-col items-end gap-3">
              <div className="border-2 border-border bg-card p-1 overflow-hidden">
                <Image
                  src="/profile.jpg"
                  alt="Saswat Barai"
                  width={176}
                  height={176}
                  className="h-40 w-40 object-cover object-center scale-110"
                  priority
                />
              </div>
              <div className="flex flex-col gap-2 w-40">
                <button
                  onClick={() => setScheduleOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-accent text-accent-foreground font-mono text-[10px] uppercase tracking-widest border-2 border-accent"
                >
                  <Phone className="h-3 w-3" />
                  Schedule a call
                </button>
                <button
                  onClick={() => openExternal("https://drive.google.com")}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-transparent text-foreground font-mono text-[10px] uppercase tracking-widest border-2 border-border"
                >
                  <FileText className="h-3 w-3" />
                  Resume
                </button>
                <div className="flex gap-2">
                  {socials.map(({ icon: Icon, label, href }) => (
                    <button
                      key={label}
                      onClick={() => openExternal(href)}
                      title={label}
                      className="flex-1 flex items-center justify-center py-2 border-2 border-border text-muted-foreground"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Two-column body ── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left sidebar — tech stack ── */}
          <aside className="lg:w-56 shrink-0 lg:sticky lg:top-[60px] lg:self-start">
            <div className="border-2 border-border">
              <div className="border-b-2 border-border px-3 py-2 bg-muted">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">tech_stack.json</span>
              </div>
              <div className="p-4 space-y-4">
                <TechStack category="Languages" technologies="JavaScript, TypeScript, Java, Python, PostgreSQL, C" />
                <TechStack category="Frameworks" technologies="Next.js, React.js, Node.js, Express, Redux" />
                <TechStack category="Data & ML" technologies="NumPy, Pandas, Scikit-learn" />
                <TechStack category="DevOps" technologies="Docker, Kafka, Kong, Vault, Redis" />
                <TechStack category="Cloud" technologies="AWS EC2, AWS S3, Firebase, Prometheus, Grafana" />
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>

              {/* Projects */}
              <section id="projects" className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
                    // projects
                  </h2>
                  <div className="flex-1 border-t border-border" />
                  <span className="font-mono text-[10px] text-muted-foreground">{projects.length} items</span>
                </div>
                <div className="space-y-3">
                  {projects.map((project) => (
                    <ProjectCard key={project.title} {...project} />
                  ))}
                </div>
                <div className="mt-3">
                  <a href="#" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                    → view all projects
                  </a>
                </div>
              </section>

              {/* Experience */}
              <section id="experience" className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
                    // experience
                  </h2>
                  <div className="flex-1 border-t border-border" />
                </div>
                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <ExperienceCard key={exp.company} {...exp} />
                  ))}
                </div>
              </section>

              {/* Achievements */}
              <section id="achievements" className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
                    // achievements
                  </h2>
                  <div className="flex-1 border-t border-border" />
                </div>
                <div className="border-2 border-border bg-card">
                  {achievements.map((achievement, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 px-4 py-3 border-b last:border-b-0 border-border text-xs leading-relaxed"
                    >
                      <span className="font-mono text-accent shrink-0 mt-0.5">
                        {String(idx + 1).padStart(2, "0")}.
                      </span>
                      <span className="text-foreground/90">{achievement}</span>
                    </div>
                  ))}
                </div>
              </section>
            </Tabs>

            {/* Hire me */}
            <HireMe />
          </main>
        </div>

        {/* Footer */}
        <footer className="mt-10 border-t-2 border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            © {new Date().getFullYear()} Saswat Barai
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            Built with Next.js · Deployed on Vercel
          </span>
        </footer>
      </div>

      <ScheduleCallModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </div>
  );
}
