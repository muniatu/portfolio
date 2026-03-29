import Link from "next/link";
import Image from "next/image";
import { getAllProjects } from "@/lib/mdx";

export const metadata = {
  title: "Projects",
  description: "Design and development case studies by Adria Compte",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="min-h-screen pt-28 px-8 pb-16">
      <h1 className="text-5xl font-bold mb-16">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group block"
          >
            <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
              <Image
                src={project.cover}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h2 className="text-2xl font-bold mb-1">{project.title}</h2>
            <p className="text-white/60">{project.description}</p>
            <div className="flex gap-2 mt-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
