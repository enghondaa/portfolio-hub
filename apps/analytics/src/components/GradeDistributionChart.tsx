"use client";

import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { useFilterStore } from "@/lib/store";
import { getGradeDistribution } from "@/lib/data";

const WIDTH = 480;
const HEIGHT = 256;
const MARGIN = { top: 12, right: 12, bottom: 28, left: 36 };

/** Real D3.js: scaleBand/scaleLinear, a manually-drawn axis, and a transitioned bar update — not a chart-library wrapper. */
export function GradeDistributionChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { timeRange, gradeBand } = useFilterStore();
  const data = useMemo(() => getGradeDistribution(timeRange, gradeBand), [timeRange, gradeBand]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    const innerWidth = WIDTH - MARGIN.left - MARGIN.right;
    const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.grade))
      .range([0, innerWidth])
      .padding(0.35);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count) ?? 0])
      .nice()
      .range([innerHeight, 0]);

    let g = svg.select<SVGGElement>("g.plot-area");
    if (g.empty()) {
      g = svg.append("g").attr("class", "plot-area");
      g.append("g").attr("class", "y-axis");
      g.append("g").attr("class", "x-axis");
      g.append("g").attr("class", "bars");
    }
    g.attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    g.select<SVGGElement>(".x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call((sel) => sel.select(".domain").attr("stroke", "rgba(226,229,240,0.15)"))
      .selectAll("text")
      .attr("fill", "#9096a8")
      .attr("font-family", "var(--font-mono)")
      .attr("font-size", 11);

    g.select<SVGGElement>(".y-axis")
      .call(d3.axisLeft(y).ticks(4).tickSize(-innerWidth))
      .call((sel) => sel.select(".domain").remove())
      .call((sel) => sel.selectAll("line").attr("stroke", "rgba(226,229,240,0.06)"))
      .selectAll("text")
      .attr("fill", "#9096a8")
      .attr("font-family", "var(--font-mono)")
      .attr("font-size", 11);

    const color = d3
      .scaleOrdinal<string>()
      .domain(["A", "B", "C", "D", "F"])
      .range(["#8b7cf6", "#a99bff", "#22d3ee", "#6b7180", "#fb7185"]);

    g.select<SVGGElement>(".bars")
      .selectAll<SVGRectElement, (typeof data)[number]>("rect")
      .data(data, (d) => d.grade)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("x", (d) => x(d.grade) ?? 0)
            .attr("width", x.bandwidth())
            .attr("y", innerHeight)
            .attr("height", 0)
            .attr("rx", 6)
            .attr("fill", (d) => color(d.grade))
            .call((enter) =>
              enter
                .transition()
                .duration(500)
                .attr("y", (d) => y(d.count))
                .attr("height", (d) => innerHeight - y(d.count))
            ),
        (update) =>
          update.call((update) =>
            update
              .transition()
              .duration(500)
              .attr("x", (d) => x(d.grade) ?? 0)
              .attr("width", x.bandwidth())
              .attr("y", (d) => y(d.count))
              .attr("height", (d) => innerHeight - y(d.count))
          ),
        (exit) => exit.remove()
      );
  }, [data]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-64 w-full"
      role="img"
      aria-label="Bar chart of student grade distribution"
    />
  );
}
