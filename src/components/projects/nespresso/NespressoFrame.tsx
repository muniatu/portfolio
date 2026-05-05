"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { MenuProvider } from "./_menu-context";
import { RouterProvider, useRouter } from "./_router-context";
import NespressoMenu from "./NespressoMenu";
import NespressoCoffeePage from "./NespressoCoffeePage";

type Props = {
  children: ReactNode;
  /** Total frame width including bezel. Defaults to 448 (matches the mockup PNG). */
  width?: number;
};

const DRAG_THRESHOLD = 4;

// Mockup PNG dimensions (Phone.png is 448 × 916).
const FRAME_W = 448;
const FRAME_H = 916;
const BEZEL_LEFT_PCT = 5.36;
const BEZEL_RIGHT_PCT = 4.91;
const BEZEL_TOP_PCT = 2.2;
const BEZEL_BOTTOM_PCT = 2.2;
const SCREEN_RADIUS = 60;
const VELOCITY_DECAY = 0.94;
const MIN_VELOCITY = 0.02;
const VELOCITY_SAMPLE_WINDOW_MS = 80;

/**
 * Phone-shaped chrome that wraps the interactive Nespresso prototype.
 * Sets up router + menu contexts and delegates all rendering & input
 * handling to the inner component, which can read those contexts.
 */
export default function NespressoFrame(props: Props) {
  return (
    <RouterProvider>
      <MenuProvider>
        <FrameInner {...props} />
      </MenuProvider>
    </RouterProvider>
  );
}

function FrameInner({ children, width = FRAME_W }: Props) {
  const { page } = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const dragState = useRef({
    pointerId: null as number | null,
    startY: 0,
    startScrollTop: 0,
    moved: false,
    samples: [] as { y: number; t: number }[],
  });
  const momentumRaf = useRef<number | null>(null);

  const [hovering, setHovering] = useState(false);
  const [pressing, setPressing] = useState(false);

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

    if (cursorRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      cursorRef.current.style.transform = `translate(${e.clientX - rect.left}px, ${
        e.clientY - rect.top
      }px) translate(-50%, -50%)`;
    }

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
      setPressing(true);
    },
    [cancelMomentum]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== "mouse") return;
      setPressing(false);
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

  const onPointerEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") setHovering(true);
  }, []);

  const onPointerLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    setHovering(false);
    setPressing(false);
    dragState.current.pointerId = null;
  }, []);

  // Cleanup any in-flight RAF on unmount
  useEffect(() => () => cancelMomentum(), [cancelMomentum]);

  // Reset scroll position when the route changes so each page lands at top
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    cancelMomentum();
  }, [page, cancelMomentum]);

  return (
    <div
      className="not-prose my-12 flex justify-center"
      style={{ fontFamily: '"Host Grotesk", system-ui, sans-serif' }}
    >
      <div
        className="relative inline-block"
        style={{ width: `min(100%, ${width}px)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/projects/nespresso/mockup/Phone.png"
          alt=""
          width={FRAME_W}
          height={FRAME_H}
          aria-hidden
          draggable={false}
          className="pointer-events-none relative z-20 block h-auto w-full select-none"
        />

        <div
          ref={screenRef}
          className="absolute z-10 overflow-hidden bg-white"
          style={{
            top: `${BEZEL_TOP_PCT}%`,
            bottom: `${BEZEL_BOTTOM_PCT}%`,
            left: `${BEZEL_LEFT_PCT}%`,
            right: `${BEZEL_RIGHT_PCT}%`,
            borderRadius: `${SCREEN_RADIUS}px`,
          }}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
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
              cursor: "none",
              scrollbarWidth: "none",
            }}
          >
            {page === "home" ? children : <NespressoCoffeePage />}
          </div>

          {/* Menu overlay — sits above the scrollable area on every route */}
          <NespressoMenu />

          {/* Translucent circle cursor (desktop only) */}
          <div
            ref={cursorRef}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-40 hidden rounded-full backdrop-blur-sm transition-[width,height,background] duration-150 md:block"
            style={{
              width: pressing ? 36 : 28,
              height: pressing ? 36 : 28,
              background: pressing
                ? "rgba(255,255,255,0.35)"
                : "rgba(255,255,255,0.22)",
              border: "1px solid rgba(255,255,255,0.7)",
              opacity: hovering ? 1 : 0,
              mixBlendMode: "difference",
            }}
          />
        </div>
      </div>
    </div>
  );
}
