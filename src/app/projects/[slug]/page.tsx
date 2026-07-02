import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, ExternalLink, Github, Layers, Target, Wrench } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { projects } from "@/lib/projects";
import { slugify } from "@/lib/utils";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function findProject(slug: string) {
  return projects.find((project) => slugify(project.title) === slug);
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: slugify(project.title) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const caseStudy = project.caseStudy;
  const otherProjects = projects.filter((p) => p.title !== project.title);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
        <FadeIn>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors mb-5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            back to archive
          </Link>

          <header className="border-2 border-border mb-6 overflow-hidden">
            <div className="border-b-2 border-border px-3 sm:px-5 py-2 flex items-center justify-between bg-muted">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                case_study.md
              </span>
              <span className="inline-flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {project.date}
              </span>
            </div>

            <div className="relative aspect-[16/7] border-b-2 border-border">
              <Image
                src={project.image}
                alt={`${project.title} screenshot`}
                fill
                sizes="(min-width: 1024px) 960px, 100vw"
                className="object-cover grayscale contrast-125"
                priority
              />
            </div>

            <div className="p-4 sm:p-6 lg:p-7">
              <h1 className="text-3xl sm:text-5xl font-bold leading-[0.95] tracking-tight text-foreground mb-4">
                {project.title}
              </h1>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-3xl">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-border bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex gap-2">
                {project.links?.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    <Github className="h-3.5 w-3.5" />
                    src
                  </a>
                )}
                {project.links?.website && (
                  <a
                    href={project.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    live
                  </a>
                )}
              </div>
            </div>
          </header>
        </FadeIn>

        {caseStudy ? (
          <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
            <div className="min-w-0 space-y-5">
              <FadeIn delay={0.08}>
                <section className="border-2 border-border">
                  <div className="border-b-2 border-border bg-muted px-4 py-2 flex items-center gap-2">
                    <Target className="h-3.5 w-3.5 text-accent" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      problem
                    </span>
                  </div>
                  <p className="p-4 sm:p-5 text-sm leading-relaxed text-muted-foreground">
                    {caseStudy.problem}
                  </p>
                </section>
              </FadeIn>

              <FadeIn delay={0.12}>
                <section className="border-2 border-border">
                  <div className="border-b-2 border-border bg-muted px-4 py-2 flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-accent" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      architecture decisions
                    </span>
                  </div>
                  <ul className="p-4 sm:p-5 space-y-3">
                    {caseStudy.architecture.map((point, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                        <span className="shrink-0 font-mono text-[10px] text-accent mt-1">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </section>
              </FadeIn>

              <FadeIn delay={0.16}>
                <section className="border-2 border-border">
                  <div className="border-b-2 border-border bg-muted px-4 py-2 flex items-center gap-2">
                    <Wrench className="h-3.5 w-3.5 text-accent" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      my contribution
                    </span>
                  </div>
                  <p className="p-4 sm:p-5 text-sm leading-relaxed text-muted-foreground">
                    {caseStudy.contribution}
                  </p>
                </section>
              </FadeIn>
            </div>

            <FadeIn direction="left" delay={0.1} className="lg:sticky lg:top-6 lg:self-start">
              <aside className="border-2 border-border">
                <div className="border-b-2 border-border bg-muted px-3 py-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    metrics
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  {caseStudy.metrics.map((metric, i) => (
                    <div key={i} className="border border-border bg-card px-3 py-2.5">
                      <p className="font-mono text-[11px] leading-relaxed text-foreground">{metric}</p>
                    </div>
                  ))}
                </div>
              </aside>
            </FadeIn>
          </div>
        ) : null}

        {otherProjects.length > 0 && (
          <FadeIn delay={0.2}>
            <section className="mt-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                other builds
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {otherProjects.map((p) => (
                  <Link
                    key={p.title}
                    href={`/projects/${slugify(p.title)}`}
                    className="group border-2 border-border bg-card p-4 transition-colors hover:border-foreground/50"
                  >
                    <h3 className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground">{p.date}</p>
                  </Link>
                ))}
              </div>
            </section>
          </FadeIn>
        )}
      </div>
    </main>
  );
}
