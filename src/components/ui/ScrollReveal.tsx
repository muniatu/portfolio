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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Small delay to let page transition finish before GSAP measures positions
    const timer = setTimeout(() => {
      gsap.set(el, from);
      const tween = gsap.to(el, {
        ...to,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
          ...trigger,
        },
      });

      // Force a refresh so GSAP re-evaluates positions after page transition
      ScrollTrigger.refresh();

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, 100);

    return () => {
      clearTimeout(timer);
      // Kill any GSAP animations on this element
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
