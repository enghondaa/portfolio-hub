/**
 * A tiny in-memory token bucket, keyed by IP, for the login endpoint.
 *
 * This is per-serverless-instance and resets on cold start, so it is not a
 * hardened defence — a distributed attacker across warm instances would slip
 * through. It is enough to blunt casual brute-forcing of a demo login, and the
 * honest production answer (a shared store like Redis, or the platform's edge
 * rate limiter) is noted here rather than pretended.
 */
interface Bucket {
  tokens: number;
  updatedAt: number;
}

const BUCKETS = new Map<string, Bucket>();
const CAPACITY = 8; // burst
const REFILL_PER_SECOND = 8 / 60; // ~8 attempts/minute sustained

export function allowLoginAttempt(ip: string): boolean {
  const now = Date.now();
  const bucket = BUCKETS.get(ip) ?? { tokens: CAPACITY, updatedAt: now };

  const elapsedSeconds = (now - bucket.updatedAt) / 1000;
  bucket.tokens = Math.min(CAPACITY, bucket.tokens + elapsedSeconds * REFILL_PER_SECOND);
  bucket.updatedAt = now;

  if (bucket.tokens < 1) {
    BUCKETS.set(ip, bucket);
    return false;
  }
  bucket.tokens -= 1;
  BUCKETS.set(ip, bucket);
  return true;
}
