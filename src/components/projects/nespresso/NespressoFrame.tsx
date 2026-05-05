"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { MenuProvider } from "./_menu-context";
import NespressoMenu from "./NespressoMenu";

type Props = {
  children: ReactNode;
  /** Total frame width including bezel. Defaults to 448 (matches the mockup PNG). */
  width?: number;
};

const DRAG_THRESHOLD = 4; // px before a click is reclassified as a drag

// Mockup PNG dimensions (Phone.png is 448 × 916).
const FRAME_W = 448;
const FRAME_H = 916;
// Bezel insets as percentages of the frame.
const BEZEL_LEFT_PCT = 5.36;
const BEZEL_RIGHT_PCT = 4.91;
// Symmetric insets that match the PNG's screen edges.
const BEZEL_TOP_PCT = 2.2;
const BEZEL_BOTTOM_PCT = 2.2;
// Border radius on the inner scroll viewport — matches the PNG screen corners.
const SCREEN_RADIUS = 60;
// Momentum / inertia tuning
const VELOCITY_DECAY = 0.94; // per ~16ms frame
const MIN_VELOCITY = 0.02; // px/ms — stop threshold
const VELOCITY_SAMPLE_WINDOW_MS = 80;

/**
 * Phone-shaped chrome that wraps the interactive Nespresso prototype.
 * Uses a real mockup PNG (with notch and side buttons baked in) as the
 * visual frame and positions the scrollable content over the screen area.
 *
 * On desktop the contents are drag-scrollable with a translucent circle
 * cursor; on touch devices, native scrolling is used.
 */
export default function NespressoFrame({ children, width = FRAME_W }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const dragState = useRef({
    pointerId: null as number | null,
    startY: 0,
    startScrollTop: 0,
    moved: false,
    /** Recent {y, t} samples used to compute fling velocity */
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
    // initialVelocity in px/ms applied to scrollTop
    let v = initialVelocity;
    let last = performance.now();
    const tick = () => {
      if (!scrollRef.current) return;
      const now = performance.now();
      const dt = now - last;
      last = now;
      scrollRef.current.scrollTop += v * dt;
      // exponential decay normalized to ~16ms frames
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

      // Track velocity samples
      const now = performance.now();
      dragState.current.samples.push({ y: e.clientY, t: now });
      // Drop samples older than the window
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
      // Tapping the frame interrupts any active fling
      cancelMomentum();
      dragState.current = {
        pointerId: e.pointerId,
        startY: e.clientY,
        startScrollTop: scrollRef.current.scrollTop,
        moved: false,
        samples: [{ y: e.clientY, t: performance.now() }],
      };
      setPressing(true);
      // NOTE: deliberately not calling setPointerCapture — capture redirects
      // pointer events but interacts badly with the synthesised click event,
      // making inner buttons unreachable in some browsers.
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

      if (wasDragged) {
        // Click suppression is handled in onClickCapture (capture phase),
        // not via preventDefault here — preventDefault on pointerup can
        // cancel the compat click on inner buttons we DO want to fire.

        // Compute fling velocity from the recent sample window
        if (samples.length >= 2) {
          const first = samples[0];
          const last = samples[samples.length - 1];
          const dt = last.t - first.t;
          const dy = last.y - first.y;
          if (dt > 0) {
            // dragging up = dy<0 = scrollTop should keep increasing
            // scrollTop delta we applied per ms ≈ -dy/dt, so seed momentum with that
            startMomentum(-dy / dt);
          }
        }
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

  return (
    <MenuProvider>
    <div className="not-prose my-12 flex justify-center">
      <div
        className="relative inline-block"
        style={{ width: `min(100%, ${width}px)` }}
      >
        {/* Mockup PNG drives the wrapper's height naturally:
            displayed at its intrinsic aspect ratio, max-width 100%.
            Using a plain <img> so the layout is always exactly W × W·(916/448). */}
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

        {/* Screen — interactive scrollable area, sits beneath the mockup */}
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
            {children}
          </div>

          {/* Menu overlay — fades in over the screen when burger is tapped */}
          <NespressoMenu />

          {/* Translucent circle cursor (desktop only) */}
          <div
            ref={cursorRef}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-30 hidden rounded-full backdrop-blur-sm transition-[width,height,background] duration-150 md:block"
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
    </MenuProvider>
  );
}
