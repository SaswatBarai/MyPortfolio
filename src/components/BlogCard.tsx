"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image, { StaticImageData } from "next/image";
import { Calendar, ArrowRight } from "lucide-react";

interface BlogCardProps {
  title: string;
  date: string;
  description: string;
  tags: string[];
  image: string | StaticImageData;
  link: string;
}

export const BlogCard = ({ title, date, description, tags, image, link }: BlogCardProps) => {
  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow border border-border bg-card group">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Image */}
        <div className="flex-shrink-0">
          <Image
            src={image}
            alt={title}
            className="w-full sm:w-40 h-32 sm:h-28 object-cover rounded-lg border border-border"
            width={160}
            height={112}
          />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          {/* Title + Date */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {title}
            </h3>
          </div>

          <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2">
            <Calendar className="h-3.5 w-3.5 mr-1" /> {date}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-snug line-clamp-2 mb-3">
            {description}
          </p>

          {/* Tags */}
          <div className="flex overflow-x-auto gap-1.5 scrollbar-hide mb-3">
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

          {/* Read More Link */}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary font-medium text-sm group-hover:underline"
          >
            Read More
            <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </Card>
  );
};
