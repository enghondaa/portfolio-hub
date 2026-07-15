/** A static gradient bar matching the WellbeingHeatmap's d3.interpolateRgbBasis color scale (domain 30-96), with min/max labels so the color coding is actually readable. */
export function HeatmapLegend() {
  return (
    <div className="mt-4 flex items-center gap-3">
      <span className="font-mono text-[11px] text-[var(--color-neutral-600)]">30</span>
      <div
        className="h-2.5 w-40 rounded-full"
        style={{ background: "linear-gradient(to right, #3730a3, #8b7cf6, #22d3ee, #34d399)" }}
        aria-hidden="true"
      />
      <span className="font-mono text-[11px] text-[var(--color-neutral-600)]">96</span>
      <span className="font-mono text-[11px] text-[var(--color-neutral-400)]">— wellbeing score</span>
    </div>
  );
}
