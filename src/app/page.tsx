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

const projects = [
  {
    title: "Skiper UI",
    date: "January 20, 2025",
    description:
      "Skiper UI is a modern UI library for Next.js components that provides sleek, ready-to-use components. With over 25,000 user views in the last 30 days, it offers easy copy-paste implementation and is built on shadcn.",
    tags: ["Next.js", "UI Library", "React.js", "tailwind", "shadcn"],
    image: project1,
    links: {
      website: "#",
      twitter: "#",
      youtube: "#",
      linkedin: "#",
    },
  },
  {
    title: "100x wallet",
    date: "November 20, 2024",
    description:
      "100x Wallet is a Web3 wallet generator that creates wallets based on mnemonic phrases. It allows users to generate new wallets or import existing ones, without storing private keys. The wallets are password-protected, ensuring secure access without compromising private key storage.",
    tags: ["Solana", "Sol Wallet", "React.js", "tailwind"],
    image: project2,
    links: {
      github: "#",
      website: "#",
      twitter: "#",
      youtube: "#",
      linkedin: "#",
    },
  },
  {
    title: "Fix My Code",
    date: "August 20, 2024",
    description:
      "Fix My Code is an innovative platform designed to help developers debug, optimize, and enhance their code with ease. Dive into the features below to see how it can transform your coding experience",
    tags: ["Next.js", "Clerk", "OpenAI", "tailwind css", "SSR"],
    image: project3,
    links: {
      github: "#",
      website: "#",
      twitter: "#",
      youtube: "#",
      linkedin: "#",
    },
  },
  {
    title: "My UI/UX Portfolio",
    date: "May 20, 2024",
    description:
      "A collection of my UI/UX projects showcasing my skills in design and development",
    tags: ["Next.js", "Framer Motion", "tailwind css", "shadcn/ui"],
    image: project4,
    links: {
      github: "#",
      website: "#",
      twitter: "#",
      youtube: "#",
      linkedin: "#",
    },
  },
];

const experiences = [
  {
    company: "Self-employed",
    role: "Freelance Developer",
    duration: "December 2024 - Present",
    type: ["Freelance", "Remote"],
    description: [
      "Developed custom web applications and e-commerce solutions for multiple clients",
      "Built responsive websites using React, Next.js and modern frontend technologies",
      "Provided technical consulting and solutions architecture for small businesses",
    ],
    tech: "React, Next.js, TypeScript, Node.js, MongoDB, Tailwind, Framer Motion, AWS",
  },
  {
    company: "RMSI (Client - Apple Inc)",
    role: "Software Engineer",
    duration: "October 2023 - December 2024",
    type: ["Full time", "Remote"],
    description: [
      "Engineered API for Apple Maps data translation & validation using Node.js/Express/MySQL",
      "Built data visualization tool with React/AWS for digitization analysis",
      "Led NextJS POC initiatives demonstrating scalable solutions",
    ],
    tech: "NodeJS, Express, MySQL, NextJS, TypeScript, React, Tailwind, AWS",
  },
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
                <h1 className="text-4xl font-bold mb-2">Saswat</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Bringing Ideas to Life ✨
                </p>
                <p className="text-sm text-foreground mb-6 leading-relaxed">
                  Hey there 👋 I&apos;m{" "}
                  <span className="font-semibold">Saswat Barai</span> —
                  a curious builder and CSE undergrad exploring how technology
                  can transform ideas into real-world products. I enjoy working
                  across{" "}
                  <span className="font-semibold">
                    web apps, backend systems, and applied AI
                  </span>
                  .
                </p>

                <div className="flex gap-2 mb-8">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
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
                    category="Frontend"
                    technologies="React, Next.js, TailwindCSS, ShadCN UI, Framer Motion"
                  />
                  <TechStack category="Backend" technologies="Node.js, Express.js, Socket.io " />
                  <TechStack category="Database" technologies="MongoDB, Postgres, Redis" />
                  <TechStack category="Cloud & Tools" technologies="Vercel, Firebase, Git, Docker" />
                  <TechStack category="Learning" technologies="AI/ML, Devops, System Design" />
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
              </Tabs>

              {/* Hire Me */}
              <section id="hire-me" className="space-y-6">
                <HireMe />
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
