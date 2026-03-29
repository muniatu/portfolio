# Portfolio Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the portfolio from React 16 CRA to Next.js 15 App Router with TypeScript, Tailwind v4, GSAP, Framer Motion, R3F, MDX content, and a photography gallery system.

**Architecture:** Next.js 15 App Router with React Server Components. Content lives as MDX files (projects) and JSON (photography). GSAP + ScrollTrigger for scroll/creative animations, Framer Motion for page transitions, R3F lazy-loaded for creative coding. Deployed on Vercel.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, next-mdx-remote, GSAP, Framer Motion, React Three Fiber, drei

---

## File Structure

```
portfolio/
├── public/
│   └── images/
│       ├── projects/           # case study images (migrated from Cloudinary)
│       └── photography/        # gallery images by collection
├── src/
│   ├── app/
│   │   ├── layout.tsx          # root layout: fonts, nav, metadata, global styles
│   │   ├── template.tsx        # Framer Motion AnimatePresence wrapper
│   │   ├── page.tsx            # editorial homepage
│   │   ├── projects/
│   │   │   ├── page.tsx        # projects listing grid
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # individual case study (MDX rendered)
│   │   ├── photography/
│   │   │   ├── page.tsx        # main gallery with tag filtering
│   │   │   └── [collection]/
│   │   │       └── page.tsx    # single collection view
│   │   └── about/
│   │       └── page.tsx        # bio and contact
│   ├── components/
│   │   ├── ui/
│   │   │   └── Nav.tsx         # navigation component
│   │   ├── canvas/
│   │   │   ├── Canvas.tsx      # lazy-loaded R3F wrapper
│   │   │   ├── sketches/
│   │   │   │   └── HeroScene.tsx  # placeholder hero scene
│   │   │   └── helpers/        # shared shaders/utils (empty initially)
│   │   └── mdx/
│   │       ├── index.tsx       # MDX component registry
│   │       └── ProjectImage.tsx # image component for case studies
│   ├── content/
│   │   ├── projects/
│   │   │   ├── solojuegos.mdx
│   │   │   ├── filehippo.mdx
│   │   │   ├── tokoro.mdx
│   │   │   ├── flapimas.mdx
│   │   │   └── softonic-design-system.mdx
│   │   └── photography/
│   │       └── collections.json
│   ├── lib/
│   │   ├── mdx.ts              # MDX loading/parsing utilities
│   │   └── photography.ts     # gallery data helpers
│   └── styles/
│       └── globals.css         # Tailwind imports + custom properties
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Task 1: Initialize Next.js 15 Project

**Files:**
- Create: `package.json` (overwrite), `next.config.ts`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/styles/globals.css`, `tailwind.config.ts`
- Delete: `src/index.js`, `src/index.scss`, `src/config.scss`, `src/monitor.js`, `src/serviceWorker.js`, `src/setupTests.js`, `src/logo.svg`, `public/index.html`, `public/manifest.json`

- [ ] **Step 1: Remove old CRA files**

```bash
rm -f src/index.js src/index.scss src/config.scss src/monitor.js src/serviceWorker.js src/setupTests.js src/logo.svg
rm -f public/index.html public/manifest.json public/logo192.png public/logo512.png
rm -rf src/pages
```

- [ ] **Step 2: Remove old dependencies and install Next.js stack**

```bash
rm -f package.json package-lock.json
```

Create `package.json`:

```json
{
  "name": "portfolio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

```bash
npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/react @types/react-dom @types/node tailwindcss @tailwindcss/postcss postcss eslint eslint-config-next
```

- [ ] **Step 3: Create `next.config.ts`**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: undefined, // Vercel handles this automatically
};

export default nextConfig;
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create `postcss.config.mjs`**

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 6: Create `src/styles/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-background: #212121;
  --color-foreground: #ffffff;
  --color-accent: #00ffbf;
  --color-solojuegos: #00B83F;
  --color-filehippo: #0192DE;
  --color-tokoro: #EA4271;
  --color-flapimas: #ECD401;
  --color-softonic: #00ffbf;

  --font-sans: "Lato", "Helvetica Neue", sans-serif;
  --font-serif: "PT Serif", Georgia, serif;
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection {
  background-color: var(--color-accent);
  color: #000;
}
```

- [ ] **Step 7: Create `tailwind.config.ts`**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 8: Create `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Adria Compte | Designer & Creative Coder",
    template: "%s | Adria Compte",
  },
  description: "Portfolio of Adria Compte - Product Designer, Creative Coder & Photographer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 9: Create `src/app/page.tsx`**

