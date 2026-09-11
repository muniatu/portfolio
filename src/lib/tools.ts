export type ToolCategory = "Design tool" | "Generative" | "Utility" | "Toy";

export type Tool = {
  slug: string;
  name: string;
  blurb: string;
  href: string;
  category: ToolCategory;
  year: string;
  external?: boolean;
};

export const tools: Tool[] = [
  {
    slug: "icon-stroke-lab",
    name: "Icon Stroke Lab",
    blurb:
      "Pixel-accurate benchmark for SVG icons. Drop a set in, magnify each rendering at true device resolution, and see which strokes survive at 16px.",
    href: "/tools/icon-stroke-lab/",
    category: "Design tool",
    year: "2026",
  },
];

export function getTools(): Tool[] {
  return [...tools].sort((a, b) => b.year.localeCompare(a.year));
}

export function getFeaturedTools(limit = 3): Tool[] {
  return getTools().slice(0, limit);
}
