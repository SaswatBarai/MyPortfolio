"use client"

import React from "react";
import Link from "next/link";
import project1 from "@/assets/crypto-wallet-interface.jpg";
import project2 from "@/assets/project2-fsP8Ek-i.jpg";
import project3 from "@/assets/social-media-app-interface.png";
import project4 from "@/assets/web.archive.org_web_20250402202821_https___dev.gxuri.in_ (1).png";
import { ProjectCard } from "./ProjectCard";

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
      "100x Wallet is a Web3 wallet generator that creates wallets based on mnemonic phrases. It allows users to generate new wallets or import existing ones, without storing private keys.",
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
      "Fix My Code is an innovative platform designed to help developers debug, optimize, and enhance their code with ease.",
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
      "A collection of my UI/UX projects showcasing my skills in design and development.",
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

function HomeProject() {
  return (
    <div className="space-y-8">
      {/* Projects Heading */}
      <h2 className="text-3xl font-bold text-foreground/90 tracking-tight mb-4">
        Projects
      </h2>

      {/* Projects List */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {projects.slice(0, 4).map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>

      {/* View Full Archive Link */}
      <div className="text-right mt-4">
        <Link
          href="/projects"
          className="inline-flex items-center text-primary font-semibold group transition-all duration-300"
        >
          View Full Project Archive
          <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
          <span className="block border-b-2 border-primary scale-x-0 group-hover:scale-x-100 transform transition-transform duration-300 origin-left"></span>
        </Link>
      </div>
    </div>
  );
}

export default HomeProject;
