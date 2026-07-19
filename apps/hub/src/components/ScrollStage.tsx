"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

/**
 * Vertical scroll drives horizontal movement, the effect Likova and friends use
 * a virtual-scroll library for.
 *
 * The difference is what it costs. Those sites set `overflow: hidden` on the
 * body, so the document genuinely never scrolls: the wheel feeds a number into
 * an animation loop and every section is placed with a transform. That buys the
 * eased feel and takes the real scrollbar with it — no scroll position for the
 * browser to restore, Ctrl+F can't jump to a match, and keyboard and
 * screen-reader users are navigating something the browser no longer thinks is
 * scrollable.
 *
 * Here the page scrolls normally. A tall spacer creates the distance, a sticky
 * child holds the stage still while that distance is consumed, and the only
 * thing being animated is one transform on one element. The scrollbar is real,
 * the position is restorable, and find-in-page still works.
 *
 * Two escape hatches, because a pinned strip is hostile if either fails:
 *   - No JS, or prefers-reduced-motion: renders as a plain horizontally
 *     scrollable strip with snap points. Nothing pins, nothing animates.
 *   - Keyboard focus: tabbing to a card off-stage would leave the browser
 *     trying to scroll an element that only moves via transform, so focus is
 *     caught and translated into the page scroll that brings it into view.
 */

function useMotionAllowed(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    // Server and first paint assume no motion, so the accessible strip is what
    // ships in the HTML and the pinned version is strictly an enhancement.
    () => false,
  );
}

export function ScrollStage({ children, label }: { children: ReactNode; label: string }) {
  const motionAllowed = useMotionAllowed();
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  // How far the track has to travel: its own width minus what's already visible.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !motionAllowed) return;
    const observer = new ResizeObserver(() => {
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [motionAllowed]);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track || !motionAllowed || distance === 0) return;

    let frame = 0;
    let current = 0;

    const tick = () => {
      const rect = pin.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      // 0 while the stage is arriving, 1 once its spacer is used up.
      const progress = travel <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / travel));
      const target = progress * distance;

      // Ease toward the target instead of snapping to it. This is the part that
      // reads as expensive, and it is one lerp on one element rather than a
      // reimplementation of scrolling.
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.1) current = target;

      track.style.transform = `translate3d(${-current}px, 0, 0)`;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [motionAllowed, distance]);

  // Tab lands on a card that is parked off-screen: convert where it sits along
  // the track into where the page needs to be for it to be on stage.
  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!pin || !track || !motionAllowed || distance === 0) return;

      const card = (event.target as HTMLElement).closest("[data-stage-item]");
      if (!card) return;

      const offset = (card as HTMLElement).offsetLeft;
      const ratio = Math.min(1, Math.max(0, (offset - window.innerWidth / 3) / distance));
      const travel = pin.offsetHeight - window.innerHeight;
      window.scrollTo({ top: pin.offsetTop + ratio * travel, behavior: "smooth" });
    },
    [motionAllowed, distance],
  );

  if (!motionAllowed) {
    return (
      <div
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:px-14"
        role="group"
        aria-label={label}
      >
        {children}
      </div>
    );
  }

  return (
    <div ref={pinRef} style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div
          ref={trackRef}
          onFocus={handleFocus}
          role="group"
          aria-label={label}
          className="flex gap-4 px-5 will-change-transform sm:px-14"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
