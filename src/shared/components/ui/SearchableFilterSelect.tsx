import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { Search, ChevronDown, Check, Loader2 } from "lucide-react";
import {
  SELECT_SIZE_CONFIG,
  SELECT_AUTO_CONFIG,
  SELECT_BASE_STYLES,
} from "@/shared/components/SearchableSelectTokens";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CONSTANTS = {
  EMPTY_VALUE: "__EMPTY__",
  SEARCH_FOCUS_DELAY_MS: 50,
} as const;

const DEFAULT_TEXTS = {
  searchPlaceholder: "Search...",
  emptyMessage: "No results found",
  emptySubtitle: "Try adjusting your search",
  noOptionsTitle: "No options available",
  noOptionsSubtitle: "Please add some options",
  startSearchTitle: "Start typing to search",
  loadingTitle: "Loading options...",
} as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

type Size = "sm" | "md" | "lg" | "auto";

type CustomTexts = {
  searchPlaceholder?: string;
  emptyMessage?: string;
  emptySubtitle?: string;
  noOptionsTitle?: string;
  noOptionsSubtitle?: string;
  startSearchTitle?: string;
  loadingTitle?: string;
};

type Props = {
  label: string;
  placeholder: string;
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  size?: Size;
  texts?: CustomTexts;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toSafeId(label: string): string {
  return label
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Returns focus to the SelectTrigger button without needing a direct ref on it.
 * SelectTrigger in select.tsx is not a forwardRef component, so we attach a ref
 * to its wrapper div and query the button from there instead.
 */
function focusTrigger(wrapperRef: React.RefObject<HTMLDivElement | null>) {
  setTimeout(() => {
    wrapperRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, 0);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SearchableFilterSelect({
  label,
  placeholder,
  options,
  value = "",
  onValueChange,
  required = false,
  disabled = false,
  isLoading = false,
  error,
  helperText,
  className,
  size = "auto",
  texts,
}: Props) {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // FIX: ref lives on the wrapper div, not on SelectTrigger directly.
  // SelectTrigger in select.tsx is not a forwardRef component — passing a ref
  // to it directly causes the React warning. We query the <button> from the
  // wrapper div whenever we need to return focus to the trigger.
  const triggerWrapperRef = React.useRef<HTMLDivElement>(null);

  const safeId = React.useMemo(() => toSafeId(label), [label]);

  const mergedTexts = React.useMemo(
    () => ({ ...DEFAULT_TEXTS, ...texts }),
    [texts]
  );

  const sizeStyles =
    size === "auto" ? SELECT_AUTO_CONFIG : SELECT_SIZE_CONFIG[size];

  const radixValue = !value ? CONSTANTS.EMPTY_VALUE : value;

  const handleValueChange = React.useCallback(
    (newRadixValue: string) => {
      onValueChange?.(
        newRadixValue === CONSTANTS.EMPTY_VALUE ? "" : newRadixValue
      );
    },
    [onValueChange]
  );

  const hasValue = Boolean(value);

  const selectedLabel = React.useMemo(
    () => options.find((o) => o.value === value)?.label ?? null,
    [options, value]
  );

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;

    const lower = search.toLowerCase();
    const matches = options.filter((opt) =>
      opt.label.toLowerCase().includes(lower)
    );

    if (value) {
      const selectedInMatches = matches.some((o) => o.value === value);
      if (!selectedInMatches) {
        const selectedOpt = options.find((o) => o.value === value);
        if (selectedOpt) return [selectedOpt, ...matches];
      }
    }

    return matches;
  }, [search, options, value]);

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

  const handleClearSearch = React.useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      setSearch("");
      setTimeout(() => searchInputRef.current?.focus(), 0);
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
          focusTrigger(triggerWrapperRef);
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
      if (disabled || isLoading) return;
      setOpen(next);
    },
    [disabled, isLoading]
  );

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

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

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
              "ml-0.5 text-sm leading-[20px] tracking-[-0.48px] opacity-80 transition-colors",
              disabled ? "text-muted-foreground" : "text-destructive"
            )}
          >
            *
          </span>
        )}
      </label>

      {/* Trigger + Dropdown — wrapper div holds the ref used for focus return */}
      <div
        ref={triggerWrapperRef}
        className="relative flex w-full items-center"
      >
        <Select
          value={radixValue}
          onValueChange={handleValueChange}
          disabled={disabled || isLoading}
          open={open}
          onOpenChange={handleOpenChange}
        >
          {/* No ref prop on SelectTrigger — SelectTrigger in select.tsx is not
              a forwardRef component. Focus is managed via triggerWrapperRef. */}
          <SelectTrigger
            aria-disabled={disabled || isLoading}
            aria-required={required}
            aria-invalid={!!error}
            aria-busy={isLoading}
            aria-label={
              hasValue
                ? `${label}: ${selectedLabel}, press to change`
                : `${label}, press to select`
            }
            aria-describedby={
              error
                ? `${safeId}-error`
                : helperText
                  ? `${safeId}-helper`
                  : undefined
            }
            className={cn(
              SELECT_BASE_STYLES.trigger,
              sizeStyles.trigger,
              hasValue && !open && "border-primary/40 bg-grey-100",
              open && "border-primary bg-grey-100 ring-ring/20 ring-2",
              error &&
                "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive/20",
              "w-full"
            )}
          >
            <span
              className={cn(
                "flex-1 truncate text-left capitalize",
                "text-base leading-[20px] font-normal tracking-[-0.56px]",
                hasValue && !isLoading ? "text-primary-500" : "text-primary-100"
              )}
            >
              {hasValue && !isLoading ? selectedLabel : placeholder}
            </span>

            {isLoading ? (
              <Loader2
                className="text-primary-100 size-4 shrink-0 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <ChevronDown
                className={cn(
                  "shrink-0 transition-transform duration-200 ease-in-out",
                  hasValue ? "text-primary-500" : "text-primary-100",
                  open && "rotate-180"
                )}
                style={{ width: 20, height: 19 }}
                aria-hidden="true"
              />
            )}
          </SelectTrigger>

          <SelectContent
            className={cn(
              SELECT_BASE_STYLES.content,
              "w-[var(--radix-select-trigger-width)]"
            )}
          >
            {/* Search input */}
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
                    "text-primary-100 pointer-events-none absolute top-1/2 -translate-y-1/2",
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
                    <svg
                      viewBox="0 0 14 14"
                      fill="none"
                      className={sizeStyles.clearIcon}
                      aria-hidden="true"
                    >
                      <path
                        d="M1 1l12 12M13 1L1 13"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable options area */}
            <div
              className={cn(SELECT_BASE_STYLES.scrollbar, sizeStyles.maxHeight)}
            >
              <div
                className={SELECT_BASE_STYLES.gradient.top}
                aria-hidden="true"
              />

              {isLoading && (
                <div
                  role="status"
                  aria-label={mergedTexts.loadingTitle}
                  aria-live="polite"
                  className="flex flex-col px-2 py-2"
                >
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2.5",
                        sizeStyles.item
                      )}
                    >
                      <div
                        className="bg-grey-200 h-3.5 animate-pulse rounded-md"
                        style={{ width: `${55 + (i % 3) * 15}%` }}
                      />
                    </div>
                  ))}
                  <p className="sr-only">{mergedTexts.loadingTitle}</p>
                </div>
              )}

              {!isLoading && filteredOptions.length === 0 && (
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

              {!isLoading &&
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.disabled || disabled}
                      className={cn(
                        SELECT_BASE_STYLES.item,
                        sizeStyles.item,
                        opt.disabled &&
                          "cursor-not-allowed opacity-50 hover:bg-transparent",
                        search && "animate-in fade-in-0 slide-in-from-top-1",
                        isSelected && "bg-primary/10 font-medium"
                      )}
                      onPointerDown={(e) => {
                        if (isSelected) {
                          e.preventDefault();
                          onValueChange?.("");
                          setOpen(false);
                          focusTrigger(triggerWrapperRef);
                        }
                      }}
                    >
                      <span className="flex w-full items-center justify-between gap-2">
                        <span className="flex-1 truncate">{opt.label}</span>
                        {isSelected && (
                          <span className="flex shrink-0 items-center gap-1.5">
                            <Check
                              className="text-primary size-4"
                              aria-label="Selected — click to deselect"
                            />
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  );
                })}

              <div
                className={SELECT_BASE_STYLES.gradient.bottom}
                aria-hidden="true"
              />
            </div>

            {!isLoading && search && filteredOptions.length > 0 && (
              <div
                className={cn(SELECT_BASE_STYLES.footer, sizeStyles.footer)}
                aria-live="polite"
                aria-atomic="true"
              >
                <p className="text-foreground text-base leading-[20px] font-medium">
                  <span className="text-primary">{filteredOptions.length}</span>{" "}
                  of {options.length} result{options.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Helper text */}
      {helperText && !error && (
        <p
          id={`${safeId}-helper`}
          className={cn(
            "text-primary-100 mt-1 leading-[20px] tracking-[-0.56px]",
            sizeStyles.label,
            sizeStyles.error
          )}
        >
          {helperText}
        </p>
      )}

      {/* Error message */}
      <div
        id={`${safeId}-error`}
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

export type { Option, Size, Props as SearchableFilterSelectProps, CustomTexts };
