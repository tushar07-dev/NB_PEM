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

/**
 * Simplified size variants - Industry best practices
 * Max 2-3 breakpoints per property for maintainability
 */
const SIZE_VARIANTS = {
  sm: {
    // Mobile → Tablet (max 2 breakpoints)
    trigger: "h-8 md:h-9 px-2 md:px-2.5 text-xs md:text-sm",
    label: "text-[10px] md:text-lg gap-1 md:gap-1.5",
    input: "h-7 md:h-8 text-xs md:text-sm pl-7 md:pl-8 pr-7 md:pr-8",
    searchIcon: "size-3 md:size-3.5 left-2 md:left-2.5",
    clearIcon: "size-3 md:size-3.5",
    clearButton: "right-2 md:right-2.5",
    item: "py-1.5 md:py-2 px-2 md:px-2.5 text-xs md:text-sm",
    maxHeight: "max-h-48 md:max-h-64",
    searchContainer: "p-2 md:p-2.5",
    footer: "px-2 md:px-2.5 py-1.5 md:py-2 text-[10px] md:text-xs",
    error: "text-[10px] md:text-xs",
    errorIcon: "size-3 md:size-3.5",
    emptyIcon: "size-4 md:size-5 p-2 md:p-2.5",
    emptyText: "text-xs md:text-sm",
    emptySubtext: "text-[10px] md:text-xs",
    gap: "gap-1 md:gap-1.5",
  },
  md: {
    // Mobile → Tablet → Desktop (max 3 breakpoints)
    trigger: "h-10 md:h-11 lg:h-12 px-3 md:px-3.5 lg:px-4 text-sm md:text-base",
    label: "text-xs md:text-sm gap-1.5 md:gap-2",
    input:
      "h-9 md:h-10 lg:h-11 text-sm md:text-base pl-9 md:pl-10 lg:pl-11 pr-9 md:pr-10 lg:pr-11",
    searchIcon: "size-4 md:size-4.5 lg:size-5 left-3 md:left-3.5 lg:left-4",
    clearIcon: "size-3.5 md:size-4",
    clearButton: "right-2.5 md:right-3",
    item: "py-2.5 md:py-3 lg:py-3.5 px-3 md:px-3.5 lg:px-4 text-sm md:text-base",
    maxHeight: "max-h-64 md:max-h-72 lg:max-h-80",
    searchContainer: "p-3 md:p-3.5 lg:p-4",
    footer: "px-3 md:px-3.5 lg:px-4 py-2 md:py-2.5 text-xs md:text-sm",
    error: "text-xs md:text-sm",
    errorIcon: "size-3.5 md:size-4",
    emptyIcon: "size-5 md:size-6 p-3 md:p-3.5",
    emptyText: "text-sm md:text-base",
    emptySubtext: "text-xs md:text-sm",
    gap: "gap-1.5 md:gap-2",
  },
  lg: {
    // Mobile → Tablet → Desktop
    trigger: "h-12 md:h-14 lg:h-16 px-4 md:px-5 lg:px-6 text-base md:text-lg",
    label: "text-base md:text-lg gap-2 md:gap-2.5",
    input:
      "h-11 md:h-12 lg:h-14 text-base md:text-lg pl-11 md:pl-12 lg:pl-14 pr-11 md:pr-12 lg:pr-14",
    searchIcon: "size-5 md:size-5.5 lg:size-6 left-3.5 md:left-4",
    clearIcon: "size-4 md:size-4.5",
    clearButton: "right-3 md:right-3.5",
    item: "py-3 md:py-3.5 lg:py-4 px-4 md:px-5 lg:px-6 text-base md:text-lg",
    maxHeight: "max-h-72 md:max-h-80 lg:max-h-96",
    searchContainer: "p-4 md:p-5",
    footer: "px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base",
    error: "text-sm md:text-base",
    errorIcon: "size-4 md:size-4.5",
    emptyIcon: "size-6 md:size-7 p-4 md:p-5",
    emptyText: "text-base md:text-lg",
    emptySubtext: "text-sm md:text-base",
    gap: "gap-2 md:gap-2.5",
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
    <div className={cn("flex w-full flex-col", sizeClasses.gap, className)}>
      {/* Label */}
      <label
        className={cn(
          "text-primary-500 font-medium tracking-wide",
          sizeClasses.label
        )}
      >
        {label}
        {required && (
          <span className="text-destructive ml-0.5 transition-colors md:ml-1">
            *
          </span>
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
            "border-grey-200 bg-grey-100 rounded-lg border md:rounded-xl",

            // States
            "focus:ring-ring/20 focus:border-primary-100 focus:ring-2 focus:outline-none",
            "hover:border-primary-100 hover:bg-grey-100",

            // Error state
            error &&
              "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive/20",

            // Disabled
            disabled && "cursor-not-allowed opacity-60 grayscale",

            // Value state
            value ? "text-primary-100 font-medium" : "text-primary-500",

            // Responsive size
            sizeClasses.trigger
          )}
        >
          <div className="flex w-full items-center justify-between gap-1.5 md:gap-2">
            <SelectValue placeholder={placeholder} />
            {clearable && value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className={cn(
                  "text-primary-300 rounded-md p-0.5 transition-all duration-200 md:p-1",
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
            "border-grey-300 bg-grey-100 overflow-hidden rounded-lg border p-0 shadow-xl md:rounded-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            // Responsive width
            "w-[var(--radix-select-trigger-width)] min-w-[200px] md:min-w-[280px]"
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
                  "border-grey-300 bg-grey-100 w-full rounded-lg border transition-all duration-200 md:rounded-xl",
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
                    "text-primary-300 absolute top-1/2 -translate-y-1/2 rounded-lg p-0.5 transition-all duration-200 md:rounded-xl md:p-1",
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
            {/* Top gradient */}
            <div className="from-grey-100 pointer-events-none sticky top-0 z-10 h-2 bg-gradient-to-b to-transparent md:h-3" />

            {filteredOptions.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 px-3 py-6 text-center md:gap-3 md:px-4 md:py-8">
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
                  "data-[highlighted]:bg-grey-900 data-[highlighted]:text-white",
                  "data-[state=checked]:bg-primary-100 data-[state=checked]:text-white",
                  "font-normal data-[state=checked]:font-medium",
                  opt.disabled &&
                    "cursor-not-allowed opacity-50 hover:bg-transparent",
                  search && "animate-in fade-in-0 slide-in-from-top-1",
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

            {/* Bottom gradient */}
            <div className="from-grey-100 pointer-events-none sticky bottom-0 z-10 h-2 bg-gradient-to-t to-transparent md:h-3" />
          </div>

          {/* Footer */}
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
                of {options.length} result{options.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </SelectContent>
      </Select>

      {/* Error message */}
      {error && (
        <div className="animate-in fade-in-0 slide-in-from-top-1 flex items-start gap-1 md:gap-1.5">
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