```tsx
export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Adria Compte</h1>
    </main>
  );
}
```

- [ ] **Step 10: Verify the app builds and runs**

```bash
npm run build
```

Expected: Build succeeds with no errors.

```bash
npm run dev
```

Expected: Dev server starts on localhost:3000, shows "Adria Compte" centered on dark background.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 15 project with Tailwind v4 and TypeScript"
```

---

## Task 2: Navigation and Page Transition Framework

**Files:**
- Create: `src/components/ui/Nav.tsx`, `src/app/template.tsx`

- [ ] **Step 1: Install Framer Motion**

```bash
npm install framer-motion
```

- [ ] **Step 2: Create `src/components/ui/Nav.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/photography", label: "Photography" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
      <Link href="/" className="text-lg font-bold tracking-tight">
        Adria Compte
      </Link>
      <ul className="flex gap-8">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`text-sm transition-colors hover:text-[var(--color-accent)] ${
                pathname.startsWith(href)
                  ? "text-[var(--color-accent)]"
                  : "text-white/70"
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 3: Create `src/app/template.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Add Nav to root layout**

Update `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import Nav from "@/components/ui/Nav";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Adria Compte | Designer & Creative Coder",
    template: "%s | Adria Compte",
  },
  description: "Portfolio of Adria Compte - Product Designer, Creative Coder & Photographer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify navigation renders and page transitions work**

```bash
npm run build
```

Expected: Build succeeds. Nav appears on the page. Navigating between routes shows a fade transition.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/Nav.tsx src/app/template.tsx src/app/layout.tsx package.json package-lock.json
git commit -m "feat: add navigation and Framer Motion page transitions"
```

---

## Task 3: MDX Content Pipeline

**Files:**
- Create: `src/lib/mdx.ts`, `src/components/mdx/index.tsx`, `src/components/mdx/ProjectImage.tsx`
- Create: `src/content/projects/solojuegos.mdx`, `src/content/projects/filehippo.mdx`, `src/content/projects/tokoro.mdx`, `src/content/projects/flapimas.mdx`, `src/content/projects/softonic-design-system.mdx`

- [ ] **Step 1: Install MDX dependencies**

```bash
npm install next-mdx-remote gray-matter
npm install -D @types/mdx
```

- [ ] **Step 2: Create `src/lib/mdx.ts`**

```typescript
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
```

- [ ] **Step 3: Create `src/components/mdx/ProjectImage.tsx`**

```tsx
import Image from "next/image";

type ProjectImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export default function ProjectImage({
  src,
  alt,
  width = 900,
  height = 600,
}: ProjectImageProps) {
  return (
    <figure className="my-12">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full rounded-lg"
      />
    </figure>
  );
}
```

- [ ] **Step 4: Create `src/components/mdx/index.tsx`**

```tsx
import type { MDXComponents } from "mdx/types";
import ProjectImage from "./ProjectImage";

export const mdxComponents: MDXComponents = {
  ProjectImage,
};
```

- [ ] **Step 5: Create `src/content/projects/solojuegos.mdx`**

```mdx
---
title: "Solojuegos Redesign"
description: "Market research and design concepts for a gaming platform"
date: "2020-04"
tags: ["product-design", "market-research"]
cover: "/images/projects/solojuegos/solojuegos-home.jpg"
color: "#00B83F"
featured: true
---

## Market Research and Design Concepts

One of Softonic's biggest sources of organic traffic is free videogame downloads, through an extensive survey on the website, we identified a huge demographic of young users looking for gaming content, especially free games.

Currently, users looking for games land in the same funnel as any other user looking for software and it feels like a specific experience for gaming would make a lot of sense, so I decided to work on a concept for solojuegos.com and ongames.com, domains owned by Softonic that currently are not being used. The theme was free-to-play games.

The idea is to have a better showcase for all the information related to games that we already have on our site. Including news, guides, game offers, free downloads and even free online games. During the past years, the free-to-play market has seen great expansion and for example, one of the most visited pages in softonic.com during 2019 was the Apex Legends program page.

Providing a better experience to these types of users could potentially lead to better engagement and the ability to specifically work in a market focused on affiliation, a side of the business Softonic is trying to have more presence on.

<ProjectImage src="/images/projects/solojuegos/solojuegos-home.jpg" alt="Solojuegos home page" />

<ProjectImage src="/images/projects/solojuegos/solojuegos-article.jpg" alt="Solojuegos article page" />

<ProjectImage src="/images/projects/solojuegos/solojuegos-category.jpg" alt="Solojuegos category page" />

<ProjectImage src="/images/projects/solojuegos/solojuegos-app-page.jpg" alt="Solojuegos game page" />

<ProjectImage src="/images/projects/solojuegos/solojuegos-hardware.jpg" alt="Solojuegos hardware page" />
```

