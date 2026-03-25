import { NextRequest, NextResponse } from "next/server";

/**
 * In-memory rate limiter for the login endpoint.
 * Resets on server restart sufficient for a personal portfolio.
 * Allows MAX_ATTEMPTS login attempts per IP within WINDOW_MS.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 30 * 60 * 1000; // 30-minute lockout after max attempts

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record || now > record.resetAt) {
    // Fresh window
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  record.count += 1;

  if (record.count > MAX_ATTEMPTS) {
    // Extend lockout on each subsequent attempt
    record.resetAt = now + LOCKOUT_MS;
    return true;
  }

  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only rate-limit POST to /admin that are NOT Server Actions (i.e. the login form).
  // Server Actions always include a Next-Action header, skip those so the save
  // button is never treated as a login attempt.
  const isServerAction = req.headers.has("next-action");
  if (pathname === "/admin" && req.method === "POST" && !isServerAction) {
    const ip = getIP(req);
    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ error: "Too many login attempts. Try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "1800",
          },
        },
      );
    }
  }

  // Add security headers to all /admin responses
  const response = NextResponse.next();
  if (pathname.startsWith("/admin")) {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "no-referrer");
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate",
    );
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
