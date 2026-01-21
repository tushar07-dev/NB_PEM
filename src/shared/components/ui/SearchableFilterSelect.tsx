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

type Size = "sm" | "md" | "lg";

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
  size?: Size;
};

// Size variant configurations
const SIZE_VARIANTS = {
  sm: {
    trigger: "h-8 px-2 text-xs",
    label: "text-[10px] gap-1",
    input: "h-7 text-xs pl-7 pr-7",
    searchIcon: "size-3 left-2",
    clearIcon: "size-3",
    clearButton: "right-2",
    item: "py-1.5 px-2 text-xs",
    itemIcon: "size-3",
    maxHeight: "max-h-48",
    searchContainer: "p-2",
    footer: "px-2 py-1.5 text-[10px]",
    error: "text-[10px]",
    errorIcon: "size-3",
    emptyIcon: "size-4 p-2",
    emptyText: "text-xs",
    emptySubtext: "text-[10px]",
    gap: "gap-1",
  },
  md: {
    trigger: "h-10 px-3 text-sm",
    label: "text-xs gap-1.5",
    input: "h-9 text-sm pl-9 pr-9",
    searchIcon: "size-4 left-3",
    clearIcon: "size-3.5",
    clearButton: "right-2.5",
    item: "py-2.5 px-3 text-sm",
    itemIcon: "size-4",
    maxHeight: "max-h-64",
    searchContainer: "p-3",
    footer: "px-3 py-2 text-xs",
    error: "text-xs",
    errorIcon: "size-3.5",
    emptyIcon: "size-5 p-3",
    emptyText: "text-sm",
    emptySubtext: "text-xs",
    gap: "gap-1.5",
  },
  lg: {
    trigger: "h-12 px-4 text-base",
    label: "text-sm gap-2",
    input: "h-11 text-base pl-11 pr-11",
    searchIcon: "size-5 left-3.5",
    clearIcon: "size-4",
    clearButton: "right-3",
    item: "py-3 px-4 text-base",
    itemIcon: "size-5",
    maxHeight: "max-h-80",
    searchContainer: "p-4",
    footer: "px-4 py-2.5 text-sm",
    error: "text-sm",
    errorIcon: "size-4",
    emptyIcon: "size-6 p-4",
    emptyText: "text-base",
    emptySubtext: "text-sm",
    gap: "gap-2",
  },
} as const;

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
  size = "md",
}: Props) {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const sizeClasses = SIZE_VARIANTS[size];

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
    <div className={cn("flex flex-col", sizeClasses.gap, className)}>
      {/* Label with responsive typography */}
      <label
        className={cn(
          "text-primary-500 font-medium tracking-wide",
          sizeClasses.label
        )}
      >
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
            // Base styles
            "group relative w-full shadow-sm backdrop-blur-sm transition-all duration-200",
            "border-grey-200 bg-grey-100 rounded-xl border",

            // Focused state
            "focus:ring-ring/20 focus:border-primary-100 focus:ring-2 focus:outline-none",

            // Hover state
            "hover:border-primary-100 hover:bg-grey-100",

            // Error state
            error &&
              "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive/20",

            // Disabled state
            disabled && "cursor-not-allowed opacity-60 grayscale",

            // Value state
            value ? "text-primary-100 font-medium" : "text-primary-500",

            // Size variant
            sizeClasses.trigger
          )}
        >
          <div className="flex w-full items-center justify-between gap-2">
            <SelectValue placeholder={placeholder} />
            {clearable && value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className={cn(
                  "text-primary-300 rounded-md p-0.5 transition-all duration-200",
                  "hover:text-primary-500 hover:bg-grey-200",
                  "focus:ring-primary-100/50 focus:ring-2 focus:outline-none"
                )}
                aria-label="Clear selection"
              >
                <X className={sizeClasses.clearIcon} />
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
          {/* Search Input */}
          <div
            className={cn(
              "bg-grey-100 border-grey-200 sticky top-0 z-10 border-b backdrop-blur-sm",
              sizeClasses.searchContainer
            )}
          >
            <div className="relative">
              <Search
                className={cn(
                  "text-primary-300 pointer-events-none absolute top-1/2 -translate-y-1/2 transition-colors",
                  sizeClasses.searchIcon
                )}
              />
              <input
                ref={searchInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className={cn(
                  "border-grey-300 bg-grey-100 w-full rounded-xl border transition-all duration-200",
                  "placeholder:text-primary-300",
                  "focus:border-primary-100 focus:ring-ring/20 focus:bg-grey-100 focus:ring-2 focus:outline-none",
                  "hover:border-primary-100 hover:bg-grey-100",
                  sizeClasses.input
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
                    "text-primary-300 absolute top-1/2 -translate-y-1/2 rounded-xl p-0.5 transition-all duration-200",
                    "hover:text-primary-500 hover:bg-grey-200",
                    "focus:ring-primary-100/50 focus:ring-2 focus:outline-none",
                    sizeClasses.clearButton
                  )}
                  aria-label="Clear search"
                >
                  <X className={sizeClasses.clearIcon} />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div
            className={cn(
              "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-grey-300 hover:scrollbar-thumb-grey-400 relative overflow-y-auto",
              sizeClasses.maxHeight
            )}
          >
            {/* Top gradient fade */}
            <div className="from-grey-100 pointer-events-none sticky top-0 z-10 h-3 bg-gradient-to-b to-transparent" />

            {filteredOptions.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
                <div
                  className={cn(
                    "bg-grey-200 rounded-full",
                    sizeClasses.emptyIcon
                  )}
                >
                  <Search className="text-primary-300 size-full" />
                </div>
                <p
                  className={cn(
                    "text-primary-500 font-medium",
                    sizeClasses.emptyText
                  )}
                >
                  {emptyMessage}
                </p>
                <p className={cn("text-primary-300", sizeClasses.emptySubtext)}>
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
                  "cursor-pointer transition-colors duration-150 outline-none",
                  // Highlighted state
                  "data-[highlighted]:bg-grey-900 data-[highlighted]:text-white",
                  // Selected state
                  "data-[state=checked]:bg-primary-100 data-[state=checked]:text-white",
                  // Font weight
                  "font-normal data-[state=checked]:font-medium",
                  // Disabled
                  opt.disabled &&
                    "cursor-not-allowed opacity-50 hover:bg-transparent",
                  // Animation
                  search && "animate-in fade-in-0 slide-in-from-top-1",
                  // Size variant
                  sizeClasses.item
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
            <div className="from-grey-100 pointer-events-none sticky bottom-0 z-10 h-3 bg-gradient-to-t to-transparent" />
          </div>

          {/* Result count footer */}
          {search && filteredOptions.length > 0 && (
            <div
              className={cn(
                "bg-grey-100 border-grey-200 border-t backdrop-blur-sm",
                sizeClasses.footer
              )}
            >
              <p className="text-primary-500 font-medium">
                <span className="text-primary-700">
                  {filteredOptions.length}
                </span>{" "}
                of {options.length} results
              </p>
            </div>
          )}
        </SelectContent>
      </Select>

      {/* Error message */}
      {error && (
        <div className="animate-in fade-in-0 slide-in-from-top-1 flex items-start gap-1.5">
          <svg
            className={cn(
              "text-destructive mt-0.5 flex-shrink-0",
              sizeClasses.errorIcon
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p
            className={cn("font-medium text-red-600", sizeClasses.error)}
            role="alert"
          >
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
