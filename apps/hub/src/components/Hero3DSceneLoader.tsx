"use client";

import dynamic from "next/dynamic";

// Purely decorative, purely client-side, and never allowed to affect the
// hero's first paint or LCP: loaded lazily after hydration, no SSR markup,
// no loading placeholder (nothing shifts layout since it's absolutely
// positioned and behind the real content).
const Hero3DScene = dynamic(() => import("@/components/Hero3DScene").then((m) => m.Hero3DScene), {
  ssr: false,
});

export function Hero3DSceneLoader() {
  return <Hero3DScene />;
}
