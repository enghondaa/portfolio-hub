"use client";

import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { useFilterStore } from "@/lib/store";
import { formatWeekLabel, getWellbeingHeatmap } from "@/lib/data";

const CELL = 34;
const GAP = 5;
const MARGIN = { top: 8, left: 34 };
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

/** D3-driven grid heatmap: week on the x-axis, weekday on the y-axis, color mapped through a sequential scale. */
export function WellbeingHeatmap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { timeRange, gradeBand } = useFilterStore();
  const cells = useMemo(() => getWellbeingHeatmap(timeRange, gradeBand), [timeRange, gradeBand]);
  const weeks = useMemo(() => Array.from(new Set(cells.map((c) => c.week))), [cells]);

  const width = MARGIN.left + weeks.length * (CELL + GAP);
  const height = MARGIN.top + WEEKDAYS.length * (CELL + GAP);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    const color = d3.scaleSequential(d3.interpolateRgbBasis(["#3730a3", "#8b7cf6", "#22d3ee", "#34d399"])).domain([30, 96]);

    let labels = svg.select<SVGGElement>("g.day-labels");
    if (labels.empty()) {
      labels = svg.append("g").attr("class", "day-labels");
    }
    labels
      .selectAll<SVGTextElement, string>("text")
      .data(WEEKDAYS)
      .join("text")
      .attr("x", MARGIN.left - 10)
      .attr("y", (_d, i) => MARGIN.top + i * (CELL + GAP) + CELL / 2 + 4)
      .attr("text-anchor", "end")
      .attr("fill", "#9096a8")
      .attr("font-family", "var(--font-mono)")
      .attr("font-size", 11)
      .text((d) => d);

    let grid = svg.select<SVGGElement>("g.cells");
    if (grid.empty()) grid = svg.append("g").attr("class", "cells");

    grid
      .selectAll<SVGRectElement, (typeof cells)[number]>("rect")
      .data(cells, (d) => `${d.week}-${d.day}`)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("x", (d) => MARGIN.left + weeks.indexOf(d.week) * (CELL + GAP))
            .attr("y", (d) => MARGIN.top + WEEKDAYS.indexOf(d.day) * (CELL + GAP))
            .attr("width", CELL)
            .attr("height", CELL)
            .attr("rx", 7)
            .attr("fill", "rgba(226,229,240,0.04)")
            .call((enter) =>
              enter
                .transition()
                .duration(450)
                .attr("fill", (d) => color(d.score))
            )
            .call((enter) => enter.append("title").text((d) => `Week of ${formatWeekLabel(d.week)}, ${d.day}: wellbeing score ${d.score}`)),
        (update) =>
          update.call((update) =>
            update
              .transition()
              .duration(450)
              .attr("x", (d) => MARGIN.left + weeks.indexOf(d.week) * (CELL + GAP))
              .attr("fill", (d) => color(d.score))
          ),
        (exit) => exit.remove()
      );
  }, [cells, weeks]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ maxWidth: width }}
      role="img"
      aria-label="Heatmap of weekly student wellbeing scores by weekday"
    />
  );
}
