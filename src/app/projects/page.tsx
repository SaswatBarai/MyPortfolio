import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Code2, ExternalLink, Github, Layers } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { projects } from "@/lib/projects";
import { slugify } from "@/lib/utils";

export const metadata = {
  title: "Projects",
  description: "Selected software projects by Saswat Barai.",
};

export default function ProjectsPage() {
  const featuredProject = projects[0];
  const archiveProjects = projects.slice(1);
  const stack = Array.from(new Set(projects.flatMap((project) => project.tags))).slice(0, 14);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
        <FadeIn>
          <header className="border-2 border-border mb-5 sm:mb-6 transition-colors duration-300 hover:border-foreground/40">
            <div className="border-b-2 border-border px-3 sm:px-5 py-2 flex items-center justify-between bg-muted">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors duration-300 hover:text-foreground">
                project_archive.json
              </span>
              <span className="inline-flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                <span className="h-1.5 w-1.5 bg-accent project-pulse" />
                {projects.length} items
              </span>
            </div>
            <div className="p-4 sm:p-6 lg:p-7">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors mb-5"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    back home
                  </Link>
                  <p className="font-mono text-[10px] sm:text-xs text-accent uppercase tracking-widest mb-2">
                    backend systems / realtime apps / product interfaces
                  </p>
                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-foreground leading-[0.9] tracking-tight">
                    Project
                    <br />
                    Archive
                  </h1>
                </div>

                <div className="grid grid-cols-3 border-2 border-border md:w-[320px] transition-transform duration-300 hover:-translate-y-1">
                  <div className="p-3 border-r-2 border-border transition-colors duration-300 hover:bg-muted">
                    <span className="block font-mono text-2xl font-bold text-foreground">
                      {projects.length}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      builds
                    </span>
                  </div>
                  <div className="p-3 border-r-2 border-border transition-colors duration-300 hover:bg-muted">
                    <span className="block font-mono text-2xl font-bold text-foreground">
                      {stack.length}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      tools
                    </span>
                  </div>
                  <div className="p-3 transition-colors duration-300 hover:bg-muted">
                    <span className="block font-mono text-2xl font-bold text-accent">
                      02
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      focus
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>
        </FadeIn>

        <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
          <div className="min-w-0 space-y-5">
            <FadeIn delay={0.08}>
              <article className="group border-2 border-border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-foreground/50 hover:shadow-[8px_8px_0_0_var(--accent)]">
                <div className="grid md:grid-cols-[1.05fr_0.95fr]">
                  <div className="relative min-h-[260px] border-b-2 border-border md:border-b-0 md:border-r-2">
                    <Image
                      src={featuredProject.image}
                      alt={featuredProject.title}
                      fill
                      sizes="(min-width: 1024px) 480px, 100vw"
                      className="object-cover grayscale contrast-125 transition duration-500 group-hover:grayscale-0"
                      priority
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-accent/20 to-transparent project-scan" />
                    <div className="absolute left-3 top-3 border border-border bg-background/85 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-accent backdrop-blur project-float">
                      featured
                    </div>
                  </div>

                  <div className="flex flex-col p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
                      <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 text-accent" />
                        {featuredProject.date}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        01/{String(projects.length).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="py-4 sm:py-5">
                      <Link href={`/projects/${slugify(featuredProject.title)}`}>
                        <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-foreground hover:text-accent transition-colors">
                          {featuredProject.title}
                        </h2>
                      </Link>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {featuredProject.description}
                      </p>
                    </div>

                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-1.5 pb-4">
                        {featuredProject.tags.map((tag) => (
                          <span
                            key={tag}
                            className="border border-border bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2 border-t border-border pt-4">
                        <Link
                          href={`/projects/${slugify(featuredProject.title)}`}
                          className="inline-flex items-center gap-2 border border-accent bg-accent/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-accent transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground"
                        >
                          case study
                        </Link>
                        {featuredProject.links?.github && (
                          <a
                            href={featuredProject.links.github}
                            className="inline-flex items-center gap-2 border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground hover:text-foreground"
                          >
                            <Github className="h-3.5 w-3.5" />
                            src
                          </a>
                        )}
                        {featuredProject.links?.website && (
                          <a
                            href={featuredProject.links.website}
                            className="inline-flex items-center gap-2 border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            live
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </FadeIn>

            <section className="grid gap-3 md:grid-cols-2">
              {archiveProjects.map((project, index) => (
                <FadeIn key={project.title} delay={0.14 + index * 0.06}>
                  <Link href={`/projects/${slugify(project.title)}`} className="block h-full">
                  <article className="group h-full border-2 border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-foreground/50 hover:shadow-[5px_5px_0_0_var(--accent)]">
                    <div className="relative aspect-[16/9] border-b-2 border-border overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover grayscale transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                      />
                      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-accent/15 to-transparent opacity-0 group-hover:opacity-100 project-scan" />
                      <span className="absolute left-3 top-3 bg-background/85 px-2 py-1 font-mono text-[10px] text-muted-foreground backdrop-blur">
                        {String(index + 2).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h2 className="text-lg font-bold leading-tight text-foreground">
                          {project.title}
                        </h2>
                        <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                          {project.date}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {project.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                  </Link>
                </FadeIn>
              ))}
            </section>
          </div>

          <FadeIn direction="left" delay={0.12} className="lg:sticky lg:top-6 lg:self-start">
            <aside className="border-2 border-border transition-colors duration-300 hover:border-foreground/40">
              <div className="border-b-2 border-border bg-muted px-3 py-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  stack_index
                </span>
              </div>
              <div className="p-4">
                <div className="mb-5 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-accent" />
                  <h2 className="font-mono text-xs uppercase tracking-widest text-foreground">
                    Core tools
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {stack.map((tag) => (
                    <span
                      key={tag}
                      className="border border-border bg-card px-2 py-1 font-mono text-[10px] text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t-2 border-border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-accent" />
                  <h2 className="font-mono text-xs uppercase tracking-widest text-foreground">
                    Build lens
                  </h2>
                </div>
                <div className="space-y-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
                  <p>01. Scalable backend systems</p>
                  <p>02. Realtime product workflows</p>
                  <p>03. Clean interface implementation</p>
                </div>
              </div>
            </aside>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
