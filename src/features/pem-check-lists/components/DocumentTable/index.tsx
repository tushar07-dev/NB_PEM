// src/features/pem-checklists/components/DocumentTable/index.ts
import { FilterStoreProvider } from "@/shared/context/FilterStoreContext";
import { DocumentTableInner } from "./DocumentTableInner";
import { type DocumentFiltersType } from "../../types/document";

interface Props {
  enabled: boolean;
  filters: DocumentFiltersType;
}

export function DocumentTable(props: Props) {
  return (
    <FilterStoreProvider name="documents">
      <DocumentTableInner {...props} />
    </FilterStoreProvider>
  );
}