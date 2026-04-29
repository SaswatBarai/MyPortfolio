"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github, Globe } from "lucide-react";
import Image, { StaticImageData } from "next/image";

interface ProjectCardProps {
  index?: number;
  title: string;
  date: string;
  description: string;
  tags: string[];
  image: string | StaticImageData;
  links?: {
    github?: string;
    website?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
}

export const ProjectCard = ({
  index = 0,
  title,
  date,
  description,
  tags,
  image,
  links,
}: ProjectCardProps) => {
  const visibleTags = tags.slice(0, 5);
  const hiddenTagCount = Math.max(tags.length - visibleTags.length, 0);

  return (
    <motion.div
      className="group relative overflow-hidden border-2 border-border bg-card transition-all duration-700 hover:-translate-y-0.5 hover:border-foreground/45 hover:shadow-[3px_3px_0_0_var(--accent)]"
      whileHover={{ y: -1 }}
      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent/50 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      <div className="grid gap-0 sm:grid-cols-[180px_1fr]">
        <div className="relative min-h-[150px] overflow-hidden border-b-2 border-border bg-muted sm:min-h-full sm:border-b-0 sm:border-r-2">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 640px) 180px, 100vw"
            className="object-cover grayscale contrast-110 transition-all duration-1000 group-hover:scale-[1.015] group-hover:grayscale-0"
            placeholder="empty"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-accent/10 to-transparent opacity-0 group-hover:opacity-100 project-scan" />
          <span className="absolute left-3 top-3 border border-border bg-background/90 px-2 py-1 font-mono text-[10px] text-muted-foreground backdrop-blur">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex min-w-0 flex-col p-4 sm:p-5">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                selected build
              </p>
              <h3 className="text-lg font-bold leading-tight text-foreground sm:text-xl">
                {title}
              </h3>
            </div>
            <span className="w-fit shrink-0 border border-border bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">
              {date}
            </span>
          </div>

          <p className="font-mono text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
            {description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="border border-border bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground transition-colors duration-500 hover:border-accent/70 hover:text-foreground"
              >
                {tag}
              </span>
            ))}
            {hiddenTagCount > 0 && (
              <span className="border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground">
                +{hiddenTagCount}
              </span>
            )}
          </div>

          {links && (
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <div className="flex gap-3">
                {links.github && (
                  <a
                    href={links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>src</span>
                  </a>
                )}
                {links.website && (
                  <a
                    href={links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>live</span>
                  </a>
                )}
                {links.linkedin && (
                  <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>more</span>
                  </a>
                )}
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors duration-700 group-hover:text-accent" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
