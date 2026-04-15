import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects");

export type ProjectFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  cover: string;
  coverCaption?: string;
  color: string;
  featured: boolean;
  slug: string;
};

export function getProjectSlugs(): string[] {
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getProjectBySlug(slug: string): {
  frontmatter: ProjectFrontmatter;
  content: string;
} {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  return {
    frontmatter: { ...data, slug } as ProjectFrontmatter,
    content,
  };
}

export function getAllProjects(): ProjectFrontmatter[] {
  return getProjectSlugs()
    .map((slug) => getProjectBySlug(slug).frontmatter)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getFeaturedProjects(): ProjectFrontmatter[] {
  return getAllProjects().filter((p) => p.featured);
}
