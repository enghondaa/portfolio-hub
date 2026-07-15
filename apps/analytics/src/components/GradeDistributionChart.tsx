"use client";

import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { useFilterStore } from "@/lib/store";
import { getGradeDistribution } from "@/lib/data";
import { ExportButton } from "@/components/ExportButton";

const WIDTH = 480;
const HEIGHT = 256;
const MARGIN = { top: 12, right: 12, bottom: 40, left: 36 };
const GRADES = ["A", "B", "C", "D", "F"];

/** Real D3.js: scaleBand (nested for grouped bars in compare mode)/scaleLinear, a manually-drawn axis, and a transitioned bar update — not a chart-library wrapper. */
export function GradeDistributionChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { timeRange, gradeBand, compareBand } = useFilterStore();
  const data = useMemo(() => getGradeDistribution(timeRange, gradeBand), [timeRange, gradeBand]);
  const compareData = useMemo(
    () => (compareBand ? getGradeDistribution(timeRange, compareBand) : null),
    [timeRange, compareBand]
  );

  const series = useMemo(
    () => [
      { key: gradeBand, values: data, color: "#8b7cf6" },
      ...(compareData ? [{ key: compareBand as string, values: compareData, color: "#22d3ee" }] : []),
    ],
    [gradeBand, data, compareBand, compareData]
  );

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    const innerWidth = WIDTH - MARGIN.left - MARGIN.right;
    const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

    const x0 = d3.scaleBand().domain(GRADES).range([0, innerWidth]).padding(0.3);
    const x1 = d3
      .scaleBand()
      .domain(series.map((s) => s.key))
      .range([0, x0.bandwidth()])
      .padding(0.15);

    const maxCount = d3.max(series.flatMap((s) => s.values.map((d) => d.count))) ?? 0;
    const y = d3.scaleLinear().domain([0, maxCount]).nice().range([innerHeight, 0]);

    let g = svg.select<SVGGElement>("g.plot-area");
    if (g.empty()) {
      g = svg.append("g").attr("class", "plot-area");
      g.append("g").attr("class", "y-axis");
      g.append("g").attr("class", "x-axis");
      g.append("g").attr("class", "groups");
      g.append("g").attr("class", "legend");
    }
    g.attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    g.select<SVGGElement>(".x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0).tickSize(0))
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

    const groups = g
      .select<SVGGElement>(".groups")
      .selectAll<SVGGElement, string>("g.grade-group")
      .data(GRADES, (d) => d)
      .join(
        (enter) => enter.append("g").attr("class", "grade-group"),
        (update) => update,
        (exit) => exit.remove()
      )
      .attr("transform", (d) => `translate(${x0(d) ?? 0},0)`);

    groups
      .selectAll<SVGRectElement, { key: string; count: number }>("rect")
      .data(
        (grade) => series.map((s) => ({ key: s.key, count: s.values.find((v) => v.grade === grade)?.count ?? 0, color: s.color })),
        (d) => d.key
      )
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("x", (d) => x1(d.key) ?? 0)
            .attr("width", x1.bandwidth())
            .attr("y", innerHeight)
            .attr("height", 0)
            .attr("rx", 5)
            .attr("fill", (d) => d.color)
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
              .attr("x", (d) => x1(d.key) ?? 0)
              .attr("width", x1.bandwidth())
              .attr("y", (d) => y(d.count))
              .attr("height", (d) => innerHeight - y(d.count))
              .attr("fill", (d) => d.color)
          ),
        (exit) => exit.remove()
      );

    const legend = g.select<SVGGElement>(".legend");
    legend
      .selectAll<SVGGElement, (typeof series)[number]>("g.legend-item")
      .data(series, (d) => d.key)
      .join(
        (enter) => {
          const item = enter.append("g").attr("class", "legend-item");
          item.append("rect").attr("width", 9).attr("height", 9).attr("rx", 2);
          item.append("text").attr("dx", 14).attr("dy", 8).attr("font-family", "var(--font-mono)").attr("font-size", 11);
          return item;
        },
        (update) => update,
        (exit) => exit.remove()
      )
      .attr("transform", (_d, i) => `translate(${i * 90},${innerHeight + 32})`)
      .call((sel) => sel.select("rect").attr("fill", (d) => d.color))
      .call((sel) => sel.select("text").attr("fill", "#9096a8").text((d) => d.key));
  }, [series]);

  const csvHeaders = ["Grade", ...series.map((s) => s.key)];
  const csvRows = GRADES.map((grade) => [grade, ...series.map((s) => s.values.find((v) => v.grade === grade)?.count ?? 0)]);

  return (
    <div>
      <div className="flex justify-end">
        <ExportButton
          filename={`grade-distribution-${gradeBand}-${timeRange}.csv`}
          headers={csvHeaders}
          rows={csvRows}
        />
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mt-3 h-64 w-full"
        role="img"
        aria-label="Bar chart of student grade distribution"
      />
    </div>
  );
}
