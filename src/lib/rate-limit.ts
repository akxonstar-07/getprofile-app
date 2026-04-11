/**
 * Simple in-memory rate limiter for API routes.
 * Usage:
 *   import { rateLimit } from "@/lib/rate-limit";
 *   const limiter = rateLimit({ interval: 60_000, uniqueTokensPerInterval: 500 });
 *   
 *   // In your route handler:
 *   const { success } = await limiter.check(10, identifier); // 10 requests per interval
 *   if (!success) return NextResponse.json({ error: "Rate limited" }, { status: 429 });
 */

interface RateLimitOptions {
  interval: number; // Time window in ms (e.g. 60_000 = 1 minute)
  uniqueTokensPerInterval: number; // Max unique tokens to track
}

interface TokenBucket {
  count: number;
  lastReset: number;
}

export function rateLimit(options: RateLimitOptions) {
  const tokenBuckets = new Map<string, TokenBucket>();

  return {
    check: (limit: number, token: string): Promise<{ success: boolean; remaining: number }> => {
      return new Promise((resolve) => {
        const now = Date.now();
        const bucket = tokenBuckets.get(token);

        if (!bucket || now - bucket.lastReset > options.interval) {
          // Reset or create bucket
          tokenBuckets.set(token, { count: 1, lastReset: now });

          // Prune old tokens if we exceed capacity
          if (tokenBuckets.size > options.uniqueTokensPerInterval) {
            const oldest = Array.from(tokenBuckets.entries())
              .sort((a, b) => a[1].lastReset - b[1].lastReset)
              .slice(0, tokenBuckets.size - options.uniqueTokensPerInterval);
            for (const [key] of oldest) {
              tokenBuckets.delete(key);
            }
          }

          resolve({ success: true, remaining: limit - 1 });
        } else {
          bucket.count += 1;
          if (bucket.count > limit) {
            resolve({ success: false, remaining: 0 });
          } else {
            resolve({ success: true, remaining: limit - bucket.count });
          }
        }
      });
    },
  };
}

// Pre-configured limiters for different route types
export const publicApiLimiter = rateLimit({
  interval: 60_000, // 1 minute window
  uniqueTokensPerInterval: 500,
});

export const authApiLimiter = rateLimit({
  interval: 60_000 * 15, // 15 minute window
  uniqueTokensPerInterval: 200,
});
