type Hit = {
  count: number;
  resetAt: number;
};

const windowMs = 60_000;
const windowSeconds = windowMs / 1000;
const maxAttempts = 5;
const hits = new Map<string, Hit>();

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwardedFor ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "local"
  );
}

async function checkUpstashRateLimit(key: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  try {
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, windowSeconds, "NX"],
        ["TTL", key]
      ])
    });

    if (!response.ok) {
      return null;
    }

    const results = (await response.json()) as Array<{ result?: unknown }>;
    const count = Number(results[0]?.result ?? 0);
    const ttl = Number(results[2]?.result ?? windowSeconds);

    return {
      success: count <= maxAttempts,
      retryAfter: count <= maxAttempts ? 0 : Math.max(1, ttl)
    };
  } catch {
    return null;
  }
}

function checkMemoryRateLimit(key: string) {
  const now = Date.now();
  const current = hits.get(key);

  if (!current || current.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, retryAfter: 0 };
  }

  if (current.count >= maxAttempts) {
    return {
      success: false,
      retryAfter: Math.ceil((current.resetAt - now) / 1000)
    };
  }

  current.count += 1;
  return { success: true, retryAfter: 0 };
}

export async function checkAuthRateLimit(request: Request, scope = "auth") {
  const ip = getClientIp(request);
  const key = `xerecard:${scope}:${ip}`;
  const sharedLimit = await checkUpstashRateLimit(key);

  return sharedLimit ?? checkMemoryRateLimit(key);
}
