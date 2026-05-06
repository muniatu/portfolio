"use client";

import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MenuProvider } from "./_menu-context";
import { CartProvider } from "./_cart-context";
import NespressoMenu from "./NespressoMenu";
import NespressoCart from "./NespressoCart";

const DRAG_THRESHOLD = 4;
const VELOCITY_DECAY = 0.94;
const MIN_VELOCITY = 0.02;
const VELOCITY_SAMPLE_WINDOW_MS = 80;

/**
 * Owns the prototype's interaction layer:
 *  - drag-to-scroll with momentum
 *  - menu overlay context
 *
 * Used by every prototype page (home, coffee PLP, …) so behaviour is
 * consistent whether the page is viewed standalone or embedded in an
 * iframe inside the case study.
 */
export default function PrototypeShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <MenuProvider>
        <ShellInner>{children}</ShellInner>
      </MenuProvider>
    </CartProvider>
  );
}

function ShellInner({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const dragState = useRef({
    pointerId: null as number | null,
    startY: 0,
    startScrollTop: 0,
    moved: false,
    samples: [] as { y: number; t: number }[],
  });
  const momentumRaf = useRef<number | null>(null);

  const cancelMomentum = useCallback(() => {
    if (momentumRaf.current !== null) {
      cancelAnimationFrame(momentumRaf.current);
      momentumRaf.current = null;
    }
  }, []);

  const startMomentum = useCallback((initialVelocity: number) => {
    let v = initialVelocity;
    let last = performance.now();
    const tick = () => {
      if (!scrollRef.current) return;
      const now = performance.now();
      const dt = now - last;
      last = now;
      scrollRef.current.scrollTop += v * dt;
      v *= Math.pow(VELOCITY_DECAY, dt / 16.67);
      if (Math.abs(v) > MIN_VELOCITY) {
        momentumRaf.current = requestAnimationFrame(tick);
      } else {
        momentumRaf.current = null;
      }
    };
    momentumRaf.current = requestAnimationFrame(tick);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;

    if (dragState.current.pointerId !== null && scrollRef.current) {
      const deltaY = e.clientY - dragState.current.startY;
      if (Math.abs(deltaY) > DRAG_THRESHOLD) {
        dragState.current.moved = true;
      }
      scrollRef.current.scrollTop = dragState.current.startScrollTop - deltaY;

      const now = performance.now();
      dragState.current.samples.push({ y: e.clientY, t: now });
      while (
        dragState.current.samples.length > 0 &&
        now - dragState.current.samples[0].t > VELOCITY_SAMPLE_WINDOW_MS
      ) {
        dragState.current.samples.shift();
      }
    }
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== "mouse" || !scrollRef.current) return;
      cancelMomentum();
      dragState.current = {
        pointerId: e.pointerId,
        startY: e.clientY,
        startScrollTop: scrollRef.current.scrollTop,
        moved: false,
        samples: [{ y: e.clientY, t: performance.now() }],
      };
    },
    [cancelMomentum]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== "mouse") return;
      const wasDragged = dragState.current.moved;
      const samples = dragState.current.samples;
      dragState.current.pointerId = null;

      if (wasDragged && samples.length >= 2) {
        const first = samples[0];
        const last = samples[samples.length - 1];
        const dt = last.t - first.t;
        const dy = last.y - first.y;
        if (dt > 0) startMomentum(-dy / dt);
      }
    },
    [startMomentum]
  );

  const onClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragState.current.moved = false;
    }
  }, []);

  useEffect(() => () => cancelMomentum(), [cancelMomentum]);

  // Embedded = inside the case-study iframe → fills the iframe.
  // Standalone = direct URL visit → centered phone-like column on a dark
  // backdrop with rounded corners + shadow on desktop, full-screen on mobile.
  const [embedded, setEmbedded] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmbedded(window.self !== window.top);
    }
  }, []);

  return (
    <div
      className={
        embedded
          ? "min-h-svh"
          : "flex min-h-svh items-stretch justify-center bg-stone-900 sm:items-center sm:p-6"
      }
    >
      <div
        className={
          embedded
            ? "relative h-svh w-full overflow-hidden bg-white"
            : "relative h-svh w-full max-w-[448px] overflow-hidden bg-white sm:h-[92svh] sm:max-h-[920px] sm:rounded-[40px] sm:shadow-2xl sm:shadow-black/40"
        }
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClickCapture={onClickCapture}
      >
        <div
          ref={scrollRef}
          data-lenis-prevent
          className="relative h-full overflow-y-auto overscroll-contain"
          style={{
            touchAction: "pan-y",
            scrollbarWidth: "none",
          }}
        >
          {children}
        </div>

        <NespressoMenu />
        <NespressoCart />
      </div>
    </div>
  );
}