- [ ] **Step 6: Create `src/content/projects/filehippo.mdx`**

```mdx
---
title: "Filehippo Redesign"
description: "Design concepts for Softonic's FileHippo brand"
date: "2020-04"
tags: ["product-design", "branding"]
cover: "/images/projects/filehippo/filehippo-concept.jpg"
color: "#0192DE"
featured: true
---

## Design Concepts

FileHippo is part of the Softonic's product family and our Product Design team was asked to deliver a few design concepts to showcase how we could work on improving the overall look and feel of the website.

The majority of the elements, monetization model and data structure is very similar to softonic.com, so to me, it felt like the perfect chance to try a different approach to all I had been working on during the previous months.

My aim was to try a layout approach similar to the one that can be seen in apkpure.com, one of our direct competitors which is more focused on mobile, as mobile has always been one of the pain points of Softonic's websites.

In the end, I used the same design with two different brandings to see how it would fit, and although the available budget at that moment didn't allow us to explore further on the concept, these mockups were used later on as inspiration to revise softonic.com's design system in order to transition from an adaptive website to a responsive ecosystem.

<ProjectImage src="/images/projects/filehippo/filehippo-concept.jpg" alt="Filehippo design concept" />

<ProjectImage src="/images/projects/filehippo/softonic-concept.jpg" alt="Softonic design concept" />
```

- [ ] **Step 7: Create `src/content/projects/tokoro.mdx`**

```mdx
---
title: "Tokoro"
description: "Branding and design concepts for a location sharing app"
date: "2020-03"
tags: ["branding", "mobile-design", "side-project"]
cover: "/images/projects/tokoro/tokoro-branding.jpg"
color: "#EA4271"
featured: true
---

## Branding & Design Concepts

While working in the tech industry it's easy to come up with new ideas for websites or applications and start side projects that might be never finished. This is an example of one of those projects.

Tokoro means place in Japanese, this app intended to be a friendly way to share your favourite places in the cities you visited or lived in. Very similar to what mapstr does.

I started this project with a couple of friends and as I liked the concept and enjoyed the process of designing it, came up with a name, made the initial Branding and created some high fidelity mockups to try to start a new design system from scratch on my own.

Here are some screenshots of what the app intended to be and how I thought the interactions might take place. There wasn't any extensive user research done but it's based on tripadvisor and mapstr, similar projects that already exist.

<ProjectImage src="/images/projects/tokoro/tokoro-branding.jpg" alt="Tokoro branding" />

<ProjectImage src="/images/projects/tokoro/tokoro-login.jpg" alt="Tokoro login screen" />

<ProjectImage src="/images/projects/tokoro/tokoro-login-2.jpg" alt="Tokoro login second step" />

<ProjectImage src="/images/projects/tokoro/tokoro-login-3.jpg" alt="Tokoro login third step" />

<ProjectImage src="/images/projects/tokoro/tokoro-home.jpg" alt="Tokoro home page" />

<ProjectImage src="/images/projects/tokoro/tokoro-home-2.jpg" alt="Tokoro home page extended" />

<ProjectImage src="/images/projects/tokoro/tokoro-map.jpg" alt="Tokoro map" />

<ProjectImage src="/images/projects/tokoro/tokoro-map-2.jpg" alt="Tokoro map extended" />

<ProjectImage src="/images/projects/tokoro/tokoro-acitivty-feed.jpg" alt="Tokoro activity feed" />

<ProjectImage src="/images/projects/tokoro/tokoro-profile.jpg" alt="Tokoro profile page" />
```

- [ ] **Step 8: Create `src/content/projects/flapimas.mdx`**

