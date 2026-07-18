import { DemoDataBanner } from "@/components/DemoDataBanner";
import { FilterBar } from "@/components/FilterBar";
import { DashboardPanel } from "@/components/DashboardPanel";
import { KPISummary } from "@/components/KPISummary";
import { InsightCallout } from "@/components/InsightCallout";
import { Reveal } from "@/components/Reveal";
import { AttendancePanelLoader } from "@/components/AttendancePanelLoader";
import { GradeDistributionPanelLoader } from "@/components/GradeDistributionPanelLoader";
import { WellbeingPanelLoader } from "@/components/WellbeingPanelLoader";
import { AtRiskPanelLoader } from "@/components/AtRiskPanelLoader";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-accent)]">
          / analytics demo
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <h1 className="mt-5 font-[family-name:var(--font-heading)] text-[clamp(42px,7.5vw,86px)] font-bold leading-[0.95] tracking-[-0.035em] text-[var(--color-neutral-800)]">
          Four signals.
          <br />
          <span className="sheen">One answer.</span>
        </h1>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-[var(--color-neutral-600)]">
          Attendance, grades, and wellbeing rendered with D3 and Chart.js, plus a
          synthesized at-risk signal that combines all three to surface the students no
          single chart can find. Every figure is seeded and fictional.
        </p>
      </Reveal>

      <Reveal delay={0.18}>
        <div className="mt-11">
          <DemoDataBanner />
        </div>
      </Reveal>

      <Reveal delay={0.22}>
        <div className="mt-5">
          <FilterBar />
        </div>
      </Reveal>

      <div className="mt-7">
        <KPISummary />
      </div>

      <Reveal delay={0.1}>
        <div className="mt-5">
          <InsightCallout />
        </div>
      </Reveal>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Reveal>
          <DashboardPanel
            eyebrow="Attendance"
            title="Weekly attendance rate"
            description="Percent of enrolled students present, by week. Add a comparison band above to overlay a second line."
          >
            <AttendancePanelLoader />
          </DashboardPanel>
        </Reveal>

        <Reveal delay={0.08}>
          <DashboardPanel
            eyebrow="Grades"
            title="Grade distribution"
            description="Count of students per letter grade. Grouped bars appear when comparing two bands."
          >
            <GradeDistributionPanelLoader />
          </DashboardPanel>
        </Reveal>

        <div className="lg:col-span-2">
          <Reveal>
            <DashboardPanel
              eyebrow="Wellbeing"
              title="Weekly wellbeing heatmap"
              description="A seeded wellbeing score by weekday across the selected range. Hover a cell for its value and date."
            >
              <WellbeingPanelLoader />
            </DashboardPanel>
          </Reveal>
        </div>

        <div className="lg:col-span-2">
          <Reveal>
            <DashboardPanel
              eyebrow="At-risk"
              title="Students flagged across all three signals"
              description="Synthesized from the same seeded roster as the charts above — students below threshold on attendance, grades, and wellbeing at once."
            >
              <AtRiskPanelLoader />
            </DashboardPanel>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
