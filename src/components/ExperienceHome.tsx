import { Badge } from "@/components/ui/badge";

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
    <div className="border border-border rounded-lg p-4 sm:p-6 mb-4 space-y-3 sm:space-y-4 bg-card hover:border-muted-foreground/20 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-semibold">{company}</h3>
            {type.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">
                {t}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
        <span className="text-xs sm:text-sm text-muted-foreground sm:whitespace-nowrap">{duration}</span>
      </div>
      
      <ul className="space-y-2 text-sm text-foreground">
        {description.map((item, index) => (
          <li key={index} className="flex gap-2">
            <span className="text-muted-foreground">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      
      <p className="text-sm">
        <span className="font-semibold">Tech:</span> {tech}
      </p>
    </div>
  );
};
