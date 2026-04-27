type Hit = {
  count: number;
  resetAt: number;
};

const windowMs = 60_000;
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

// In-memory rate limiting is process-local and intended for development/small deployments only.
// Use Redis/Upstash or another shared store before relying on this across serverless instances.
export function checkAuthRateLimit(request: Request) {
  const ip = getClientIp(request);
  const now = Date.now();
  const current = hits.get(ip);

  if (!current || current.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + windowMs });
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
