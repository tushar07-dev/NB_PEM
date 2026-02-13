// src/shared/components/advanced-table/filters/TextFilter.tsx

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { TextFilterConfig, TextFilterValue } from "../types";

interface TextFilterProps {
  config: TextFilterConfig;
  value: TextFilterValue | string | null;
  onChange: (value: TextFilterValue | null) => void;
  onClose: () => void;
}

export function TextFilter({
  config,
  value,
  onChange,
  onClose,
}: TextFilterProps) {
  const operators = config.operators || ["contains"];
  const defaultOperator = operators[0];

  const [operator, setOperator] = useState<string>(
    typeof value === "object" && value !== null
      ? value.operator
      : defaultOperator
  );
  const [searchValue, setSearchValue] = useState<string>(
    typeof value === "string" ? value : value?.value || ""
  );
  const [caseSensitive, setCaseSensitive] = useState<boolean>(
    typeof value === "object" && value !== null
      ? value.caseSensitive || false
      : false
  );

  // Debounce
  useEffect(() => {
    if (config.debounceMs) {
      const timeout = setTimeout(() => {
        applyFilter();
      }, config.debounceMs);
      return () => clearTimeout(timeout);
    }
  }, [searchValue, operator, caseSensitive]);

  const applyFilter = () => {
    if (!searchValue.trim()) {
      onChange(null);
      return;
    }

    onChange({
      operator: operator as any,
      value: searchValue,
      caseSensitive,
    });
  };

  const handleClear = () => {
    setSearchValue("");
    setOperator(defaultOperator);
    setCaseSensitive(false);
    onChange(null);
  };

  const handleApply = () => {
    applyFilter();
    onClose();
  };

  return (
    <div className="w-80 space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">
          Filter by {config.label || "text"}
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Operator Selection (if multiple operators) */}
      {operators.length > 1 && (
        <Select value={operator} onValueChange={setOperator}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {operators.map((op) => (
              <SelectItem key={op} value={op}>
                {operatorLabels[op]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder={config.placeholder || "Search..."}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleApply();
          }}
          className="pl-9"
          autoFocus
        />
      </div>

      {/* Case Sensitive Toggle */}
      {config.caseSensitive !== false && (
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded border-gray-300"
          />
          Case sensitive
        </label>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="flex-1"
        >
          Clear
        </Button>
        <Button size="sm" onClick={handleApply} className="flex-1">
          Apply
        </Button>
      </div>
    </div>
  );
}

const operatorLabels: Record<string, string> = {
  contains: "Contains",
  equals: "Equals",
  startsWith: "Starts with",
  endsWith: "Ends with",
  notContains: "Does not contain",
};
