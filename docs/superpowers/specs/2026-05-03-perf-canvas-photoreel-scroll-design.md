# Performance: HeroCanvas, PhotoReel, and Mobile Scroll Reset

**Date:** 2026-05-03
**Branch:** `perf/canvas-photoreel-scroll`

## Problem

Three issues observed on the live site:

1. **Mobile scroll doesn't reset on navigation.** Tapping a link opens the new page already scrolled partway down.
2. **WebGL shader is heavier than necessary**, especially on phones.
3. **PhotoReel images load too late** — scrolling reveals them before they have data.

## Goals

Targeted, low-risk performance pass. Measure with Lighthouse mobile before and after to confirm the gain. No visual regressions.

## Fixes

### 1. Scope HeroCanvas to homepage only

`HeroCanvas` currently mounts in `src/app/layout.tsx` and runs on every route. It's a fullscreen `fixed inset-0` R3F canvas with a continuous-rAF shader, but it's only visually used by the homepage hero and contact section (middle sections cover it with solid backgrounds).

**Change:** Make `HeroCanvas` return `null` unless `usePathname() === '/'`.

Single canvas instance, fixed across the homepage's full scroll height — same as today, just doesn't mount on `/about`, `/projects/*`, `/photography/*`. Two inline canvases (one per visible section) was considered and rejected: doubles WebGL contexts and shader compiles for no user-visible benefit.

### 2. Fix scroll reset on route change

`src/app/template.tsx` wraps every page in a `motion.div` with a `y: 20 → 0` enter animation. Next.js's default scroll restoration races with that transform on mobile and lands the user partway down the new page.

**Change:** Add `useEffect` on `pathname` change in `template.tsx` that calls `window.scrollTo(0, 0)` (instant, not smooth).

### 3. Shader perf

`HeroScene.tsx` does roughly 2× the fragment work it needs to:

- `uResolution.value.set(size.width * 2, size.height * 2)` (line 192) — drop the `*2`. Coordinate math should match the actual canvas pixel dimensions.
- Canvas uses `dpr={[1, 1.5]}` — keep on desktop, but cap to `[1, 1.25]` on mobile (touch devices). The shader's chroma loop runs 30 `scene()` invocations per pixel; each doubled pixel multiplies that.
- `STEPS = 10` in the chroma loop — reduce to 6. Visually identical at typical viewing distance.
- `useFrame` allocates `new Vector2(pointer.x, pointer.y)` every frame — reuse a ref'd Vector2.
- Pause the rAF loop when the canvas is not visible. Use a `frameloop` toggle driven by an IntersectionObserver watching the hero and contact sections. When neither is in view (i.e., user is reading the projects/text middle of the homepage), set `frameloop="never"`; when one is in view, set back to `"always"`.

### 4. PhotoReel image loading

Root cause: every reel photo has `style={{ display: "none" }}` until the scroll-driven JS reveals it, plus `loading="lazy"`. The browser's lazy-loader can't see hidden elements as "near viewport," so fetching only starts when JS un-hides them — too late at scroll speed.

**Changes:**

- Remove `loading="lazy"` from the reel `<Image>`. Max 20 photos; let the browser fetch them as the homepage loads.
- Add `fetchPriority="low"` so they queue behind the LCP.
- Bump `sizes` from `"200px"` to `"400px"`. At scale 4× the displayed width approaches 400px on desktop; the current `200px` causes Next/Image to serve an undersized variant.
- Add `placeholder="blur"` with `blurDataURL` if available cheaply (skip if it requires a build-step rework).

## Out of scope

- Replacing Framer Motion's page transition with CSS (~40KB gzipped saving) — keep for now, revisit if Lighthouse still shows JS as the bottleneck after these fixes.
- GSAP/ScrollTrigger import audit — only relevant if there's evidence of unused imports; skip unless the post-fix Lighthouse run flags it.
- Photography gallery page (`/photography`) image loading — different component, different problem; not what the user described.

## Verification

- `npm run build` succeeds with no new warnings.
- Visual smoke test: homepage hero animates as before; contact section has shader visible behind it; about/projects/photography pages no longer mount the canvas (DevTools: no `<canvas>` in DOM).
- Tap a link on mobile (or DevTools mobile emulation) → new page opens at scroll top.
- Lighthouse mobile run on `/` before/after — record the deltas in the PR description.
