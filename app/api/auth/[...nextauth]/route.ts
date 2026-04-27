import type { NextRequest } from "next/server";
import { handlers } from "@/lib/auth";
import { checkAuthRateLimit } from "@/lib/rate-limit";

export const GET = handlers.GET;

export async function POST(request: NextRequest) {
  const limit = checkAuthRateLimit(request);

  if (!limit.success) {
    return Response.json(
      { message: "Muitas tentativas. Tente novamente em instantes." },
      {
        status: 429,
        headers: {
          "retry-after": String(limit.retryAfter)
        }
      }
    );
  }

  return handlers.POST(request);
}
