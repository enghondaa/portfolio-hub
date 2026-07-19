"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { formatEGP } from "@portfolio/orders-core";

const WIDTH = 900;
const HEIGHT = 220;
const MARGIN = { top: 12, right: 16, bottom: 24, left: 52 };

/** A D3-drawn area+line revenue chart — the direct-DOM pattern reused from the analytics dashboard, not a wrapper library. */
export function RevenueChart({ series }: { series: { date: string; cents: number }[] }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    const innerW = WIDTH - MARGIN.left - MARGIN.right;
    const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;

    const x = d3.scaleBand<string>().domain(series.map((d) => d.date)).range([0, innerW]).padding(0);
    const y = d3.scaleLinear().domain([0, d3.max(series, (d) => d.cents) ?? 1]).nice().range([innerH, 0]);

    let g = svg.select<SVGGElement>("g.plot");
    if (g.empty()) {
      g = svg.append("g").attr("class", "plot");
      g.append("g").attr("class", "y-axis");
      g.append("path").attr("class", "area");
      g.append("path").attr("class", "line");
    }
    g.attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    g.select<SVGGElement>(".y-axis")
      .call(d3.axisLeft(y).ticks(4).tickFormat((v) => formatEGP(Number(v))).tickSize(-innerW))
      .call((sel) => sel.select(".domain").remove())
      .call((sel) => sel.selectAll("line").attr("stroke", "rgba(30,41,59,0.08)"))
      .selectAll("text")
      .attr("fill", "#94a3b8")
      .attr("font-family", "var(--font-mono)")
      .attr("font-size", 10);

    const px = (d: { date: string }) => (x(d.date) ?? 0) + x.bandwidth() / 2;

    const area = d3.area<{ date: string; cents: number }>().x(px).y0(innerH).y1((d) => y(d.cents)).curve(d3.curveMonotoneX);
    const line = d3.line<{ date: string; cents: number }>().x(px).y((d) => y(d.cents)).curve(d3.curveMonotoneX);

    g.select<SVGPathElement>(".area")
      .datum(series)
      .attr("fill", "rgba(79,70,229,0.12)")
      .attr("d", area);
    g.select<SVGPathElement>(".line")
      .datum(series)
      .attr("fill", "none")
      .attr("stroke", "#4f46e5")
      .attr("stroke-width", 2)
      .attr("d", line);
  }, [series]);

  return <svg ref={ref} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-56 w-full" role="img" aria-label="Revenue over the last 30 days" />;
}
