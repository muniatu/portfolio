# Portfolio Modernization - Design Spec

## Overview

Modernize Adria Compte's portfolio from a React 16 CRA app to a Next.js 15 App Router application. The site serves as a designer and creative coder's portfolio with an integrated photography gallery. The editorial homepage mixes featured projects and photography into a curated visual feed.

Deployed on Vercel at adriacompte.com (migrated from GitHub Pages).

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, React Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Content | MDX via `next-mdx-remote` (case studies), JSON (photography) |
| Animation | GSAP + ScrollTrigger (scroll, timelines, creative effects) |
| Page transitions | Framer Motion (AnimatePresence) |
| Creative coding | React Three Fiber (R3F) + drei |
| Images | Next.js `<Image>`, local files, Vercel image optimization |
| Deployment | Vercel |

## Project Structure

```
portfolio/
├── public/
│   └── images/
│       ├── projects/              # case study images by project slug
│       └── photography/           # photo gallery images by collection
├── src/
│   ├── app/
│   │   ├── layout.tsx             # root layout (nav, fonts, theme)
│   │   ├── template.tsx           # Framer Motion page transition wrapper
│   │   ├── page.tsx               # editorial homepage
│   │   ├── projects/
│   │   │   ├── page.tsx           # projects listing grid
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # individual case study (MDX)
│   │   ├── photography/
│   │   │   ├── page.tsx           # main gallery (all photos + tag filters)
│   │   │   └── [collection]/
│   │   │       └── page.tsx       # single collection view
│   │   └── about/
│   │       └── page.tsx           # bio, contact, links
│   ├── components/
│   │   ├── ui/                    # shared UI components
│   │   ├── canvas/                # R3F/Three.js components
│   │   │   ├── Canvas.tsx         # lazy-loaded wrapper (dynamic, ssr: false)
│   │   │   ├── sketches/          # individual creative pieces
│   │   │   └── helpers/           # shared shaders, geometries, utilities
│   │   └── mdx/                   # custom MDX components (ProjectImage, BeforeAfter, etc.)
│   ├── content/
│   │   ├── projects/              # MDX case study files
│   │   │   ├── solojuegos.mdx
│   │   │   ├── filehippo.mdx
│   │   │   ├── tokoro.mdx
│   │   │   ├── flapimas.mdx
│   │   │   └── softonic-design-system.mdx
│   │   └── photography/
│   │       └── collections.json   # photo metadata, collections, tags
│   ├── lib/
│   │   ├── mdx.ts                 # MDX loading/parsing utilities
│   │   └── photography.ts         # gallery data helpers
│   └── styles/
│       └── globals.css            # Tailwind imports + custom properties
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

## Content Architecture

### Case Studies (MDX)

Each project is an `.mdx` file in `src/content/projects/` with frontmatter:

```mdx
---
title: "Solojuegos"
description: "Gaming platform redesign for Softonic"
date: "2020-01"
tags: ["product-design", "design-system"]
cover: "/images/projects/solojuegos/cover.jpg"
color: "#00B83F"
featured: true
---

Narrative content with markdown...

<ProjectImage src="/images/projects/solojuegos/home.jpg" alt="Home redesign" />
<BeforeAfter before="old.jpg" after="new.jpg" />
```

Frontmatter fields:
- `title`: project name
- `description`: short summary
- `date`: year-month string for ordering
- `tags`: array of category tags
- `cover`: path to cover image
- `color`: project accent color (hex)
- `featured`: boolean, controls homepage inclusion

### Photography (JSON + local images)

`src/content/photography/collections.json`:

```json
{
  "collections": [
    {
      "slug": "barcelona",
      "title": "Barcelona",
      "cover": "/images/photography/barcelona/01.jpg",
      "photos": [
        {
          "src": "/images/photography/barcelona/01.jpg",
          "alt": "Gothic Quarter at dusk",
          "tags": ["street", "architecture"],
          "exif": { "camera": "...", "lens": "..." }
        }
      ]
    }
  ]
}
```

- Main gallery page aggregates all photos across collections, filterable by tags
- Each collection has its own route
- EXIF metadata display is optional per photo

## Routes & Pages

| Route | Type | Description |
|---|---|---|
| `/` | Server component | Editorial homepage - curated feed of featured projects + photography. Order controlled by a config array. |
| `/projects` | Server component | Grid of all case studies, pulled from MDX frontmatter. |
| `/projects/[slug]` | Server component | Individual case study. MDX rendered with custom components. |
| `/photography` | Client component | Full photo gallery with tag filtering. Masonry/grid layout. |
| `/photography/[collection]` | Server + Client | Collection view. Metadata server-rendered, gallery interaction client-side. |
| `/about` | Server component | Bio, contact info, links. |

## Navigation

- Minimal persistent nav: logo/name + Projects, Photography, About
- Stays unobtrusive - content is the focus
- Mobile: hamburger or slide-out menu

## Animation & Transitions

### Page Transitions (Framer Motion)

- `template.tsx` at the app root wraps page content in `<AnimatePresence>`
- Handles mount/unmount animations on route changes
- Default: crossfade. Can be customized per route.

### Scroll & Creative Animations (GSAP)

- GSAP + ScrollTrigger for scroll-driven animations, pinning, timeline choreography
- Used across: homepage feed reveals, case study scroll narratives, gallery entrance effects
- Registered as client-side only via `useEffect` / `useLayoutEffect`

### Coexistence

GSAP handles scroll and timeline animations. Framer Motion handles page transitions (AnimatePresence). They operate on different concerns and coexist without conflict.

## Creative Coding (R3F)

- `Canvas.tsx`: shared wrapper, lazy-loaded via `next/dynamic` with `ssr: false`, wrapped in `<Suspense>`
- Individual sketches in `src/components/canvas/sketches/` - self-contained R3F scenes
- Shared helpers (shaders, geometries) in `src/components/canvas/helpers/`
- Integration points: homepage hero, per-project canvas elements, standalone experiments
- Three.js bundle only loads on routes that import a canvas component

## Images

- All images stored locally in `public/images/`
- Next.js `<Image>` component for automatic optimization (responsive sizes, WebP/AVIF, lazy loading)
- Vercel handles image optimization at the edge
- Existing Cloudinary images to be downloaded to local during migration

## Migration Plan

### What we keep
- All existing content (case study text, project descriptions)
- Dark theme direction and project accent colors
- Existing images (downloaded from Cloudinary to local)

### What we replace
- React 16 CRA → Next.js 15 App Router
- React Router → file-based routing
- SCSS + BEM utilities → Tailwind CSS v4
- animate.css + react-reveal + react-animate-on-scroll → GSAP + Framer Motion
- Cloudinary React → Next.js `<Image>`
- JavaScript → TypeScript
- node-sass → removed
- gh-pages → Vercel

### What we add
- MDX content pipeline
- Photography gallery (collections, tags, filtering)
- R3F creative coding foundation
- GSAP ScrollTrigger animations
- Framer Motion page transitions
- TypeScript

### Deployment transition
- Existing site stays live on GitHub Pages until the new Vercel deployment is ready
- When ready, point adriacompte.com DNS to Vercel
- Zero downtime migration
