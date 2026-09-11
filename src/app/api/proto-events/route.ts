import { NextResponse } from "next/server";
import { ALLOWED_EVENTS, EVENTS_HASH } from "@/lib/proto/events";
import { hincrby, isKvConfigured } from "@/lib/proto/kv";

export const runtime = "edge";

/**
 * POST /api/proto-events
 * Body: { event: string }
 *
 * Validates against the allowlist, then HINCRBYs the matching field in the
 * shared events hash. Returns 204 on success — there's nothing for the
 * client to do with the response, this is fire-and-forget telemetry.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const event =
    body && typeof body === "object" && "event" in body
      ? (body as { event: unknown }).event
      : null;

  if (typeof event !== "string" || !ALLOWED_EVENTS.has(event)) {
    return NextResponse.json({ error: "unknown event" }, { status: 400 });
  }

  // No KV configured (local dev, preview deploys without integration): accept
  // silently so the client doesn't think it's broken.
  if (!isKvConfigured()) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    await hincrby(EVENTS_HASH, event, 1);
  } catch (e) {
    console.warn("[proto-events] hincrby failed", e);
    // Still 204 — we don't want to leak infra errors back to the client.
  }
  return new NextResponse(null, { status: 204 });
}
