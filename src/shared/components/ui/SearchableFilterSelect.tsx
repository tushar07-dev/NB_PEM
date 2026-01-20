"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

type Props = {
  label: string;
  placeholder: string;
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  clearable?: boolean;
};

export function SearchableFilterSelect({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  required = false,
  disabled = false,
  error,
  className,
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  clearable = false,
}: Props) {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options]);

  React.useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  React.useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [open]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.("");
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Label with better typography */}
      <label className="font-500 color-primary-500 text-[length:var(--font-size-50)] tracking-wide uppercase">
        {label}
        {required && (
          <span className="text-destructive ml-1 transition-colors">*</span>
        )}
      </label>

      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectTrigger
          className={cn(
            // Base styles (Default State)
            "group relative h-10 w-full px-3 text-sm shadow-sm backdrop-blur-sm transition-all duration-200",
            "border-grey-200 bg-grey-100 rounded-xl border", // Using --color-grey-200 and --color-grey-100

            // Focused state (Matches --color-primary-100: #848F99)
            "focus:ring-ring/20 focus:border-primary-100 focus:ring-2 focus:outline-none",

            // Hover state
            "hover:border-primary-100 hover:bg-grey-100",

            // Error state
            error &&
              "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive/20",

            // Disabled state
            disabled && "cursor-not-allowed opacity-60 grayscale",

            // Value state (If selected, use --color-primary-500: #203446)
            value ? "font-500 text-color-primary-100" : "text-color-primary-500"
          )}
        >
          <div className="flex w-full items-center justify-between gap-2">
            <SelectValue placeholder={placeholder} />
            {clearable && value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className={cn(
                  "text-color-primary-300 rounded-md p-0.5 transition-all duration-200",
                  "hover:text-primary-500 hover:bg-grey-200", // Replaced slate-100 with grey-200
                  "focus:ring-primary-100/50 focus:ring-2 focus:outline-none"
                )}
                aria-label="Clear selection"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </SelectTrigger>

        <SelectContent
          className={cn(
            "border-grey-300 bg-grey-100 overflow-hidden rounded-xl border p-0 shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
          onCloseAutoFocus={(e) => {
            if (search) {
              e.preventDefault();
            }
          }}
        >
          {/* Search Input with enhanced styling */}
          <div className="bg-grey-100 sticky top-0 z-10 border-b border-slate-100 p-3 backdrop-blur-sm">
            <div className="relative">
              <Search className="text-color-primary-300 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors" />
              <input
                ref={searchInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className={cn(
                  "border-grey-300 bg-grey-100 h-9 w-full rounded-xl border pr-9 pl-9 text-sm transition-all duration-200",
                  "placeholder:text-color-primary-300",
                  "focus:border-border focus:ring-ring/20 focus:bg-grey-100 focus:ring-2 focus:outline-none",
                  "hover:border-border hover:bg-grey-100"
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className={cn(
                    "text-color-primary-300 absolute top-1/2 right-2.5 -translate-y-1/2 rounded-xl p-0.5 transition-all duration-200",
                    "hover:color-primary-500 hover:bg-slate-100",
                    "focus:ring-2 focus:ring-slate-300/50 focus:outline-none"
                  )}
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Results with scroll gradient */}
          <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300 relative max-h-64 overflow-y-auto">
            {/* Top gradient fade */}
            <div className="pointer-events-none sticky top-0 z-10 h-3 bg-gradient-to-b from-white to-transparent" />

            {filteredOptions.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
                <div className="rounded-full bg-slate-100 p-3">
                  <Search className="text-color-primary-300 size-5" />
                </div>
                <p className="font-500 color-primary-500 text-sm">
                  {emptyMessage}
                </p>
                <p className="text-color-primary-300 text-xs">
                  Try adjusting your search
                </p>
              </div>
            )}

            {filteredOptions.map((opt, index) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className={cn(
                  //   "cursor-pointer px-3 py-2.5 transition-colors duration-150",
                  "cursor-pointer px-3 py-2.5 transition-colors duration-150 outline-none",
                  // 1. highlighted state: color-grey-100 (#F9F9F9)
                  "data-[highlighted]:bg-grey-900 data-[highlighted]:text-white",

                  // 2. Selected state: color-primary-100 (#848F99)
                  "data-[state=checked]:bg-primary-100 data-[state=checked]:text-white",

                  // Font and Disabled logic
                  "font-400 data-[state=checked]:font-500",
                  opt.disabled &&
                    "cursor-not-allowed opacity-50 hover:bg-transparent",
                  // Subtle animation delay for staggered effect
                  search && "animate-in fade-in-0 slide-in-from-top-1"
                )}
                style={{
                  animationDelay: search ? `${index * 20}ms` : undefined,
                  animationDuration: search ? "200ms" : undefined,
                }}
              >
                {opt.label}
              </SelectItem>
            ))}

            {/* Bottom gradient fade */}
            <div className="pointer-events-none sticky bottom-0 z-10 h-3 bg-gradient-to-t from-white to-transparent" />
          </div>

          {/* Result count footer */}
          {search && filteredOptions.length > 0 && (
            <div className="bg-grey-100 border-t border-slate-100 px-3 py-2 backdrop-blur-sm">
              <p className="font-500 text-color-primary-500 text-xs">
                <span className="text-color-primary-700">
                  {filteredOptions.length}
                </span>{" "}
                of {options.length} results
              </p>
            </div>
          )}
        </SelectContent>
      </Select>

      {/* Error message with icon */}
      {error && (
        <div className="animate-in fade-in-0 slide-in-from-top-1 flex items-start gap-1.5">
          <svg
            className="text-destructive mt-0.5 size-3.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="font-500 text-xs text-red-600" role="alert">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
