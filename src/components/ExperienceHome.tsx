"use client";
import { motion } from "framer-motion";

interface ExperienceCardProps {
  company: string;
  role: string;
  duration: string;
  type: string[];
  description: string[];
  tech: string;
}

export const ExperienceCard = ({ company, role, duration, type, description, tech }: ExperienceCardProps) => {
  return (
    <motion.div
      className="border-2 border-border bg-card hover:border-foreground/40 transition-colors duration-200 p-4 sm:p-5"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm sm:text-base font-bold text-foreground">{company}</h3>
            {type.map((t) => (
              <span key={t} className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border border-border text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
          <p className="font-mono text-xs text-accent">{role}</p>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap sm:text-right">{duration}</span>
      </div>

      {/* Bullets */}
      <ul className="space-y-1.5 mb-3">
        {description.map((item, index) => (
          <li key={index} className="flex gap-2 text-xs text-foreground/80">
            <span className="font-mono text-accent shrink-0 mt-0.5">→</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Tech line */}
      <p className="font-mono text-[10px] text-muted-foreground border-t border-border pt-2.5">
        <span className="text-accent">$</span> {tech}
      </p>
    </motion.div>
  );
};
