// src/shared/components/advanced-table/filters/SelectFilter.tsx

import { useState } from "react";
import { Check, X, Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { SelectFilterConfig, SelectFilterValue } from "../types";

interface SelectFilterProps {
  config: SelectFilterConfig;
  value: SelectFilterValue | string[] | null;
  onChange: (value: SelectFilterValue | null) => void;
  onClose: () => void;
}

export function SelectFilter({
  config,
  value,
  onChange,
  onClose,
}: SelectFilterProps) {
  const selectedValues = new Set(
    Array.isArray(value) ? value : value?.values || []
  );

  const [search, setSearch] = useState("");
  const [tempSelected, setTempSelected] = useState(selectedValues);

  const filteredOptions = config.searchable
    ? config.options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      )
    : config.options;

  const handleToggle = (optionValue: string) => {
    const newSelected = new Set(tempSelected);

    if (config.mode === "single") {
      newSelected.clear();
      newSelected.add(optionValue);
    } else {
      if (newSelected.has(optionValue)) {
        newSelected.delete(optionValue);
      } else {
        newSelected.add(optionValue);
      }
    }

    setTempSelected(newSelected);
  };

  const handleSelectAll = () => {
    if (tempSelected.size === config.options.length) {
      setTempSelected(new Set());
    } else {
      setTempSelected(new Set(config.options.map((opt) => opt.value)));
    }
  };

  const handleClear = () => {
    setTempSelected(new Set());
    onChange(null);
  };

  const handleApply = () => {
    if (tempSelected.size === 0) {
      onChange(null);
    } else {
      onChange({ values: Array.from(tempSelected) });
    }
    onClose();
  };

  return (
    <div className="w-80 space-y-3 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">
          Filter by {config.label || "options"}
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

      {/* Search */}
      {config.searchable && (
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search options..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9"
          />
        </div>
      )}

      {/* Select All (multi-select only) */}
      {config.mode !== "single" && (
        <button
          onClick={handleSelectAll}
          className="hover:bg-accent flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm"
        >
          <div
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded border",
              tempSelected.size === config.options.length
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input"
            )}
          >
            {tempSelected.size === config.options.length && (
              <Check className="h-3 w-3" />
            )}
          </div>
          <span className="font-medium">Select All</span>
        </button>
      )}

      {/* Options List */}
      <ScrollArea className="h-[240px]">
        <div className="space-y-1">
          {filteredOptions.map((option) => {
            const isSelected = tempSelected.has(option.value);

            return (
              <button
                key={option.value}
                onClick={() => handleToggle(option.value)}
                className="hover:bg-accent flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm"
              >
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input"
                  )}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </div>

                {option.icon && (
                  <option.icon className="text-muted-foreground h-4 w-4" />
                )}

                <span className="flex-1 text-left">{option.label}</span>

                {config.showCount && option.count !== undefined && (
                  <span className="text-muted-foreground text-xs">
                    {option.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Selected Count */}
      {tempSelected.size > 0 && (
        <div className="text-muted-foreground text-xs">
          {tempSelected.size} selected
        </div>
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