```mdx
---
title: "Flapimas"
description: "Game design and development - a Flappy Bird political satire"
date: "2014-06"
tags: ["game-design", "unity", "side-project"]
cover: "/images/projects/flapimas/flapimas-screen-1.jpg"
color: "#ECD401"
featured: false
---

## Game Design & Development

I made this project in 2014 just for fun as way to learn how to create a game in Unity and publish my first app in the Google Play Store.

It's basically a Flappy Bird clone where the protagonist is the former Catalan president Artur Mas trying to escape from Spain. An ironic view of the Catalan independence process. As a curiosity, the game is pretty frustrating and never ends, similar to the Spanish political conflict.

After I published it I didn't go for any further development but the game was featured in a few local news sites, radio and even TV. It's still available on the Google Play Store, feel free to try it!

<ProjectImage src="/images/projects/flapimas/flapimas-screen-1.jpg" alt="Flapimas home screen" />

<ProjectImage src="/images/projects/flapimas/flapimas-screen-2.jpg" alt="Flapimas tutorial" />

<ProjectImage src="/images/projects/flapimas/flapimas-screen-3.jpg" alt="Flapimas in-game" />

<ProjectImage src="/images/projects/flapimas/flapimas-screen-4.jpg" alt="Flapimas game over" />
```

- [ ] **Step 9: Create `src/content/projects/softonic-design-system.mdx`**

```mdx
---
title: "Softonic Design System"
description: "Building a design system for Softonic's product family"
date: "2019-06"
tags: ["design-system", "product-design", "frontend"]
cover: "/images/projects/softonic-design-system/design-system-v1.png"
color: "#00ffbf"
featured: true
---

## Introduction

After accumulating years of legacy design, softonic.com had an evident lack of consistency across the numerous UI components and it was clearly affecting the appearance of the website, delaying design and harming development time.

The product design team rarely was working as a whole, each member was enrolled in a different agile team and even though sometimes they were working on the same project (softonic.com), there was a fair lack of communication, each product manager's desire to test new features, as fast as possible, had developers deploying new components without even checking with the design team.

## Goals

I joined Softonic's product design team just when they had decided to put an end to this and start building their own design system. The business was going well but the effort had to be justified on the business side, so we set the following goals:

1. Build strong channels of communication between designers.
2. Bring consistency to the design of our products.
3. Have a shared vocabulary with developers and more accurate hand-offs.
4. Decrease time to market for new features.

As nobody in the team had worked on the development of a design system before, in each step of the way, we had to do some research. After a fair amount of discussion we decided to go with the book *Design Systems: A practical guide to creating design languages for digital products* by Alla Kholmatova, as our bible.

## Parameters of the System

We used the sets of rules as described in the book: strictness, modularity and distribution, in order to understand better what were the needs of our team and the company itself.

**Strict vs loose:**
- We were taking our first steps with a design system so we needed to be flexible.
- We should be able to create new components based on stakeholder needs in an agile way.
- The system should become more strict as it matures.

**Modularity vs integrated:**
- We need to be agile and have different teams working in parallel.
- We will have to reuse components for different purposes.
- It has to be relatively easy to maintain.
- We have to be able to apply different patterns in order to test conversion as fast as possible.

**Centralized vs distributed:**
- Our team is small and centralized.
- We define the patterns and rules.
- We manage the assets and the tools to store them.

## Start of the Design Process

The first steps of the design process started as a way to keep the cohesion of the Product Design Team, given each member was working in a different squad, it was a way to get together, align our vision and work towards a common goal. Each member had their duties defined by a product manager but we reserved some time to work on components individually.

Luckily for us, four of our six designers were also front-end developers, so as the development team was migrating the old components in *Nunjucks* to *Marko.js* we decided to conduct an interface inventory following the process that explains *Brad Frost* in one of his posts. In a small amount of time, we discovered a lot more inconsistencies than we expected.

At this point, we were ready to start working with Sketch and creating all the symbols. For most of us, it was a new experience, certainly time-consuming and sometimes even frustrating, but totally worth it.

As our library was growing we realized we needed a proper naming system for our symbols, so we decided to adopt something similar to BEM. This way we had similar structures to what we can see in front-end development and shared a common language. Proper layering and defining the right symbol overrides was also a big challenge.

<ProjectImage src="/images/projects/softonic-design-system/design-system-v1.png" alt="Softonic Design System v1" />

## Version Control

The Product Design team had been using brand.ai (acquired by InVision later on) to store our design tokens and Google Drive to keep all the Sketch files, project screenshots and documentation about research, but we really struggled to have everything in sync, and most of the time, if one member of the team was missing for any reason, nobody could follow up on their work because files weren't updated properly. At some point we realized that something wasn't working and we had to find a solution.

I was assigned to find a new tool to keep the designs available for everyone at all times and have them as updated as possible. After testing, reviewing, and presenting the benefits and drawbacks of tools such as Abstract, Plant, Kactus, Versions by Sympli or even raw Bitbucket. We decided to go with Versions, as it was free, it linked with our Bitbucket storage, had updates consistently and did exactly what we needed, not less not more. It actually became a game-changer for all of us.

<ProjectImage src="/images/projects/softonic-design-system/versions1.png" alt="Versions version control" />

<ProjectImage src="/images/projects/softonic-design-system/versions2.png" alt="Versions interface" />

## White Labels & Storybook

During 2019 Softonic partnered with Filehippo and Digital Trends to maintain, scale and develop their software download businesses. In Filehippo's case, we mainly refactored all their front-end and added our ad stack, for Digital Trends we created a new product from scratch.

Both of these new products are using *Marko.js*, the same front-end framework as our main product, softonic.com. From the development team arose the need to have a library of components that could be shared between projects, as most of them were practically the same but with different styles. So we started creating a set of agreements and developing the first components using Storybook.

The initial intention was to create agnostic components with common variables and then apply a different theme for each specific product, similar to what IBM Carbon's design system does. The theory sounds great but there wasn't a team exclusively dedicated to this and when different projects are growing at a different pace, in separate teams, with different product needs it becomes really hard to stay on the same page.

By the end of 2019, the company went through some difficulties and the project was semi-abandoned, but we set a really good foundation for the future.

<ProjectImage src="/images/projects/softonic-design-system/softonic-white-label.png" alt="Softonic white label components" />

<ProjectImage src="/images/projects/softonic-design-system/flipo-white-label.png" alt="Filehippo white label components" />

<ProjectImage src="/images/projects/softonic-design-system/dt-white-label.png" alt="Digital Trends white label components" />

## Responsive

From the start of 2020, as Google mobile-first indexing rolled out in September of that year, we started working on the transition from an adaptive website to a fully responsive one. Before this transition, mobile and desktop sites were treated as separate products as the monetization models were quite different in each platform.

Softonic.com relies heavily on SEO so having a responsive site became a priority and a big part of the Product Design Team, working tightly with front-end developers, was put in charge to refactor the layout of all the pages and most of the components of the site. It was the perfect chance to get back to working on the design system and publishing components to Storybook. An end-to-end process where I had a relevant role.
```

