import { getAllProjects } from "@/lib/mdx";
import { getAllPhotos } from "@/lib/photography";
import HeroSection from "@/components/ui/HeroSection";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProjectRow from "@/components/ui/ProjectRow";
import TeachingSection from "@/components/ui/TeachingSection";
import PhotoReel from "@/components/ui/PhotoReel";
import ContactSection from "@/components/ui/ContactSection";

export const metadata = {
  alternates: { canonical: "https://adriacompte.com" },
};

export default function HomePage() {
  const allProjects = getAllProjects();
  const allPhotos = getAllPhotos();

  return (
    <main>
      <HeroSection />

      <div>
        {/* Projects — editorial typographic list */}
        <section className="pt-24">
          <div className="px-8 mb-16">
            <ScrollReveal>
              <span className="inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-white/50">
                Selected Work
              </span>
            </ScrollReveal>
          </div>
          <div>
            {allProjects.map((project, i) => (
              <ProjectRow
                key={project.slug}
                slug={project.slug}
                title={project.title}
                description={project.description}
                tags={project.tags}
                date={project.date}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* Teaching */}
        <TeachingSection />

        {/* Photography — S-curve reel */}
        {allPhotos.length > 0 && (
          <PhotoReel photos={allPhotos} maxPhotos={30} />
        )}
      </div>

      {/* Contact — transparent bg, canvas shows through */}
      <ContactSection />
    </main>
  );
}
