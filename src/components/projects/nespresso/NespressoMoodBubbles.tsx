"use client";

import { useEffect, useRef, useState } from "react";

const SIZE = 80;
const RADIUS = SIZE / 2;
const BORDER = 1.5;
// Collide on the visible border so bubble outlines never overlap.
const VISIBLE_RADIUS = RADIUS + BORDER / 2;
const COLLISION_DIAMETER = VISIBLE_RADIUS * 2;

// Four-colour palette. Each entry has a solid colour used both as the
// border (unselected) and as the fill (selected, white text on top).
const COLORS = {
  purple: "#5C3D8C",
  brown: "#8B5E3C",
  amber: "#C8941A",
  blue: "#4060B0",
} as const;

type ColorKey = keyof typeof COLORS;

type BubbleData = { id: string; label: string; color: ColorKey };

const BUBBLES: BubbleData[] = [
  { id: "rich", label: "Rich", color: "brown" },
  { id: "classic", label: "Classic", color: "amber" },
  { id: "fun", label: "Fun", color: "blue" },
  { id: "energetic", label: "Energetic", color: "purple" },
  { id: "cozy", label: "Cozy", color: "blue" },
  { id: "on-ice", label: "On ice", color: "brown" },
  { id: "calm", label: "Calm", color: "purple" },
  { id: "cool", label: "Cool", color: "amber" },
  { id: "shaked", label: "Shaked", color: "brown" },
  { id: "sweet", label: "Sweet", color: "blue" },
  { id: "bold", label: "Bold", color: "amber" },
];

type Body = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isDragging: boolean;
};

// Physics tuning
const AMBIENT_IMPULSE_PROB = 0.012; // chance per frame of a tiny push
const AMBIENT_IMPULSE_MAG = 0.18; // magnitude of that push (px/frame)
const DAMPING = 0.985;
const COLLISION_RESTITUTION = 0.7;
const WALL_RESTITUTION = 0.55;
const MAX_VELOCITY = 12;

