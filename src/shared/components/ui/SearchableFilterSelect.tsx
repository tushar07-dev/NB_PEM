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

// ─── Types ────────────────────────────────────────────────────────────────────

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
  className?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  clearable?: boolean;
  size?: Size;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const SEARCH_FOCUS_DELAY_MS = 50;

/**
 * Radix Select treats `undefined` as "uncontrolled" and `""` as a valid
 * selection (it won't show the placeholder for ""). We use a unique sentinel
 * string so the component is always controlled while still showing the
 * placeholder when nothing is selected.
 */
const EMPTY_VALUE = "__EMPTY__";

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * SearchableFilterSelect
 *
 * Runtime errors fixed (from console logs):
 *
 * ❌ ERROR 1 — `<button> cannot appear as a descendant of <button>`
 *    Root cause: SelectTrigger renders a <button>. The previous clear button
 *    was nested inside it → invalid HTML.
 *    ✅ Fix: The clear button is now rendered OUTSIDE the <Select> entirely,
 *    absolutely-positioned as a sibling via a wrapping `relative` div.
 *    SelectTrigger never contains any interactive children.
 *
 * ❌ ERROR 2 — `Select is changing from controlled to uncontrolled`
 *    Root cause: Passing `undefined` to <Select value> tells Radix "I have
 *    no value prop" (uncontrolled). Alternating string ↔ undefined triggers
 *    the warning every time the user clears.
 *    ✅ Fix: We map "" / undefined → EMPTY_VALUE sentinel so Radix always
 *    receives a non-empty string. The sentinel is mapped back to "" on the
 *    way out via handleValueChange.
 *
 * ❌ ERROR 3 — Clearable button had no effect
 *    Root cause: Was a consequence of ERROR 2 (undefined flip) and the
 *    incorrect nesting (ERROR 1 preventing click events from working cleanly).
 *    ✅ Fix: Both root causes resolved. handleClear calls onValueChange("").
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
  className,
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  clearable = false,
  size = "md",
}: Props) {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const sizeStyles = SELECT_SIZE_CONFIG[size];

  // ─── FIX ERROR 2: Always keep Radix value as a non-empty string ──────────
  const radixValue = !value ? EMPTY_VALUE : value;

  const handleValueChange = (newRadixValue: string) => {
    onValueChange?.(newRadixValue === EMPTY_VALUE ? "" : newRadixValue);
  };

  // Derived
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

  React.useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, SEARCH_FOCUS_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // ─── FIX ERROR 1 + 3: Clear handler — button is outside <Select> ─────────
  const handleClear = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onValueChange?.("");
  };

  const handleClearSearch = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setSearch("");
    setTimeout(() => {
      if (isMountedRef.current) searchInputRef.current?.focus();
    }, 0);
  };

  // Corrected arrow key propagation
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  };

  const emptyState = React.useMemo(() => {
    if (search)
      return { title: emptyMessage, subtitle: "Try adjusting your search" };
    if (options.length === 0)
      return {
        title: "No options available",
        subtitle: "Please add some options",
      };
    return {
      title: "Start typing to search",
      subtitle: `${options.length} option${options.length !== 1 ? "s" : ""} available`,
    };
  }, [search, options.length, emptyMessage]);

  const getItemStyle = React.useCallback(
    (index: number): React.CSSProperties =>
      search
        ? { animationDelay: `${index * 20}ms`, animationDuration: "200ms" }
        : {},
    [search]
  );

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

      {/*
       * FIX ERROR 1: Wrap Select + clear button in a relative container.
       * The clear button is a SIBLING of <Select>, never a descendant of
       * SelectTrigger. This avoids the <button> inside <button> violation.
       */}
      <div className="relative flex w-full items-center">
        <Select
          value={radixValue}
          onValueChange={handleValueChange}
          disabled={disabled}
          open={open}
          onOpenChange={(next) => {
            if (disabled) return;
            setOpen(next);
          }}
        >
          {/*
           * SelectTrigger renders as <button>.
           * It contains NO interactive children — only text / icon.
           */}
          <SelectTrigger
            aria-disabled={disabled}
            className={cn(
              SELECT_BASE_STYLES.trigger,
              sizeStyles.trigger,
              // Reserve space on the right for the external clear button
              clearable && hasValue && "pr-9",
              error &&
                "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive/20",
              hasValue && "border-primary/40 bg-grey-100",
              "w-full"
            )}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${label}-error` : undefined}
          >
            {/*
             * We render value text manually because SelectValue would render
             * the EMPTY_VALUE sentinel string when nothing is selected.
             */}
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
                  placeholder={searchPlaceholder}
                  className={cn(SELECT_BASE_STYLES.input, sizeStyles.input)}
                  onKeyDown={handleSearchKeyDown}
                  onClick={(e) => e.stopPropagation()}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />

                {/* Clear SEARCH button — lives inside the dropdown content, not the trigger */}
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

        {/*
         * FIX ERROR 1: Clear SELECTION button — rendered OUTSIDE <Select>.
         * It is absolutely positioned over the right edge of the trigger.
         * onMouseDown/onPointerDown stop propagation so clicks don't
         * accidentally open or close the dropdown.
         */}
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

      {/*
       * FIX: aria-live error region is ALWAYS in the DOM (sr-only when empty).
       * Mounting it only on error means screen readers miss the announcement.
       */}
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
