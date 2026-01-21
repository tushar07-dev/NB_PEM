import { AssignmentCard } from "../components/AssignmentCard";
import { ChecklistFilters } from "../components/ChecklistFilters";
import { ChecklistTable } from "../components/ChecklistTable";
import { DocumentList } from "../components/DocumentList";

export const DocumentChecklist = () => {
  return (
    <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-12 md:p-6">
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
