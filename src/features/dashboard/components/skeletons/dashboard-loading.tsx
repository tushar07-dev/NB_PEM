import { ChecklistWorkspaceSkeleton } from "./checklist-workspace-skeleton";
import { GlobalFilterSkeleton } from "./global-filter-skeleton";
import { ProjectHeroSkeleton } from "./project-hero-skeleton";

export const DashboardLoading = () => {
  return (
    // min-h-screen ensures it fills the page
    // grid-cols-12 gives us a flexible 12-column grid system
    <div className="grid min-h-screen grid-cols-12 gap-4 bg-slate-50 p-5">
      <div className="col-span-12">
        <GlobalFilterSkeleton />
      </div>

      <div className="col-span-12">
        <ProjectHeroSkeleton />
      </div>

      {/* Bottom Section: Split into Sidebar and Main Content */}
      <div className="col-span-12">
        <ChecklistWorkspaceSkeleton />
      </div>
    </div>
  );
};
