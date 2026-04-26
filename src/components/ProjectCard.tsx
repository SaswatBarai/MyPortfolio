import { Github, Globe, ExternalLink } from "lucide-react";
import Image, { StaticImageData } from "next/image";

interface ProjectCardProps {
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

export const ProjectCard = ({ title, date, description, tags, image, links }: ProjectCardProps) => {
  return (
    <div className="group border-2 border-border bg-card hover:border-foreground/40 transition-all duration-200">
      <div className="flex flex-row items-start gap-0">
        {/* Image — retro thumbnail style */}
        <div className="flex-shrink-0 border-r-2 border-border">
          <Image
            src={image}
            alt={title}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
            width={96}
            height={96}
            placeholder="empty"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-3 sm:p-4">
          <div className="flex justify-between items-start mb-1 gap-2">
            <h3 className="text-sm sm:text-base font-bold text-foreground leading-tight">
              {title}
            </h3>
            <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
              {date}
            </span>
          </div>

          <p className="font-mono text-[11px] sm:text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">
            {description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] px-1.5 py-0.5 border border-border text-muted-foreground bg-muted whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          {links && (
            <div className="flex gap-3">
              {links.github && (
                <a href={links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="h-3 w-3" />
                  <span>src</span>
                </a>
              )}
              {links.website && (
                <a href={links.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                  <ExternalLink className="h-3 w-3" />
                  <span>live</span>
                </a>
              )}
              {links.linkedin && (
                <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                  <Globe className="h-3 w-3" />
                  <span>more</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
