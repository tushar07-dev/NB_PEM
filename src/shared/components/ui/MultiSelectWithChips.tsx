"use client";

import * as React from "react";
import { Check, Search, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/shared/components/ui/command";

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

type Props = {
  label: string;
  placeholder: string;
  options: Option[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxDisplay?: number;
};

export function MultiSelectWithChips({
  label,
  placeholder,
  options,
  value = [],
  onValueChange,
  required = false,
  disabled = false,
  error,
  className,
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  maxDisplay = 3,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onValueChange?.(newValue);
  };

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.(value.filter((v) => v !== optionValue));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.([]);
  };

  const selectedOptions = options.filter((opt) => value.includes(opt.value));
  const displayedChips = selectedOptions.slice(0, maxDisplay);
  const remainingCount = selectedOptions.length - maxDisplay;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Label */}
      <label className="text-[11px] font-medium text-slate-500">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      {/* Popover Trigger */}
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "h-10 w-full justify-between border-slate-200 bg-[#F8F9FA] text-left font-normal hover:bg-white focus:ring-1 focus:ring-slate-300",
              error && "border-red-300 bg-red-50/50 focus:ring-red-400/20",
              disabled && "cursor-not-allowed opacity-60",
              value.length > 0 ? "text-slate-900" : "text-slate-400"
            )}
          >
            <span className="truncate">
              {value.length === 0 ? placeholder : `${value.length} selected`}
            </span>
            <ChevronDown
              className={cn(
                "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-full p-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center gap-2 py-6">
                <div className="rounded-full bg-slate-100 p-3">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600">
                  {emptyMessage}
                </p>
              </div>
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    onSelect={() => {
                      if (!option.disabled) {
                        toggleOption(option.value);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded border-2 transition-all",
                        isSelected
                          ? "border-slate-700 bg-slate-700"
                          : "border-slate-300 bg-white"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {/* Footer */}
            {value.length > 0 && (
              <div className="flex items-center justify-between border-t bg-slate-50/80 px-3 py-2">
                <p className="text-xs font-medium text-slate-500">
                  <span className="text-slate-700">{value.length}</span>{" "}
                  selected
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs font-medium text-slate-600 transition-colors hover:text-slate-900"
                >
                  Clear all
                </button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Chips */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {displayedChips.map((opt) => (
            <div
              key={opt.value}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs transition-all hover:border-slate-300 hover:bg-slate-100"
            >
              <span className="font-medium text-slate-700">{opt.label}</span>
              <button
                type="button"
                onClick={(e) => removeOption(opt.value, e)}
                disabled={disabled}
                className={cn(
                  "rounded p-0.5 text-slate-400 transition-all hover:bg-slate-200 hover:text-slate-600",
                  disabled && "cursor-not-allowed opacity-50"
                )}
                aria-label={`Remove ${opt.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {remainingCount > 0 && (
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
              +{remainingCount}
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-1.5">
          <svg
            className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs font-medium text-red-600" role="alert">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
