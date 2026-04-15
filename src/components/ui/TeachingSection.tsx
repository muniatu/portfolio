"use client";

import { useRef, useEffect, forwardRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const schools = [
  {
    name: "@LCI Barcelona \u2014 School of Design and Visual Arts",
    href: "https://forhumanfuture.lcieducation.com/masters/interaction-design-and-immersive-experiences/",
    subjects: [
      "Associate professor of Prototyping and UX Engineering for the Interaction Design and Immersive Experiences Master's Degree.",
    ],
  },
  {
    name: "@LABASAD \u2014 Barcelona School of Arts and Design",
    href: "https://www.labasad.com/master/master-online-en-diseno-de-producto/",
    subjects: [
      "Associate professor of Wireframing and prototyping with AI for the Online Master in Digital Product Design & AI.",
    ],
  },
  {
    name: "@Barcelona Code School",
    href: "https://barcelonacodeschool.com/ux-design-bootcamp-in-barcelona-code-school/",
    subjects: [
      "Agile methodologies and Lean UX lecturer for the UX/UI Design Bootcamp.",
    ],
  },
  {
    name: "@Nuclio Digital School",
    href: "https://nuclio.school/master-ux-ui-design/",
    subjects: ["UX Engineering lecturer for the Masters in UXUI Design."],
  },
];

const SchoolCard = forwardRef<
  HTMLDivElement,
  { school: (typeof schools)[number] }
>(function SchoolCard({ school }, ref) {
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  const handleEnter = () => {
    lettersRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        y: -4,
        opacity: 1,
        duration: 0.3,
        ease: "power3.out",
        delay: i * 0.015,
      });
      gsap.to(el, {
        y: 0,
        duration: 0.4,
        ease: "power3.out",
        delay: i * 0.015 + 0.15,
      });
    });
  };

  const handleLeave = () => {
    lettersRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        y: 3,
        opacity: 0.8,
        duration: 0.2,
        ease: "power3.out",
        delay: i * 0.01,
      });
      gsap.to(el, {
        y: 0,
        duration: 0.3,
        ease: "power3.out",
        delay: i * 0.01 + 0.1,
      });
    });
  };

  const words = school.name.split(" ");
  let charIndex = 0;

  return (
    <div ref={ref} className="group" style={{ opacity: 0 }}>
      <a
        href={school.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mb-3"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <span className="font-display text-xl md:text-2xl tracking-tight text-white/90 group-hover:text-white transition-colors duration-500 inline-flex flex-wrap">
          {words.map((word, wi) => {
            const wordChars = word.split("");
            const els = wordChars.map((char, ci) => {
              const idx = charIndex++;
              return (
                <span
                  key={idx}
                  ref={(el) => {
                    lettersRef.current[idx] = el;
                  }}
                  className="inline-block transition-none"
                  style={{ willChange: "transform" }}
                >
                  {char}
                </span>
              );
            });
            // Add space between words (not after last)
            if (wi < words.length - 1) {
              const spaceIdx = charIndex++;
              els.push(
                <span
                  key={`space-${spaceIdx}`}
                  ref={(el) => {
                    lettersRef.current[spaceIdx] = el;
                  }}
                  className="inline-block transition-none"
                  style={{ willChange: "transform" }}
                >
                  {"\u00A0"}
                </span>,
              );
            }
            return (
              <span key={wi} className="inline-flex whitespace-nowrap">
                {els}
              </span>
            );
          })}
        </span>
      </a>
      {school.subjects.map((subject) => (
        <p key={subject} className="text-sm text-white/40 leading-relaxed">
          {subject}
        </p>
      ))}
    </div>
  );
});

export default function TeachingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const schoolRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 60%" },
      });

      // Title
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          0,
        );
      }

      // Description
      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          0.15,
        );
      }

      // School cards stagger
      schoolRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.fromTo(
          el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          0.3 + i * 0.12,
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col justify-center bg-[rgb(6,6,6)] overflow-hidden"
    >
      <div className="px-8 md:px-16 py-24 md:py-32">
        {/* Title + description — full width row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20 md:mb-24">
          <h2
            ref={titleRef}
            className="font-display text-[clamp(1.8rem,10vw,7rem)] tracking-tighter leading-[0.85] w-full"
            style={{ opacity: 0 }}
          >
            Associate professor
            <br />
            <span className="italic">&amp; design lecturer</span>
          </h2>
        </div>

        {/* 4-column: description + 3 schools */}
        <div className="grid grid-cols-1 md:grid-cols-[30%_repeat(4,1fr)] gap-8 md:gap-20">
          <div>
            <p className="font-regular text-white/70 text-base md:text-lg leading-relaxed tracking-normal mb-6">
              I started teaching as a way to give back and push myself to
              experience new things. It quickly became one of the most rewarding
              parts of my design journey. Articulating things you take for
              granted, and seeing someone facing them for the first time
              sharpens your own perspective.
            </p>
            <p className="font-regular text-white/70 text-base md:text-lg leading-relaxed tracking-normal mb-6">
              The magic happens when a student realizes they have the power to
              build whatever they can imagine. The tools change every year, but{" "}
              <b className="text-white/90">that moment never gets old</b>. I try
              to stay up-to-date so they can learn the fundamentals and take a
              peek into the future.
            </p>
            <p className="text-white/40 text-sm leading-relaxed">
              From user flows and paper prototypes to high-fidelity solutions
              built with AI, helping students to jump into code without being
              afraid. The classroom is where theory meets craft and things start
              to click.
            </p>
          </div>
          {schools.map((school, i) => (
            <SchoolCard
              key={school.name}
              school={school}
              ref={(el) => {
                schoolRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-white/[0.06] mt-20 md:mt-28" />
    </section>
  );
}
