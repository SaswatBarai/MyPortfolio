"use client";
import { useState } from "react";
import Link from "next/link";
import { Tabs } from "@/components/ui/tabs";
import { ProjectCard } from "@/components/ProjectCard";
import { TechStack } from "@/components/TechStack";
import { Github, Twitter, Linkedin, FileText, Phone } from "lucide-react";
import Image from "next/image";
import { projects } from "@/lib/projects";
import Navbar from "@/components/Navbar";
import { ExperienceCard } from "@/components/ExperienceHome";
import { HireMe } from "@/components/HireMe";
import Preloader from "@/components/Preloader";
import ScheduleCallModal from "@/components/ScheduleCallModal";
import { FadeIn } from "@/components/FadeIn";
import { motion } from "framer-motion";

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
  const featuredProjects = projects.slice(0, 3);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Saswat Barai",
    jobTitle: "Backend Engineer",
    url: "https://saswat.app",
    image: "https://saswat.app/profile.jpg",
    alumniOf: "SOA University (ITER)",
    sameAs: socials.map((s) => s.href),
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Preloader />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
        {/* ── Hero banner — full-width editorial header ── */}
        <motion.div
          className="border-2 border-border mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        >
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
            <div className="mt-5 grid grid-cols-[150px_1fr] gap-3 w-full md:hidden">
              <div className="border-2 border-border bg-card p-1 overflow-hidden h-fit">
                <Image
                  src="/profile.jpg"
                  alt="Saswat Barai"
                  width={150}
                  height={160}
                  sizes="150px"
                  quality={65}
                  className="h-[160px] w-[150px] object-cover object-[center_10%] scale-125"
                  priority
                />
              </div>
              <div className="flex flex-col gap-2">
                <motion.button
                  onClick={() => setScheduleOpen(true)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-accent text-accent-foreground font-mono text-[10px] uppercase tracking-[0.14em] transition-colors border-2 border-accent"
                >
                  <Phone className="h-3 w-3" />
                  Schedule Call
                </motion.button>
                <motion.button
                  onClick={() => openExternal("/resume.pdf")}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-transparent text-foreground font-mono text-[10px] uppercase tracking-[0.14em] transition-colors border-2 border-border"
                >
                  <FileText className="h-3 w-3" />
                  Resume
                </motion.button>
                <div className="grid grid-cols-3 gap-2">
                  {socials.map(({ icon: Icon, label, href }) => (
                    <motion.button
                      key={label}
                      onClick={() => openExternal(href)}
                      title={label}
                      whileHover={{ y: -2, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center justify-center py-2 border-2 border-border text-muted-foreground transition-colors"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </motion.button>
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
                  width={220}
                  height={260}
                  sizes="220px"
                  quality={65}
                  className="h-[260px] w-[220px] object-cover object-[center_10%]"
                  priority
                />
              </div>
              <div className="flex flex-col gap-2 w-[220px]">
                <motion.button
                  onClick={() => setScheduleOpen(true)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-accent text-accent-foreground font-mono text-[10px] uppercase tracking-widest border-2 border-accent"
                >
                  <Phone className="h-3 w-3" />
                  Schedule a call
                </motion.button>
                <motion.button
                  onClick={() => openExternal("/resume.pdf")}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-transparent text-foreground font-mono text-[10px] uppercase tracking-widest border-2 border-border"
                >
                  <FileText className="h-3 w-3" />
                  Resume
                </motion.button>
                <div className="flex gap-2">
                  {socials.map(({ icon: Icon, label, href }) => (
                    <motion.button
                      key={label}
                      onClick={() => openExternal(href)}
                      title={label}
                      whileHover={{ y: -2, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="flex-1 flex items-center justify-center py-2 border-2 border-border text-muted-foreground"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Two-column body ── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left sidebar — tech stack ── */}
          <FadeIn direction="left" delay={0.2} className="lg:w-56 shrink-0 lg:sticky lg:top-[60px] lg:self-start">
            <aside>
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
          </FadeIn>

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>

              {/* Projects */}
              <section id="projects" className="mb-8">
                <FadeIn>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
                      {"// projects"}
                    </h2>
                    <div className="flex-1 border-t border-border" />
                    <span className="font-mono text-[10px] text-muted-foreground">{featuredProjects.length} featured</span>
                  </div>
                </FadeIn>
                <div className="space-y-3">
                  {featuredProjects.map((project, i) => (
                    <FadeIn key={project.title} delay={i * 0.06}>
                      <ProjectCard {...project} index={i} />
                    </FadeIn>
                  ))}
                </div>
                <FadeIn delay={featuredProjects.length * 0.06}>
                  <div className="mt-4">
                    <Link
                      href="/projects"
                      className="group flex items-center justify-between border-2 border-border bg-muted px-4 py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/50 hover:text-foreground"
                    >
                      <span>view all projects</span>
                      <span className="text-accent transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </FadeIn>
              </section>

              {/* Experience */}
              <section id="experience" className="mb-8">
                <FadeIn>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
                      {"// experience"}
                    </h2>
                    <div className="flex-1 border-t border-border" />
                  </div>
                </FadeIn>
                <div className="space-y-3">
                  {experiences.map((exp, i) => (
                    <FadeIn key={exp.company} delay={i * 0.06}>
                      <ExperienceCard {...exp} />
                    </FadeIn>
                  ))}
                </div>
              </section>

              {/* Achievements */}
              <section id="achievements" className="mb-8">
                <FadeIn>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
                      {"// achievements"}
                    </h2>
                    <div className="flex-1 border-t border-border" />
                  </div>
                </FadeIn>
                <FadeIn delay={0.1}>
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
                </FadeIn>
              </section>
            </Tabs>

            {/* Hire me */}
            <FadeIn>
              <HireMe />
            </FadeIn>
          </main>
        </div>

        {/* Footer */}
        <FadeIn>
          <footer className="mt-10 border-t-2 border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              © {new Date().getFullYear()} Saswat Barai
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              Built with Next.js · Deployed on Vercel
            </span>
          </footer>
        </FadeIn>
      </div>

      <ScheduleCallModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </div>
  );
}
