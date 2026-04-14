"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

const greetings = [
  "Say Hello!",
  "Di Hola!",
  "Digues Hola!",
  "Dis Bonjour!",
  "Dì Ciao!",
  "Sag Hallo!",
  "Diga Olá!",
  "Скажи Привет!",
  "こんにちはと言って!",
  "안녕이라고 해!",
  "说你好!",
  "Säg Hej!",
  "Πες Γεια!",
  "Merhaba De!",
  "Nói Xin Chào!",
  "Powiedz Cześć!",
  "Seg Hei!",
  "Üdvözölj!",
  "Zeg Hallo!",
  "Sano Moi!",
];

const marqueeText = [...greetings, ...greetings, ...greetings].join(" · ");

function EmailLink() {
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const email = "compteadria@gmail.com";
  const chars = email.split("");

  const handleEnter = useCallback(() => {
    lettersRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, { y: -4, duration: 0.3, ease: "power3.out", delay: i * 0.015 });
      gsap.to(el, { y: 0, duration: 0.4, ease: "power3.out", delay: i * 0.015 + 0.15 });
    });
  }, []);

  const handleLeave = useCallback(() => {
    lettersRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, { y: 3, duration: 0.2, ease: "power3.out", delay: i * 0.01 });
      gsap.to(el, { y: 0, duration: 0.3, ease: "power3.out", delay: i * 0.01 + 0.1 });
    });
  }, []);

  return (
    <a
      href={`mailto:${email}`}
      className="inline-block group"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span className="font-display text-3xl md:text-5xl lg:text-6xl tracking-tight text-white/90 group-hover:text-white transition-colors duration-500 inline-flex">
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => { lettersRef.current[i] = el; }}
            className="inline-block"
            style={{ willChange: "transform" }}
          >
            {char}
          </span>
        ))}
      </span>
    </a>
  );
}

export default function ContactSection() {
  const track1Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t1 = track1Ref.current;
    if (!t1) return;

    const width = t1.scrollWidth / 3;

    const tl = gsap.to(t1, {
      x: -width,
      duration: 50,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Marquee */}
      <div className="mb-20 md:mb-28 overflow-hidden py-4">
        <div
          ref={track1Ref}
          className="font-display text-7xl md:text-9xl lg:text-[12rem] tracking-tighter text-white whitespace-nowrap leading-normal"
        >
          {marqueeText}
        </div>
      </div>

      {/* CTA */}
      <div className="px-8 md:px-16 text-center">
        <p className="text-white/30 text-sm uppercase tracking-[0.2em] mb-6">
          Get in touch
        </p>
        <EmailLink />
        <div className="flex justify-center gap-8 mt-8">
          <a href="https://www.linkedin.com/in/adria-compte-product-designer/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors duration-300">LinkedIn</a>
          <a href="https://www.instagram.com/adria_compte/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors duration-300">Instagram</a>
          <a href="https://github.com/muniatu" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors duration-300">GitHub</a>
        </div>
      </div>
    </section>
  );
}
