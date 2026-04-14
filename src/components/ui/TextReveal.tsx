"use client";

import { useRef, useEffect, useMemo } from "react";
import gsap from "gsap";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";

type TextRevealProps = {
  text: string;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
};

export default function TextReveal({
  text,
  tag: Tag = "h1",
  className = "",
  delay = 0,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const characters = useMemo(() => {
    return text.split("").map((char, i) => ({
      char,
      isSpace: char === " ",
      index: i,
    }));
  }, [text]);

  useEffect(() => {
    const spans = charsRef.current.filter(Boolean) as HTMLSpanElement[];
    if (spans.length === 0) return;

    // Set initial state
    spans.forEach((span) => {
      span.style.opacity = "0";
    });

    const tl = gsap.timeline({ delay });

    // Scramble and reveal each character
    spans.forEach((span, i) => {
      const finalChar = characters[i].char;
      if (characters[i].isSpace) {
        tl.set(span, { opacity: 1 }, i * 0.03);
        return;
      }

      const scrambleDuration = 0.4;
      const startTime = i * 0.04;

      // Show with random char
      tl.set(span, { opacity: 1, textContent: CHARS[Math.floor(Math.random() * CHARS.length)] }, startTime);

      // Scramble a few times
      for (let s = 1; s <= 3; s++) {
        tl.set(
          span,
          { textContent: CHARS[Math.floor(Math.random() * CHARS.length)] },
          startTime + (scrambleDuration / 4) * s
        );
      }

      // Settle to final character
      tl.set(span, { textContent: finalChar }, startTime + scrambleDuration);
    });

    return () => {
      tl.kill();
    };
  }, [characters, delay]);

  return (
    <Tag ref={containerRef as React.RefObject<HTMLHeadingElement>} className={className} aria-label={text}>
      {characters.map(({ char, isSpace, index }) => (
        <span
          key={index}
          ref={(el) => { charsRef.current[index] = el; }}
          aria-hidden="true"
          style={{ opacity: 0 }}
        >
          {isSpace ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}