- [ ] **Step 10: Verify MDX files parse correctly**

```bash
node -e "
const matter = require('gray-matter');
const fs = require('fs');
const dir = 'src/content/projects';
fs.readdirSync(dir).filter(f => f.endsWith('.mdx')).forEach(f => {
  const { data } = matter(fs.readFileSync(dir + '/' + f, 'utf-8'));
  console.log(data.title, '- OK');
});
"
```

Expected: All 5 project titles print with "- OK".

- [ ] **Step 11: Commit**

```bash
git add src/lib/mdx.ts src/components/mdx/ src/content/projects/
git commit -m "feat: add MDX content pipeline and migrate case study content"
```

---

## Task 4: Project Pages (Listing + Detail)

**Files:**
- Create: `src/app/projects/page.tsx`, `src/app/projects/[slug]/page.tsx`

- [ ] **Step 1: Create `src/app/projects/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `src/app/projects/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getProjectBySlug, getProjectSlugs } from "@/lib/mdx";
import { mdxComponents } from "@/components/mdx";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  try {
    const { frontmatter } = getProjectBySlug(slug);
    return {
      title: frontmatter.title,
      description: frontmatter.description,
    };
  } catch {
    return {};
  }
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;

  let project;
  try {
    project = getProjectBySlug(slug);
  } catch {
    notFound();
  }

  const { frontmatter, content } = project;

  return (
    <main className="min-h-screen pt-28 pb-16">
      <article className="mx-auto max-w-3xl px-8">
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-4">{frontmatter.title}</h1>
          <p className="text-xl text-white/60">{frontmatter.description}</p>
          <div className="flex gap-2 mt-4">
            {frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>
        <div className="prose prose-invert prose-lg max-w-none">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </article>
    </main>
  );
}
```

- [ ] **Step 3: Install Tailwind typography plugin**

```bash
npm install @tailwindcss/typography
```

Update `src/styles/globals.css` to add the plugin import after the tailwindcss import:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-background: #212121;
  --color-foreground: #ffffff;
  --color-accent: #00ffbf;
  --color-solojuegos: #00B83F;
  --color-filehippo: #0192DE;
  --color-tokoro: #EA4271;
  --color-flapimas: #ECD401;
  --color-softonic: #00ffbf;

  --font-sans: "Lato", "Helvetica Neue", sans-serif;
  --font-serif: "PT Serif", Georgia, serif;
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection {
  background-color: var(--color-accent);
  color: #000;
}
```

