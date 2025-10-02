interface TechStackProps {
  category: string;
  technologies: string;
}

export const TechStack = ({ category, technologies }: TechStackProps) => {
  return (
    <div className="mb-3">
      <span className="font-semibold text-foreground">{category}:</span>{" "}
      <span className="text-muted-foreground">{technologies}</span>
    </div>
  );
};