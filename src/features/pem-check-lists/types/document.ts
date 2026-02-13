// src/features/pem-checklists/types/document.ts
export interface DocumentFiltersType {
  discipline?: string;
  documentGroup?: string;
  documentType?: string;
  facilityCode?: string;
  system?: string;
  area?: string;
}

export interface DocumentRecord {
  id: string;
  title: string;
  documentNo: string;
  reasonForIssue: string;
  revisionStatus: string;
  revision: string;
  originator: string;
  checker: string;
  approver: string;
  status: "In Progress" | "Completed" | "Not Started";
}

export type {
  DataTableFilterField,
  FilterOption,
  PaginatedResponse,
  DataTableState,
} from "@/shared/components/data-table/types";


// // Table state management
// export interface TableState {
//   pagination: {
//     pageIndex: number;
//     pageSize: number;
//   };
//   sorting: {
//     id: string;
//     desc: boolean;
//   }[];
//   columnFilters: {
//     id: string;
//     value: unknown;
//   }[];
//   globalFilter: string;
//   rowSelection: Record<string, boolean>;
//   columnVisibility: Record<string, boolean>;
// }

// // Server response types
// export interface PaginatedResponse<T> {
//   data: T[];
//   total: number;
//   pageCount: number;
// }

// // Filter options
// export interface FilterOption {
//   label: string;
//   value: string;
//   icon?: React.ComponentType<{ className?: string }>;
// }

// export interface DataTableFilterField<TData> {
//   label: string;
//   value: keyof TData;
//   placeholder?: string;
//   options?: FilterOption[];
// }