- [ ] **Step 4: Create placeholder images directory**

```bash
mkdir -p public/images/projects/solojuegos
mkdir -p public/images/projects/filehippo
mkdir -p public/images/projects/tokoro
mkdir -p public/images/projects/flapimas
mkdir -p public/images/projects/softonic-design-system
```

Note: actual images will be downloaded from Cloudinary separately. For now the pages will render with broken images, which is expected.

- [ ] **Step 5: Verify build and routes**

```bash
npm run build
```

Expected: Build succeeds. `/projects` route lists all 5 projects. `/projects/solojuegos` renders the MDX content.

- [ ] **Step 6: Commit**

```bash
git add src/app/projects/ src/styles/globals.css public/images/projects/ package.json package-lock.json
git commit -m "feat: add project listing and detail pages with MDX rendering"
```

---

## Task 5: Photography Gallery System

**Files:**
- Create: `src/content/photography/collections.json`, `src/lib/photography.ts`, `src/app/photography/page.tsx`, `src/app/photography/[collection]/page.tsx`

- [ ] **Step 1: Create `src/content/photography/collections.json`**

```json
{
  "collections": [
    {
      "slug": "sample",
      "title": "Sample Collection",
      "description": "A sample photography collection",
      "cover": "/images/photography/sample/01.jpg",
      "photos": [
        {
          "src": "/images/photography/sample/01.jpg",
          "alt": "Sample photo",
          "tags": ["sample"]
        }
      ]
    }
  ]
}
```

- [ ] **Step 2: Create `src/lib/photography.ts`**

```typescript
import collectionsData from "@/content/photography/collections.json";

export type Photo = {
  src: string;
  alt: string;
  tags: string[];
  exif?: {
    camera?: string;
    lens?: string;
    aperture?: string;
    shutter?: string;
    iso?: string;
  };
};

export type Collection = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  photos: Photo[];
};

export function getAllCollections(): Collection[] {
  return collectionsData.collections as Collection[];
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return getAllCollections().find((c) => c.slug === slug);
}

export function getAllPhotos(): Photo[] {
  return getAllCollections().flatMap((c) => c.photos);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getAllPhotos().forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

export function getPhotosByTag(tag: string): Photo[] {
  return getAllPhotos().filter((p) => p.tags.includes(tag));
}
```

