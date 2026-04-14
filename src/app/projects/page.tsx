import { getAllProjects } from "@/lib/mdx";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProjectRow from "@/components/ui/ProjectRow";

export const metadata = {
  title: "Projects",
  description: "Design and development case studies by Adrià Compte — product design, design systems, and creative coding.",
  alternates: { canonical: "https://adriacompte.com/projects" },
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="min-h-screen pt-32">
      <div className="px-8">
        <ScrollReveal>
          <h1 className="font-display text-[clamp(3rem,8vw,6rem)] tracking-tighter mb-20">
            Projects
          </h1>
        </ScrollReveal>
      </div>
      <div>
        {projects.map((project, i) => (
          <ScrollReveal
            key={project.slug}
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}
          >
            <ProjectRow
              slug={project.slug}
              title={project.title}
              description={project.description}
              tags={project.tags}
              date={project.date}
              index={i}
            />
          </ScrollReveal>
        ))}
        <div className="h-px bg-white/[0.08]" />
      </div>
    </main>
  );
}
