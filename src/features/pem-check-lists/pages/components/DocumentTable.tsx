
import { DataTable } from "@/shared/components/data-table/DataTable";
import { documentColumns } from "./DocumentColumns";
import { documentTableFilterFields } from "./documenttablefilters";
import type { DocumentRecord } from "../../types/document";

interface DocumentTableProps {
  data: DocumentRecord[];
  isLoading?: boolean;
}

export function DocumentTable({ data, isLoading }: DocumentTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-muted-foreground">Loading documents...</div>
      </div>
    );
  }

  return (
    <DataTable
      columns={documentColumns}
      data={data}
      filterFields={documentTableFilterFields}
      defaultPageSize={10}
    />
  );
}