- [ ] **Step 3: Create `src/app/photography/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getAllCollections,
  getAllPhotos,
  getAllTags,
  getPhotosByTag,
} from "@/lib/photography";

export default function PhotographyPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const collections = getAllCollections();
  const tags = getAllTags();
  const photos = activeTag ? getPhotosByTag(activeTag) : getAllPhotos();

  return (
    <main className="min-h-screen pt-28 px-8 pb-16">
      <h1 className="text-5xl font-bold mb-8">Photography</h1>

      {/* Collections */}
      <section className="mb-16">
        <h2 className="text-sm uppercase tracking-widest text-white/40 mb-6">
          Collections
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/photography/${collection.slug}`}
              className="group flex-shrink-0"
            >
              <div className="relative w-64 aspect-[3/2] overflow-hidden rounded-lg mb-2">
                <Image
                  src={collection.cover}
                  alt={collection.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="font-medium">{collection.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Tag filter */}
      <section className="mb-8">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTag(null)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              activeTag === null
                ? "bg-white text-black"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                activeTag === tag
                  ? "bg-white text-black"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Photo grid */}
      <section className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {photos.map((photo, i) => (
          <div key={`${photo.src}-${i}`} className="mb-4 break-inside-avoid">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={800}
              height={600}
              className="w-full rounded-lg"
            />
          </div>
        ))}
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Create `src/app/photography/[collection]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllCollections, getCollectionBySlug } from "@/lib/photography";

type Params = Promise<{ collection: string }>;

export async function generateStaticParams() {
  return getAllCollections().map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { collection: slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};
  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: { params: Params }) {
  const { collection: slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-28 px-8 pb-16">
      <h1 className="text-5xl font-bold mb-4">{collection.title}</h1>
      <p className="text-white/60 mb-12">{collection.description}</p>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {collection.photos.map((photo, i) => (
          <div key={`${photo.src}-${i}`} className="mb-4 break-inside-avoid">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={800}
              height={600}
              className="w-full rounded-lg"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Create placeholder photography directory**

```bash
mkdir -p public/images/photography/sample
```

- [ ] **Step 6: Verify build**

```bash
npm run build
```

Expected: Build succeeds. `/photography` route renders with collections and tag filtering. `/photography/sample` renders the collection page.

- [ ] **Step 7: Commit**

```bash
git add src/content/photography/ src/lib/photography.ts src/app/photography/ public/images/photography/
git commit -m "feat: add photography gallery with collections and tag filtering"
```

---

## Task 6: About Page and Editorial Homepage

**Files:**
- Create: `src/app/about/page.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/app/about/page.tsx`**

```tsx
export const metadata = {
  title: "About",
  description: "About Adria Compte - Designer, Creative Coder & Photographer",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-28 px-8 pb-16">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold mb-8">About</h1>
        <div className="space-y-6 text-lg text-white/80 leading-relaxed">
          <p>
            Product Designer & Frontend Developer based in Barcelona. I work at
            the intersection of design and code, building digital products with a
            focus on user experience and visual craft.
          </p>
          <p>
            When I'm not designing interfaces, I'm exploring creative coding,
            photography, or building side projects that probably won't ship.
          </p>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Update `src/app/page.tsx` with editorial homepage**

```tsx
import Link from "next/link";
import Image from "next/image";
import { getFeaturedProjects } from "@/lib/mdx";
import { getAllCollections } from "@/lib/photography";

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();
  const collections = getAllCollections();

  return (
    <main className="min-h-screen pt-28 px-8 pb-16">
      {/* Hero */}
      <section className="mb-24">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 max-w-4xl leading-tight">
          Designer &<br />
          Creative Coder
        </h1>
        <p className="text-xl text-white/60 max-w-xl">
          Product design, creative coding, and photography by Adria Compte.
        </p>
      </section>

      {/* Featured Projects */}
      <section className="mb-24">
        <h2 className="text-sm uppercase tracking-widest text-white/40 mb-8">
          Selected Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
          {featuredProjects.map((project) => (
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
              <h3 className="text-2xl font-bold mb-1">{project.title}</h3>
              <p className="text-white/60">{project.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Photography Preview */}
      {collections.length > 0 && (
        <section className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm uppercase tracking-widest text-white/40">
              Photography
            </h2>
            <Link
              href="/photography"
              className="text-sm text-white/40 hover:text-[var(--color-accent)] transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {collections.map((collection) => (
              <Link
                key={collection.slug}
                href={`/photography/${collection.slug}`}
                className="group flex-shrink-0"
              >
                <div className="relative w-80 aspect-[3/2] overflow-hidden rounded-lg mb-2">
                  <Image
                    src={collection.cover}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="font-medium">{collection.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds. Homepage shows hero, featured projects grid, and photography collections preview. `/about` renders the about page.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/about/
git commit -m "feat: add editorial homepage and about page"
```

---

## Task 7: GSAP ScrollTrigger Integration

**Files:**
- Create: `src/components/ui/ScrollReveal.tsx`

- [ ] **Step 1: Install GSAP**

```bash
npm install gsap
```

- [ ] **Step 2: Create `src/components/ui/ScrollReveal.tsx`**

A reusable client component that wraps children with GSAP scroll-triggered animations:

```tsx
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  trigger?: ScrollTrigger.Vars;
};

export default function ScrollReveal({
  children,
  className,
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
  trigger = {},
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() {
    const el = ref.current;
    if (!el) return;

    const tween = gsap.fromTo(el, from, {
      ...to,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
        ...trigger,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds. The ScrollReveal component is available for use across pages.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/ScrollReveal.tsx package.json package-lock.json
git commit -m "feat: add GSAP ScrollTrigger with reusable ScrollReveal component"
```

---

## Task 8: React Three Fiber Foundation

**Files:**
- Create: `src/components/canvas/Canvas.tsx`, `src/components/canvas/sketches/HeroScene.tsx`

- [ ] **Step 1: Install R3F dependencies**

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

- [ ] **Step 2: Create `src/components/canvas/Canvas.tsx`**

```tsx
"use client";

import { Suspense } from "react";
import { Canvas as R3FCanvas } from "@react-three/fiber";

type CanvasProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Canvas({ children, className }: CanvasProps) {
  return (
    <div className={className}>
      <R3FCanvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </R3FCanvas>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/canvas/sketches/HeroScene.tsx`**

A placeholder generative scene to validate the pipeline:

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

export default function HeroScene() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshStandardMaterial
        color="#00ffbf"
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}
```

- [ ] **Step 4: Create a lazy-loaded canvas export for use in pages**

Create `src/components/canvas/index.tsx`:

```tsx
import dynamic from "next/dynamic";

