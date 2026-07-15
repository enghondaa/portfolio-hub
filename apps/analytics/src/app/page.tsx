import { DemoDataBanner } from "@/components/DemoDataBanner";
import { FilterBar } from "@/components/FilterBar";
import { DashboardPanel } from "@/components/DashboardPanel";
import { KPISummary } from "@/components/KPISummary";
import { InsightCallout } from "@/components/InsightCallout";
import { AttendancePanelLoader } from "@/components/AttendancePanelLoader";
import { GradeDistributionPanelLoader } from "@/components/GradeDistributionPanelLoader";
import { WellbeingPanelLoader } from "@/components/WellbeingPanelLoader";
import { AtRiskPanelLoader } from "@/components/AtRiskPanelLoader";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
      <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)]">/ analytics demo</p>
      <h1 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-[var(--color-neutral-800)] sm:text-4xl">
        School analytics dashboard
      </h1>
      <p className="mt-2 max-w-2xl text-[var(--color-neutral-600)]">
        Attendance trends, grade distribution, wellbeing, and a synthesized at-risk signal — the
        same D3.js/Chart.js pattern behind the dashboards I build at Youhue, here with fully
        seeded, fictional data.
      </p>

      <div className="mt-6">
        <DemoDataBanner />
      </div>

      <div className="mt-6">
        <FilterBar />
      </div>

      <div className="mt-6">
        <KPISummary />
      </div>

      <div className="mt-5">
        <InsightCallout />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <DashboardPanel
          eyebrow="Attendance"
          title="Weekly attendance rate"
          description="Percent of enrolled students present, by week, for the selected grade band. Add a comparison band above to overlay a second line."
        >
          <AttendancePanelLoader />
        </DashboardPanel>

        <DashboardPanel
          eyebrow="Grades"
          title="Grade distribution"
          description="Count of students per letter grade, for the selected range and grade band. Grouped bars appear when comparing two bands."
        >
          <GradeDistributionPanelLoader />
        </DashboardPanel>

        <div className="lg:col-span-2">
          <DashboardPanel
            eyebrow="Wellbeing"
            title="Weekly wellbeing heatmap"
            description="A seeded wellbeing score by weekday, across the selected time range. Hover a cell for its value and date."
          >
            <WellbeingPanelLoader />
          </DashboardPanel>
        </div>

        <div className="lg:col-span-2">
          <DashboardPanel
            eyebrow="At-risk"
            title="Students flagged across all three signals"
            description="Synthesized from the same seeded roster as the charts above — students below threshold on attendance, grades, and wellbeing at once."
          >
            <AtRiskPanelLoader />
          </DashboardPanel>
        </div>
      </div>
    </div>
  );
}
