import dynamic from "next/dynamic";

export const LazyCanvas = dynamic(
  () => import("@/components/canvas/Canvas"),
  { ssr: false }
);

export const LazyHeroScene = dynamic(
  () => import("@/components/canvas/sketches/HeroScene"),
  { ssr: false }
);