export const LazyCanvas = dynamic(
  () => import("@/components/canvas/Canvas"),
  { ssr: false }
);

export const LazyHeroScene = dynamic(
  () => import("@/components/canvas/sketches/HeroScene"),
  { ssr: false }
);
```

- [ ] **Step 5: Add the hero scene to the homepage**

Update the hero section in `src/app/page.tsx`. Replace the existing hero `<section>` with:

```tsx
import { LazyCanvas, LazyHeroScene } from "@/components/canvas";
```

And update the hero section:

```tsx
      {/* Hero */}
      <section className="relative mb-24">
        <div className="absolute inset-0 -top-28 -z-10 h-[80vh]">
          <LazyCanvas className="h-full w-full">
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <LazyHeroScene />
          </LazyCanvas>
        </div>
        <div className="pt-[20vh]">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 max-w-4xl leading-tight">
            Designer &<br />
            Creative Coder
          </h1>
          <p className="text-xl text-white/60 max-w-xl">
            Product design, creative coding, and photography by Adria Compte.
          </p>
        </div>
      </section>
```

- [ ] **Step 6: Verify build**

```bash
npm run build
```

Expected: Build succeeds. Homepage loads with a rotating wireframe icosahedron behind the hero text. Three.js bundle is only loaded on pages that import canvas components.

- [ ] **Step 7: Commit**

```bash
git add src/components/canvas/ src/app/page.tsx package.json package-lock.json
git commit -m "feat: add React Three Fiber foundation with lazy-loaded hero scene"
```

---

## Task 9: Fonts and Final Polish

**Files:**
- Modify: `src/app/layout.tsx`, `src/styles/globals.css`

- [ ] **Step 1: Install fonts**

```bash
npm install @fontsource-variable/lato @fontsource/pt-serif
```

Note: If `@fontsource-variable/lato` is not available, use `@fontsource/lato` instead.

Alternatively, use Next.js built-in font optimization. Update `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Lato, PT_Serif } from "next/font/google";
import Nav from "@/components/ui/Nav";
import "@/styles/globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Adria Compte | Designer & Creative Coder",
    template: "%s | Adria Compte",
  },
  description:
    "Portfolio of Adria Compte - Product Designer, Creative Coder & Photographer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lato.variable} ${ptSerif.variable}`}>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Remove the fontsource packages if installed, since we use next/font**

```bash
npm uninstall @fontsource-variable/lato @fontsource/pt-serif 2>/dev/null || true
```

- [ ] **Step 3: Update globals.css font references**

Replace the font-family values in the `@theme` block of `src/styles/globals.css`:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-background: #212121;
  --color-foreground: #ffffff;
  --color-accent: #00ffbf;
  --color-solojuegos: #00B83F;
  --color-filehippo: #0192DE;
  --color-tokoro: #EA4271;
  --color-flapimas: #ECD401;
  --color-softonic: #00ffbf;

  --font-sans: var(--font-sans), "Helvetica Neue", sans-serif;
  --font-serif: var(--font-serif), Georgia, serif;
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection {
  background-color: var(--color-accent);
  color: #000;
}
```

- [ ] **Step 4: Add `.gitkeep` files for empty image directories**

```bash
touch public/images/projects/solojuegos/.gitkeep
touch public/images/projects/filehippo/.gitkeep
touch public/images/projects/tokoro/.gitkeep
touch public/images/projects/flapimas/.gitkeep
touch public/images/projects/softonic-design-system/.gitkeep
touch public/images/photography/sample/.gitkeep
```

- [ ] **Step 5: Verify full build**

```bash
npm run build
```

Expected: Build succeeds with no warnings. All routes render correctly with proper fonts.

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/styles/globals.css public/images/ package.json package-lock.json
git commit -m "feat: add Google Fonts via next/font and finalize project structure"
```

---

## Task 10: Clean Up Old Files and Final Verification

**Files:**
- Delete: any remaining old CRA files
- Modify: `CLAUDE.md` (update if needed)

- [ ] **Step 1: Remove any leftover old files**

```bash
rm -f public/favicon.ico public/robots.txt 2>/dev/null || true
```

- [ ] **Step 2: Create a proper `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://adriacompte.com/sitemap.xml
```

- [ ] **Step 3: Add a `.gitignore` update for Next.js**

Replace the existing `.gitignore` content:

```
# dependencies
/node_modules
/.pnp
.pnp.js

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*

# env
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 4: Full build and lint check**

```bash
npm run build
npm run lint
```

Expected: Both pass with no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: clean up old CRA files and finalize Next.js migration"
```
