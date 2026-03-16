// src/shared/components/data-table/data-table-global-search.tsx
//
// Debounced global text search input for DataTable.
// Writes globalSearchTerm to the isolated FilterStoreContext store.
// useDataTable reads it and filters rows across searchableColumns.
//
// Usage inside DataTableAdvancedToolbar:
//   <DataTableGlobalSearch placeholder="Search checkpoints..." />

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { useDebouncedCallback } from "@/shared/hooks/data-table/use-debounced-callback";
import { useGlobalSearchTermFromContext } from "@/shared/context/FilterStoreContext";

const DEBOUNCE_MS = 300;

interface DataTableGlobalSearchProps {
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export function DataTableGlobalSearch({
  placeholder = "Search...",
  className,
  debounceMs = DEBOUNCE_MS,
}: DataTableGlobalSearchProps) {
  const { globalSearchTerm, setGlobalSearchTerm } =
    useGlobalSearchTermFromContext();

  // Local input value for immediate UI feedback while debounce fires
  const [inputValue, setInputValue] = React.useState(globalSearchTerm);

  const debouncedSet = useDebouncedCallback(setGlobalSearchTerm, debounceMs);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      debouncedSet(value);
    },
    [debouncedSet]
  );

  const handleClear = React.useCallback(() => {
    setInputValue("");
    setGlobalSearchTerm("");
  }, [setGlobalSearchTerm]);

  // Sync local state if store is reset externally (e.g. Reset filters button)
  React.useEffect(() => {
    if (globalSearchTerm === "" && inputValue !== "") {
      setInputValue("");
    }
  }, [globalSearchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={cn("relative flex items-center", className)}>
      <Search className="text-muted-foreground pointer-events-none absolute left-2.5 size-3.5 shrink-0" />
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className="h-8 w-48 pr-7 pl-8 text-sm lg:w-64"
        aria-label={placeholder}
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2 flex size-4 items-center justify-center rounded-full transition-colors hover:opacity-70"
        >
          <X className="text-muted-foreground size-3" />
        </button>
      )}
    </div>
  );
}
