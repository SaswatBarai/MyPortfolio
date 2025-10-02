import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Globe, Twitter, Youtube, Linkedin } from "lucide-react";
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
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow border border-border bg-card">
      {/* Mobile: Horizontal card layout */}
      <div className="flex flex-row items-start gap-4">
        {/* Image */}
        <div className="flex-shrink-0">
          <Image
            src={image}
            alt={title}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-border"
            width={96}
            height={96}
            placeholder="empty"
          />
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
              {title}
            </h3>
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              {date}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mb-2 leading-snug line-clamp-2">
            {description}
          </p>

          {/* Tech stack badges */}
          <div className="flex overflow-x-auto gap-1.5 scrollbar-hide">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] sm:text-xs font-normal px-2 py-0.5 whitespace-nowrap flex-shrink-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Links only on desktop */}
      {links && (
        <div className="hidden sm:flex gap-3 mt-3">
          {links.github && (
            <a href={links.github} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 text-foreground hover:text-muted-foreground transition-colors" />
            </a>
          )}
          {links.website && (
            <a href={links.website} target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4 text-foreground hover:text-muted-foreground transition-colors" />
            </a>
          )}
          {links.twitter && (
            <a href={links.twitter} target="_blank" rel="noopener noreferrer">
              <Twitter className="h-4 w-4 text-foreground hover:text-muted-foreground transition-colors" />
            </a>
          )}
          {links.youtube && (
            <a href={links.youtube} target="_blank" rel="noopener noreferrer">
              <Youtube className="h-4 w-4 text-foreground hover:text-muted-foreground transition-colors" />
            </a>
          )}
          {links.linkedin && (
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-4 w-4 text-foreground hover:text-muted-foreground transition-colors" />
            </a>
          )}
        </div>
      )}
    </Card>
  );
};
