"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "@/components/ui/TextReveal";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    // Fade out on scroll
    const scrollTween = gsap.to(content, {
      opacity: 0,
      y: -80,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
      },
    });

    // Subtitle fade in
    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 1.5 }
      );
    }

    // Scroll indicator pulse
    if (indicatorRef.current) {
      gsap.fromTo(
        indicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 2.5, ease: "power2.out" }
      );
      gsap.to(indicatorRef.current.querySelector(".scroll-line"), {
        scaleY: 1,
        duration: 1.2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      });
    }

    return () => {
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-end px-5 md:px-8 pb-12 md:pb-16"
    >
      <div ref={contentRef} className="relative z-10 pb-20 w-full max-w-5xl">
        <TextReveal
          text="Senior Product Designer,"
          tag="h2"
          className="font-display text-[2rem] md:text-[6rem] leading-[0.95] tracking-tighter"
          delay={0.3}
        />
        <TextReveal
          text="Creative Coder & Entrepreneur"
          tag="h2"
          className="font-display text-[1.75rem] md:text-[5.5rem] leading-[0.95] tracking-tighter italic"
          delay={0.8}
        />
        <p
          ref={subtitleRef}
          className="text-sm md:text-lg text-white/40 mt-6 md:mt-8 leading-relaxed w-full md:max-w-xl"
          style={{ opacity: 0 }}
        >
          Crafting design systems, enhancing workflows with AI, and building digital products people love. Where design meets code. Based in Barcelona.
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={indicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 0 }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
          Scroll
        </span>
        <div className="w-px h-8 bg-white/10 overflow-hidden">
          <div className="scroll-line w-full h-full bg-white/40 origin-top scale-y-0" />
        </div>
      </div>
    </section>
  );
}