export default function NespressoMoodBubbles({
  title = "How are you feeling today?",
  ctaLabel = "Let's make some coffee",
}: {
  title?: string;
  ctaLabel?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const bodiesRef = useRef<Body[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Initialise bubble positions once we know the container's size.
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();

    // Distribute initial positions on a loose grid + jitter so collisions
    // ripple them apart organically without overlap on first frame.
    const cols = 3;
    const rows = Math.ceil(BUBBLES.length / cols);
    const cellW = rect.width / cols;
    const cellH = rect.height / rows;

    bodiesRef.current = BUBBLES.map((b, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        id: b.id,
        x: cellW * (col + 0.5) + (Math.random() - 0.5) * 12,
        y: cellH * (row + 0.5) + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        isDragging: false,
      };
    });
  }, []);

  // Physics + render loop.
  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const c = containerRef.current;
      if (!c) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const W = c.clientWidth;
      const H = c.clientHeight;
      const bodies = bodiesRef.current;

      // 1. Integrate motion + ambient drift + boundary clamp
      for (const body of bodies) {
        if (body.isDragging) continue;

        if (Math.random() < AMBIENT_IMPULSE_PROB) {
          body.vx += (Math.random() - 0.5) * AMBIENT_IMPULSE_MAG * 2;
          body.vy += (Math.random() - 0.5) * AMBIENT_IMPULSE_MAG * 2;
        }

        // Cap speed
        const speed = Math.hypot(body.vx, body.vy);
        if (speed > MAX_VELOCITY) {
          body.vx = (body.vx / speed) * MAX_VELOCITY;
          body.vy = (body.vy / speed) * MAX_VELOCITY;
        }

        body.x += body.vx;
        body.y += body.vy;
        body.vx *= DAMPING;
        body.vy *= DAMPING;

        if (body.x - VISIBLE_RADIUS < 0) {
          body.x = VISIBLE_RADIUS;
          body.vx = Math.abs(body.vx) * WALL_RESTITUTION;
        } else if (body.x + VISIBLE_RADIUS > W) {
          body.x = W - VISIBLE_RADIUS;
          body.vx = -Math.abs(body.vx) * WALL_RESTITUTION;
        }
        if (body.y - VISIBLE_RADIUS < 0) {
          body.y = VISIBLE_RADIUS;
          body.vy = Math.abs(body.vy) * WALL_RESTITUTION;
        } else if (body.y + VISIBLE_RADIUS > H) {
          body.y = H - VISIBLE_RADIUS;
          body.vy = -Math.abs(body.vy) * WALL_RESTITUTION;
        }
      }

      // 2. Pairwise circle collisions
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const b = bodies[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          let dist = Math.hypot(dx, dy);
          const minDist = COLLISION_DIAMETER;

          if (dist < minDist) {
            // Avoid div-by-zero if perfectly stacked
            if (dist === 0) {
              dist = 0.01;
            }
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;

            // Position separation. If one is being dragged, it doesn't move
            // — the other absorbs all the displacement.
            if (a.isDragging && !b.isDragging) {
              b.x += nx * overlap;
              b.y += ny * overlap;
            } else if (b.isDragging && !a.isDragging) {
              a.x -= nx * overlap;
              a.y -= ny * overlap;
            } else if (!a.isDragging && !b.isDragging) {
              const half = overlap / 2;
              a.x -= nx * half;
              a.y -= ny * half;
              b.x += nx * half;
              b.y += ny * half;
            }

            // Velocity exchange along the normal (equal-mass elastic-ish)
            const relV = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
            if (relV > 0) {
              const impulse = relV * COLLISION_RESTITUTION;
              if (!a.isDragging) {
                a.vx -= nx * impulse;
                a.vy -= ny * impulse;
              }
              if (!b.isDragging) {
                b.vx += nx * impulse;
                b.vy += ny * impulse;
              }
            }
          }
        }
      }

      // 3. Write to DOM
      for (const body of bodies) {
        const el = elsRef.current[body.id];
        if (el) {
          el.style.transform = `translate3d(${body.x - RADIUS}px, ${body.y - RADIUS}px, 0)`;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Drag handler — overrides body position to pointer, computes release velocity.
  const startDrag = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    const c = containerRef.current;
    const body = bodiesRef.current.find((b) => b.id === id);
    if (!c || !body) return;

    // Don't let the parent frame's drag-to-scroll see this pointer.
    e.stopPropagation();

    body.isDragging = true;
    body.vx = 0;
    body.vy = 0;

    const rect = c.getBoundingClientRect();
    let lastX = e.clientX;
    let lastY = e.clientY;
    let lastT = performance.now();
    let totalMoved = 0;

    const onMove = (ev: PointerEvent) => {
      totalMoved += Math.abs(ev.clientX - lastX) + Math.abs(ev.clientY - lastY);
      const now = performance.now();
      const dt = Math.max(now - lastT, 1);

      body.x = ev.clientX - rect.left;
      body.y = ev.clientY - rect.top;
      // Approximate velocity in px/frame at 60fps
      body.vx = ((ev.clientX - lastX) / dt) * 16;
      body.vy = ((ev.clientY - lastY) / dt) * 16;

      lastX = ev.clientX;
      lastY = ev.clientY;
      lastT = now;
    };

    const onUp = () => {
      body.isDragging = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);

      // Tap (no real movement) → toggle selection
      if (totalMoved < 6) {
        setSelected((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const hasSelection = selected.size > 0;

  return (
    <section className="px-4 py-3">
      <div className="rounded-3xl bg-stone-100 p-5">
        <h2 className="text-[26px] font-normal leading-tight text-black">
          {title}
        </h2>

        <div
          ref={containerRef}
          className="relative my-5 h-[340px] w-full"
          aria-label="Mood selection"
        >
          {BUBBLES.map((b) => {
            const isSelected = selected.has(b.id);
            const color = COLORS[b.color];
            return (
              <div
                key={b.id}
                ref={(el) => {
                  elsRef.current[b.id] = el;
                }}
                onPointerDown={(e) => startDrag(b.id, e)}
                role="checkbox"
                aria-checked={isSelected}
                aria-label={b.label}
                className="absolute left-0 top-0 flex select-none items-center justify-center rounded-full text-[14px] font-normal transition-[background,color] duration-200"
                style={{
                  width: SIZE,
                  height: SIZE,
                  borderWidth: 1.5,
                  borderStyle: "solid",
                  borderColor: color,
                  background: isSelected ? color : "transparent",
                  color: isSelected ? "#ffffff" : color,
                  touchAction: "none",
                  willChange: "transform",
                }}
              >
                {b.label}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!hasSelection}
          className="flex h-[52px] items-center justify-center rounded-full bg-black px-6 text-[15px] font-normal text-white transition-opacity duration-200 disabled:opacity-25"
        >
          {ctaLabel}
        </button>
      </div>
    </section>
  );
}
