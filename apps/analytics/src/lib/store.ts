"use client";

import { create } from "zustand";
import type { GradeBand, TimeRange } from "@/lib/data";

interface FilterState {
  timeRange: TimeRange;
  gradeBand: GradeBand;
  /** A second grade band to overlay on the attendance/grade charts, or null when comparison mode is off. */
  compareBand: GradeBand | null;
  setTimeRange: (range: TimeRange) => void;
  setGradeBand: (band: GradeBand) => void;
  setCompareBand: (band: GradeBand | null) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  timeRange: "12w",
  gradeBand: "All",
  compareBand: null,
  setTimeRange: (timeRange) => set({ timeRange }),
  setGradeBand: (gradeBand) => set({ gradeBand }),
  setCompareBand: (compareBand) => set({ compareBand }),
}));
