"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/shared/components/ui/select";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import {
  SELECT_SIZE_CONFIG,
  SELECT_BASE_STYLES,
} from "@/shared/components/SearchableSelectTokens";

// ─── Constants ────────────────────────────────────────────────────────────────

const CONSTANTS = {
  EMPTY_VALUE: "__EMPTY__",
  SEARCH_FOCUS_DELAY_MS: 50,
  ANIMATION_DELAY_MS: 20,
  ANIMATION_DURATION_MS: 200,
} as const;

const DEFAULT_TEXTS = {
  searchPlaceholder: "Search...",
  emptyMessage: "No results found",
  emptySubtitle: "Try adjusting your search",
  noOptionsTitle: "No options available",
  noOptionsSubtitle: "Please add some options",
  startSearchTitle: "Start typing to search",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

type Size = "sm" | "md" | "lg";

type CustomTexts = {
  searchPlaceholder?: string;
  emptyMessage?: string;
  emptySubtitle?: string;
  noOptionsTitle?: string;
  noOptionsSubtitle?: string;
  startSearchTitle?: string;
};

type Props = {
  label: string;
  placeholder: string;
  options: Option[];
  /**
   * Always pass a string ("" means no selection).
   * Never alternate between string and undefined — that causes the
   * "controlled → uncontrolled" Radix warning.
   */
  value?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  /**
   * Helper text displayed below the select (info message)
   * Example: "No disciplines available" or "Select your preferred option"
   */
  helperText?: string;
  className?: string;
  clearable?: boolean;
  size?: Size;
  /**
   * Customize all user-facing text strings
   */
  texts?: CustomTexts;
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * SearchableFilterSelect
 *
 * A controlled select component with search functionality, keyboard navigation,
 * and accessibility features.
 *
 * @example
 * ```tsx
 * <SearchableFilterSelect
 *   label="Country"
 *   placeholder="Select a country"
 *   options={countries}
 *   value={selectedCountry}
 *   onValueChange={setSelectedCountry}
 *   clearable
 *   helperText="Choose your current location"
 * />
 * ```
 */
export function SearchableFilterSelect({
  label,
  placeholder,
  options,
  value = "",
  onValueChange,
  required = false,
  disabled = false,
  error,
  helperText,
  className,
  clearable = false,
  size = "md",
  texts,
}: Props) {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const isMountedRef = React.useRef(true);

  // Merge custom texts with defaults
  const mergedTexts = { ...DEFAULT_TEXTS, ...texts };

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const sizeStyles = SELECT_SIZE_CONFIG[size];

  // ─── Controlled Value Management ──────────────────────────────────────────
  const radixValue = !value ? CONSTANTS.EMPTY_VALUE : value;

  const handleValueChange = React.useCallback(
    (newRadixValue: string) => {
      onValueChange?.(
        newRadixValue === CONSTANTS.EMPTY_VALUE ? "" : newRadixValue
      );
    },
    [onValueChange]
  );

  // ─── Derived State ────────────────────────────────────────────────────────
  const hasValue = Boolean(value);
  const selectedLabel = React.useMemo(
    () => options.find((o) => o.value === value)?.label ?? null,
    [options, value]
  );

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    const lower = search.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(lower));
  }, [search, options]);

  const emptyState = React.useMemo(() => {
    if (search)
      return {
        title: mergedTexts.emptyMessage,
        subtitle: mergedTexts.emptySubtitle,
      };
    if (options.length === 0)
      return {
        title: mergedTexts.noOptionsTitle,
        subtitle: mergedTexts.noOptionsSubtitle,
      };
    return {
      title: mergedTexts.startSearchTitle,
      subtitle: `${options.length} option${options.length !== 1 ? "s" : ""} available`,
    };
  }, [search, options.length, mergedTexts]);

  // ─── Event Handlers ───────────────────────────────────────────────────────

  const handleClear = React.useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onValueChange?.("");
    },
    [onValueChange]
  );

  const handleClearSearch = React.useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      setSearch("");
      setTimeout(() => {
        if (isMountedRef.current) searchInputRef.current?.focus();
      }, 0);
    },
    []
  );

  const handleSearchKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
          break;
        case "Enter":
          e.preventDefault();
          e.stopPropagation();
          break;
        case "ArrowDown": {
          const atEnd =
            e.currentTarget.selectionStart === e.currentTarget.value.length;
          if (!atEnd) e.stopPropagation();
          break;
        }
        case "ArrowUp": {
          const atStart = e.currentTarget.selectionStart === 0;
          if (!atStart) e.stopPropagation();
          break;
        }
        default:
          e.stopPropagation();
          break;
      }
    },
    []
  );

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (disabled) return;
      setOpen(next);
    },
    [disabled]
  );

  const getItemStyle = React.useCallback(
    (index: number): React.CSSProperties =>
      search
        ? {
            animationDelay: `${index * CONSTANTS.ANIMATION_DELAY_MS}ms`,
            animationDuration: `${CONSTANTS.ANIMATION_DURATION_MS}ms`,
          }
        : {},
    [search]
  );

  // ─── Effects ──────────────────────────────────────────────────────────────

  React.useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, CONSTANTS.SEARCH_FOCUS_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className={cn("flex w-full flex-col", sizeStyles.container, className)}
      data-disabled={disabled || undefined}
    >
      {/* Label */}
      <label
        className={cn(
          SELECT_BASE_STYLES.label,
          sizeStyles.label,
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {label}
        {required && (
          <span
            className={cn(
              "ml-1 transition-colors",
              disabled ? "text-muted-foreground" : "text-destructive"
            )}
          >
            *
          </span>
        )}
      </label>

      {/* Select Container */}
      <div className="relative flex w-full items-center">
        <Select
          value={radixValue}
          onValueChange={handleValueChange}
          disabled={disabled}
          open={open}
          onOpenChange={handleOpenChange}
        >
          <SelectTrigger
            aria-disabled={disabled}
            className={cn(
              SELECT_BASE_STYLES.trigger,
              sizeStyles.trigger,
              clearable && hasValue && "pr-9",
              error &&
                "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive/20",
              hasValue && "border-primary/40 bg-grey-100",
              "w-full"
            )}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${label}-error`
                : helperText
                  ? `${label}-helper`
                  : undefined
            }
          >
            {hasValue ? (
              <span className="truncate text-left">{selectedLabel}</span>
            ) : (
              <span className="text-muted-foreground truncate text-left">
                {placeholder}
              </span>
            )}
          </SelectTrigger>

          {/* Dropdown */}
          <SelectContent
            className={cn(
              SELECT_BASE_STYLES.content,
              "w-[var(--radix-select-trigger-width)] min-w-[200px] lg:min-w-[280px]"
            )}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            {/* Search input area */}
            <div
              className={cn(
                SELECT_BASE_STYLES.searchContainer,
                sizeStyles.searchContainer
              )}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Search
                  className={cn(
                    "text-muted-foreground pointer-events-none absolute top-1/2 -translate-y-1/2 transition-colors",
                    sizeStyles.searchIcon
                  )}
                  aria-hidden="true"
                />

                <input
                  ref={searchInputRef}
                  type="text"
                  disabled={disabled}
                  role="searchbox"
                  aria-label={`Search ${label} options`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={mergedTexts.searchPlaceholder}
                  className={cn(SELECT_BASE_STYLES.input, sizeStyles.input)}
                  onKeyDown={handleSearchKeyDown}
                  onClick={(e) => e.stopPropagation()}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />

                {search && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleClearSearch(e);
                      }
                    }}
                    className={cn(
                      SELECT_BASE_STYLES.clearButton,
                      "absolute top-1/2 -translate-y-1/2",
                      sizeStyles.clearButton
                    )}
                    aria-label="Clear search"
                  >
                    <X className={sizeStyles.clearIcon} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* Results list */}
            <div
              className={cn(SELECT_BASE_STYLES.scrollbar, sizeStyles.maxHeight)}
            >
              <div
                className={SELECT_BASE_STYLES.gradient.top}
                aria-hidden="true"
              />

              {filteredOptions.length === 0 && (
                <div
                  className={SELECT_BASE_STYLES.emptyState}
                  role="status"
                  aria-live="polite"
                >
                  <div
                    className={cn(
                      SELECT_BASE_STYLES.emptyIconWrapper,
                      sizeStyles.emptyIconPadding
                    )}
                  >
                    <Search
                      className={cn(
                        SELECT_BASE_STYLES.emptyIcon,
                        sizeStyles.emptyIcon
                      )}
                      aria-hidden="true"
                    />
                  </div>
                  <p
                    className={cn(
                      SELECT_BASE_STYLES.emptyText,
                      sizeStyles.emptyText
                    )}
                  >
                    {emptyState.title}
                  </p>
                  <p
                    className={cn(
                      SELECT_BASE_STYLES.emptySubtext,
                      sizeStyles.emptySubtext
                    )}
                  >
                    {emptyState.subtitle}
                  </p>
                </div>
              )}

              {filteredOptions.map((opt, index) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled || disabled}
                  className={cn(
                    SELECT_BASE_STYLES.item,
                    sizeStyles.item,
                    opt.disabled &&
                      "cursor-not-allowed opacity-50 hover:bg-transparent",
                    search && "animate-in fade-in-0 slide-in-from-top-1"
                  )}
                  style={getItemStyle(index)}
                >
                  {opt.label}
                </SelectItem>
              ))}

              <div
                className={SELECT_BASE_STYLES.gradient.bottom}
                aria-hidden="true"
              />
            </div>

            {/* Results count footer */}
            {search && filteredOptions.length > 0 && (
              <div
                className={cn(SELECT_BASE_STYLES.footer, sizeStyles.footer)}
                aria-live="polite"
                aria-atomic="true"
              >
                <p className="text-foreground font-medium">
                  <span className="text-primary">{filteredOptions.length}</span>{" "}
                  of {options.length} result{options.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </SelectContent>
        </Select>

        {/* Clear Selection Button */}
        {clearable && hasValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClear(e);
              }
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className={cn(
              "absolute top-1/2 right-2.5 z-10 -translate-y-1/2",
              "rounded-md p-0.5 transition-all duration-200",
              "text-muted-foreground",
              "hover:bg-secondary hover:text-foreground",
              "focus:ring-ring/50 focus:ring-2 focus:outline-none"
            )}
            aria-label="Clear selection"
          >
            <X className={sizeStyles.clearIcon} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Helper Text */}
      {helperText && !error && (
        <p
          id={`${label}-helper`}
          className={cn(
            "text-muted-foreground mt-1 transition-colors",
            sizeStyles.error
          )}
        >
          {helperText}
        </p>
      )}

      {/* Error Message */}
      <div
        id={`${label}-error`}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        className={error ? SELECT_BASE_STYLES.errorContainer : "sr-only"}
      >
        {error && (
          <>
            <svg
              className={cn(SELECT_BASE_STYLES.errorIcon, sizeStyles.errorIcon)}
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className={cn(SELECT_BASE_STYLES.errorText, sizeStyles.error)}>
              {error}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export type { Option, Size, Props as SearchableFilterSelectProps, CustomTexts };
