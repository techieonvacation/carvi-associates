type Bucket = { hits: number[]; };

const globalForLimiter = globalThis as unknown as {
  carviRateBuckets?: Map<string, Bucket>;
};

const buckets = (globalForLimiter.carviRateBuckets ??= new Map<string, Bucket>());

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 10 * 60 * 1000 } = {},
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  const hits = bucket.hits.filter((time) => now - time < windowMs);

  if (hits.length >= limit) {
    const retryAfterSeconds = Math.ceil((windowMs - (now - hits[0])) / 1000);
    buckets.set(key, { hits });
    return { allowed: false, retryAfterSeconds };
  }

  hits.push(now);
  buckets.set(key, { hits });

  if (buckets.size > 5000) {
    for (const [bucketKey, value] of buckets) {
      if (value.hits.every((time) => now - time >= windowMs)) buckets.delete(bucketKey);
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}
