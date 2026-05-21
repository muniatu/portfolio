/**
 * Minimal Upstash Redis REST wrapper. We hit the REST API directly instead
 * of pulling in `@vercel/kv` / `@upstash/redis` — we only need HINCRBY and
 * HGETALL, and avoiding the dep keeps the bundle small.
 *
 * Env vars (Vercel injects these when you connect a KV/Upstash integration):
 *   - KV_REST_API_URL
 *   - KV_REST_API_TOKEN
 *
 * If they're missing (local dev without KV), every call no-ops gracefully
 * and `hgetall` returns an empty object — the stats component then shows a
 * placeholder instead of throwing.
 */

function kvConfig() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

export function isKvConfigured() {
  return kvConfig() !== null;
}

async function call<T>(path: string[]): Promise<T | null> {
  const cfg = kvConfig();
  if (!cfg) return null;
  const res = await fetch(
    `${cfg.url}/${path.map(encodeURIComponent).join("/")}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.token}` },
      cache: "no-store",
    },
  );
  if (!res.ok) {
    console.warn("[kv] request failed", res.status, path[0]);
    return null;
  }
  const json = (await res.json()) as { result: T };
  return json.result;
}

/** Atomically increment a hash field by 1. Returns the new value, or null. */
export function hincrby(key: string, field: string, by = 1) {
  return call<number>(["hincrby", key, field, String(by)]);
}

/** Read the full hash. Returns {} when KV is not configured. */
export async function hgetall(key: string): Promise<Record<string, string>> {
  const result = await call<unknown>(["hgetall", key]);
  if (!result) return {};
  // Upstash REST returns either an object or a flat [k, v, k, v] array
  // depending on version. Normalize both shapes.
  if (Array.isArray(result)) {
    const out: Record<string, string> = {};
    for (let i = 0; i < result.length; i += 2) {
      const k = result[i];
      const v = result[i + 1];
      if (typeof k === "string") out[k] = String(v ?? "");
    }
    return out;
  }
  if (result && typeof result === "object") {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(result as Record<string, unknown>)) {
      out[k] = String(v ?? "");
    }
    return out;
  }
  return {};
}
