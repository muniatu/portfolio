import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PrototypeShell from "@/components/projects/nespresso/PrototypeShell";
import NespressoStatusBar from "@/components/projects/nespresso/NespressoStatusBar";
import NespressoNavBar from "@/components/projects/nespresso/NespressoNavBar";
import NespressoHero from "@/components/projects/nespresso/NespressoHero";
import NespressoCoffeeCorner from "@/components/projects/nespresso/NespressoCoffeeCorner";
import NespressoOatlyVideo from "@/components/projects/nespresso/NespressoOatlyVideo";
import NespressoMoodBubbles from "@/components/projects/nespresso/NespressoMoodBubbles";
import NespressoRecycling from "@/components/projects/nespresso/NespressoRecycling";
import NespressoBoutique from "@/components/projects/nespresso/NespressoBoutique";
import NespressoFooter from "@/components/projects/nespresso/NespressoFooter";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return [{ slug: "nespresso-color-filter" }];
}

export const metadata: Metadata = {
  title: "Nespresso prototype — Home",
  description:
    "Interactive mobile prototype: home screen with hero, coffee corner, mood bubbles, and more.",
};

export default async function PrototypeHomePage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  if (slug !== "nespresso-color-filter") notFound();

  return (
    <PrototypeShell>
      <NespressoStatusBar />
      <NespressoNavBar />
      <NespressoHero />
      <NespressoCoffeeCorner />
      <NespressoOatlyVideo />
      <NespressoMoodBubbles />
      <NespressoRecycling />
      <NespressoBoutique />
      <NespressoFooter />
    </PrototypeShell>
  );
}
