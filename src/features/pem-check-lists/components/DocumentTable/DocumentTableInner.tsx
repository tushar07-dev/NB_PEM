// src/features/pem-checklists/components/DocumentTable/DocumentTableInner.tsx
import { AlertCircle, FileSearch, FileX } from "lucide-react";
import { DataTable } from "@/shared/components/data-table/data-table";
import { ALL_USERS } from "@/shared/config/users";
import { DocumentWorkflowDialog } from "../../pages/components/DocumentWorkflowDialog";
import { type DocumentFiltersType } from "../../types/document";
import { useDocumentTable } from "../../hooks/use-document-table";
import { RevHistoryModal } from "./RevHistoryModal";

interface Props {
  enabled: boolean;
  filters: DocumentFiltersType;
}

export function DocumentTableInner({ enabled, filters }: Props) {
  const {
    table, isLoading, isError, error,
    selectedRow, isModalOpen, setIsModalOpen,
    dialogState, workflowRow, responsibilities, isSaving,
    setResponsibilities,
    handleRowClick, handleWorkflowSave,
    handleWorkflowViewOnly, handleCloseWorkflow,
  } = useDocumentTable(enabled, filters); // ← filters now passed to hook

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <AlertCircle className="text-destructive h-12 w-12" />
        <h3 className="text-lg font-semibold">Failed to load documents</h3>
        <p className="text-muted-foreground text-sm">{error?.message ?? "An unexpected error occurred"}</p>
      </div>
    );
  }

  const emptyState = !enabled ? (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="bg-grey-200 rounded-full p-4"><FileSearch className="text-primary-100 size-8" /></div>
      <p className="text-primary-500 font-medium">Select required filters</p>
      <p className="text-primary-100 text-sm leading-relaxed">
        Please select <span className="text-primary-500 font-medium">Project</span>,{" "}
        <span className="text-primary-500 font-medium">Discipline</span>,{" "}
        <span className="text-primary-500 font-medium">Document Group</span>, and{" "}
        <span className="text-primary-500 font-medium">Document Type</span> to view documents.
      </p>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="bg-grey-200 rounded-full p-4"><FileX className="text-primary-100 size-8" /></div>
      <p className="text-primary-500 font-medium">No documents found</p>
      <p className="text-primary-100 text-sm">Try adjusting your filter selections.</p>
    </div>
  );

  return (
    <>
      <DataTable
        table={table}
        onRowClick={handleRowClick}
        emptyState={emptyState}
        loading={isLoading}
        loadingRowCount={8}
      />

      <DocumentWorkflowDialog
        key={workflowRow?.id ?? "no-row"}
        {...dialogState}
        onClose={handleCloseWorkflow}
        userOptions={ALL_USERS}
        values={responsibilities}
        onChange={setResponsibilities}
        onSave={handleWorkflowSave}
        onViewOnly={handleWorkflowViewOnly}
        isSaving={isSaving}
      />

      <RevHistoryModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        row={selectedRow}
      />
    </>
  );
}