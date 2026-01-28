import { AssignmentCard } from "../components/AssignmentCard";
import { ChecklistFilters } from "../components/ChecklistFilters";
import { ChecklistTable } from "../components/ChecklistTable";
import { DocumentList } from "../components/DocumentList";
import { useSidebar } from "@/shared/components/ui/sidebar";

export const DocumentChecklist = () => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  const dynamicGap = isExpanded ? "gap-2 lg:gap-4" : "gap-6";
  const dynamicPadding = isExpanded ? "p-2 lg:p-4" : "p-4 lg:p-6";
  return (
    <div
      className={`grid grid-cols-1 ${dynamicGap} ${dynamicPadding} transition-all duration-300 md:grid-cols-12`}
    >
      <div className="col-span-1 md:col-span-9">
        <ChecklistFilters />
      </div>

      <div className="col-span-1 md:col-span-3">
        <AssignmentCard />
      </div>
      <div className="order-2 col-span-1 md:order-none md:col-span-3">
        <DocumentList />
      </div>
      <div className="order-1 col-span-1 overflow-x-auto md:order-none md:col-span-9">
        <ChecklistTable />
      </div>
    </div>
  );
};
