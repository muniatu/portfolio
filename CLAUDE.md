# Portfolio - Adria Compte

Designer, creative coder, and amateur photographer.

## Tech Stack

- **Framework:** Next.js 15 (App Router, React Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Content:** MDX via `next-mdx-remote` (case studies), JSON (photography)
- **Animation:** GSAP + ScrollTrigger (scroll, timelines, creative effects), Framer Motion (page transitions only)
- **Creative coding:** React Three Fiber (R3F) + drei, lazy-loaded per route
- **Images:** Next.js `<Image>`, local files in `public/images/`, Vercel optimization
- **Deployment:** Vercel (adriacompte.com)

## Project Structure

- `src/app/` - App Router pages and layouts
- `src/components/ui/` - shared UI components
- `src/components/canvas/` - R3F/Three.js (Canvas.tsx wrapper, sketches/, helpers/)
- `src/components/mdx/` - custom MDX components (ProjectImage, BeforeAfter, etc.)
- `src/content/projects/` - MDX case study files with frontmatter
- `src/content/photography/collections.json` - photo metadata and collections
- `src/lib/` - utilities (mdx.ts, photography.ts)
- `public/images/projects/` - case study images by slug
- `public/images/photography/` - gallery images by collection

## Key Decisions

- GSAP for scroll/timeline animations, Framer Motion only for page transitions (AnimatePresence in template.tsx)
- R3F components are always lazy-loaded with `next/dynamic` + `ssr: false`
- Photography gallery: collections + tag filtering, main gallery aggregates all photos
- Homepage is an editorial feed mixing featured projects and photography
- Server components by default; client components only where interactivity is needed
- Dark theme with per-project accent colors

## Design Spec

Full spec at `docs/superpowers/specs/2026-03-29-portfolio-modernization-design.md`
