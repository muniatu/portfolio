import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PrototypeShell from "@/components/projects/nespresso/PrototypeShell";
import NespressoCoffeePage from "@/components/projects/nespresso/NespressoCoffeePage";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return [{ slug: "nespresso-color-filter" }];
}

export const metadata: Metadata = {
  title: "Nespresso prototype — Coffee",
  description:
    "Interactive mobile prototype: coffee product listing with filters and pastel cards.",
};

export default async function PrototypeCoffeePLP({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  if (slug !== "nespresso-color-filter") notFound();

  return (
    <PrototypeShell>
      <NespressoCoffeePage />
    </PrototypeShell>
  );
}
