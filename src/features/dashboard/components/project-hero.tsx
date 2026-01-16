import { Card } from "@/shared/components/ui/card";
import { ProjectInfoHead } from "./project-info-head";
import { ProjectMetaGrid } from "./project-meta-grid";
import { ProgressDonut } from "./progress-donut";
import { ProgressStatsList } from "./progress-stats-list";

const mockData = {
  pemStage: "2B",
  discipline: "HVAC",
  docGroup: "ENG",
  docTitle: "D&ID FOR XXXXX1",
  docType: "XC",
  docNumber: "C143-AS-H-XC-00020-01",
  revision: "09",
  issuedFor: "IFC",
  stats: {
    yes: 200,
    no: 400,
    na: 98,
    current: 698,
    total: 1000
  }
};

export function ProjectHero() {
  return (
    <Card className="flex flex-col justify-between gap-8 p-8 lg:flex-row">
      {/* Left Column: Project Details */}
      <div className="flex-1 space-y-6">
        <ProjectInfoHead title="Project 01" />
        <ProjectMetaGrid data={mockData} />
      </div>

      {/* Right Column: Progress Analytics */}
      <div className="flex items-center gap-10 border-l pl-10">
        <ProgressDonut current={698} total={1000} />
        <ProgressStatsList yes={200} no={400} na={98} />
      </div>
    </Card>
  );
}
