import { allowLoginAttempt } from "@/lib/rate-limit";

describe("allowLoginAttempt", () => {
  it("allows an initial burst then blocks", () => {
    const ip = "203.0.113.1";
    let allowed = 0;
    for (let i = 0; i < 20; i++) if (allowLoginAttempt(ip)) allowed++;
    // Capacity is 8; a tight loop refills a negligible amount.
    expect(allowed).toBeGreaterThanOrEqual(8);
    expect(allowed).toBeLessThan(20);
  });

  it("tracks buckets per IP independently", () => {
    for (let i = 0; i < 20; i++) allowLoginAttempt("203.0.113.2");
    expect(allowLoginAttempt("203.0.113.99")).toBe(true);
  });
});
