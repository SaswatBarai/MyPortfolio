interface TechStackProps {
  category: string;
  technologies: string;
}

export const TechStack = ({ category, technologies }: TechStackProps) => {
  const techs = technologies.split(",").map((t) => t.trim());
  return (
    <div className="mb-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1.5">
        {category}
      </p>
      <div className="flex flex-wrap gap-1">
        {techs.map((tech) => (
          <span
            key={tech}
            className="font-mono text-[10px] px-1.5 py-0.5 border border-border bg-muted text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors cursor-default"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};
