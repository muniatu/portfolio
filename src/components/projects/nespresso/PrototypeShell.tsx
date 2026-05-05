"use client";

import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { MenuProvider } from "./_menu-context";
import NespressoMenu from "./NespressoMenu";

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
    <MenuProvider>
      <ShellInner>{children}</ShellInner>
    </MenuProvider>
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

  return (
    <div
      className="relative h-svh w-full overflow-hidden bg-white"
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
    </div>
  );
}
