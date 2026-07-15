"use client";

import { create } from "zustand";
import type { GradeBand, TimeRange } from "@/lib/data";

interface FilterState {
  timeRange: TimeRange;
  gradeBand: GradeBand;
  setTimeRange: (range: TimeRange) => void;
  setGradeBand: (band: GradeBand) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  timeRange: "12w",
  gradeBand: "All",
  setTimeRange: (timeRange) => set({ timeRange }),
  setGradeBand: (gradeBand) => set({ gradeBand }),
}));
