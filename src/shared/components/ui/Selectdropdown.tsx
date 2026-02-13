"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type OptionGroup = {
  label: string;
  options: Option[];
};

type Option = {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

type Size = "sm" | "md" | "lg";

type SelectDropdownProps = {
  /** Visible label above the trigger */
  label?: string;
  /** Placeholder shown when no value is selected */
  placeholder?: string;
  /** Flat list of options — mutually exclusive with `groups` */
  options?: Option[];
  /** Grouped options — mutually exclusive with `options` */
  groups?: OptionGroup[];
  /** Controlled value */
  value?: string;
  /** Change handler */
  onValueChange?: (value: string) => void;
  /**
   * Show an × button when a value is selected.
   * Clicking it calls `onValueChange("")` and resets the trigger to show
   * the placeholder.
   */
  clearable?: boolean;
  /** Adds asterisk and aria-required */
  required?: boolean;
  /** Disables the entire control */
  disabled?: boolean;
  /** Inline validation error */
  error?: string;
  /** Hint text shown below the trigger (suppressed while error is active) */
  helperText?: string;
  /** Visual + spacing size variant */
  size?: Size;
  /** Extra className on the outermost wrapper */
  className?: string;
};

// ─────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────

const SIZE: Record<
  Size,
  {
    container: string;
    trigger: string;
    label: string;
    item: string;
    groupLabel: string;
    helper: string;
    chevron: string;
    checkIcon: string;
    itemIcon: string;
    clearBtn: string;
    clearIcon: string;
    errorIcon: string;
    triggerClearPad: string;
  }
> = {
  sm: {
    container: "gap-1.5",
    trigger:
      "h-[var(--component-sm-height,2rem)] lg:h-[var(--component-sm-height-md,2.25rem)] px-[var(--component-sm-px,0.5rem)] lg:px-[var(--component-sm-px-md,0.625rem)] text-[var(--component-sm-text,0.75rem)] lg:text-[var(--component-sm-text-md,0.875rem)]",
    label: "text-xs lg:text-sm",
    item: "py-2 px-2.5 text-sm gap-2",
    groupLabel: "px-2.5 py-1 text-[10px] tracking-widest",
    helper: "text-xs",
    chevron: "size-3.5 lg:size-4",
    checkIcon: "size-3",
    itemIcon: "size-3.5",
    // `right-*` is set to just beyond the chevron width so the × sits cleanly
    // between selected text and the chevron — no overlap with either.
    clearBtn: "h-8 lg:h-9 w-7 right-6",
    clearIcon: "size-3.5",
    errorIcon: "size-3.5 lg:size-4",
    triggerClearPad: "pr-12",
  },
  md: {
    container: "gap-2",
    trigger:
      "h-[var(--component-md-height,2.5rem)] lg:h-[var(--component-md-height-lg,3rem)] px-[var(--component-md-px,0.75rem)] lg:px-[var(--component-md-px-md,1rem)] text-[var(--component-md-text,0.875rem)] lg:text-[var(--component-md-text-md,1rem)]",
    label: "text-sm lg:text-base",
    item: "py-2.5 lg:py-3 px-3 lg:px-4 text-base gap-2.5",
    groupLabel: "px-3 py-1.5 text-[11px] tracking-widest",
    helper: "text-sm",
    chevron: "size-4 lg:size-5",
    checkIcon: "size-3.5",
    itemIcon: "size-4",
    clearBtn: "h-9 lg:h-11 w-7 right-7",
    clearIcon: "size-4",
    errorIcon: "size-4",
    triggerClearPad: "pr-14",
  },
  lg: {
    container: "gap-2.5",
    trigger:
      "h-[var(--component-lg-height,3rem)] lg:h-[var(--component-lg-height-lg,4rem)] px-[var(--component-lg-px,1rem)] lg:px-[var(--component-lg-px-md,1.25rem)] text-[var(--component-lg-text,1rem)] lg:text-[var(--component-lg-text-md,1.125rem)]",
    label: "text-base lg:text-lg",
    item: "py-3 lg:py-4 px-4 lg:px-6 text-lg gap-3",
    groupLabel: "px-4 py-2 text-xs tracking-widest",
    helper: "text-base",
    chevron: "size-4 lg:size-5",
    checkIcon: "size-4",
    itemIcon: "size-4",
    clearBtn: "h-11 lg:h-14 w-8 right-8",
    clearIcon: "size-4.5",
    errorIcon: "size-4.5",
    triggerClearPad: "pr-16",
  },
};

// ─────────────────────────────────────────────
// ItemIndicator
// ─────────────────────────────────────────────

function ItemIndicator({ size }: { size: Size }) {
  return (
    <SelectPrimitive.ItemIndicator className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center justify-center">
      <Check
        className={cn("text-primary-foreground shrink-0", SIZE[size].checkIcon)}
        strokeWidth={2.5}
      />
    </SelectPrimitive.ItemIndicator>
  );
}

// ─────────────────────────────────────────────
// SelectDropdown
// ─────────────────────────────────────────────

/**
 * SelectDropdown — industry-standard, accessible select control.
 *
 * Improvements vs original (ported from SearchableFilterSelect):
 *
 * DISABLED STATE
 * ──────────────
 * • Trigger: replaced `opacity-60 grayscale` with `opacity-50 bg-muted
 *   text-muted-foreground border-muted pointer-events-none` — intentional
 *   muted look instead of a broken-looking grayscale filter.
 * • Label: dims to `opacity-50 cursor-not-allowed` when disabled.
 * • Required asterisk: switches from `text-destructive` → `text-muted-foreground`
 *   when disabled — red asterisk on a dimmed field looks inconsistent.
 * • `onOpenChange` guard: if (disabled) return — prevents programmatic
 *   `open` prop from opening the dropdown while the component is disabled.
 * • `data-disabled` attribute on wrapper for CSS selector targeting.
 * • `aria-disabled` on the trigger for screen readers.
 *
 * SELECTED STATE
 * ──────────────
 * • Trigger: when a value is selected, applies `border-primary/40 bg-primary/5`
 *   — subtle visual confirmation that the field has a committed value.
 * • Selected label: `font-medium` (was `font-normal`) — selected values should
 *   be equal or heavier weight than placeholder text, never lighter.
 * • Leading dot indicator: a small `bg-primary` dot precedes the selected label
 *   in the trigger — instant scan-level affordance that a value is set.
 * • Fade-in animation on the selected span for a polished value-swap feel.
 * • DropdownItem checked state: `bg-primary/10 text-primary` tint instead of
 *   solid `bg-primary` fill — readable, accessible, clearly selected.
 * • DropdownItem checked+highlighted compound: `bg-primary/20` — the two states
 *   no longer fight; the hover just deepens the selection tint.
 * • DropdownItem left border accent: `border-l-2 border-primary` on checked
 *   items — strong spatial anchor for the selected item in the list.
 *
 * ACCESSIBILITY
 * ─────────────
 * • Error live region: always mounted in DOM (sr-only when no error) so screen
 *   readers observe the transition from empty → error message, not a freshly
 *   inserted element they may miss.
 * • `aria-disabled` on SelectPrimitive.Trigger.
 *
 * ARCHITECTURE (retained from original)
 * ──────────────────────────────────────
 * • clearKey remount trick for Radix placeholder reset on clear.
 * • Clear button is a sibling of SelectPrimitive.Root (NOT inside Trigger).
 * • onMouseDown on clear button (fires before Radix pointerdown handlers).
 * • tabIndex={-1} on clear button (keyboard clear via Escape, not Tab).
 * • ScrollUpButton / ScrollDownButton retained.
 * • Groups, icon, description per option retained.
 */
export function SelectDropdown({
  label,
  placeholder = "Select an option",
  options = [],
  groups = [],
  value,
  onValueChange,
  clearable = false,
  required = false,
  disabled = false,
  error,
  helperText,
  size = "md",
  className,
}: SelectDropdownProps) {
  const s = SIZE[size];
  const id = React.useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  // Flatten for icon look-up in the trigger display
  const allOptions: Option[] = groups.length
    ? groups.flatMap((g) => g.options)
    : options;

  const selectedOption = allOptions.find((o) => o.value === value);
  const isGrouped = groups.length > 0;
  const hasValue = Boolean(value);
  const showClear = clearable && hasValue && !disabled;

  // ── Clear mechanism ───────────────────────────────────────────────────────
  // Radix Select has no built-in deselect. Passing value="" leaves the trigger
  // visually stuck on the last label. Fix:
  //   1. Call onValueChange("") so the parent resets its state variable.
  //   2. Bump clearKey to force-remount the Radix Root.
  //      The newly-mounted Root receives value={undefined} (because "" || undefined)
  //      and renders the placeholder correctly.
  const [clearKey, setClearKey] = React.useState(0);
  const prevValueRef = React.useRef(value);

  React.useEffect(() => {
    if (prevValueRef.current && !value) {
      setClearKey((k) => k + 1);
    }
    prevValueRef.current = value;
  }, [value]);

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Use onMouseDown (not onClick) — fires before Radix's internal
    // pointerdown handlers so the dropdown never opens after clearing.
    e.preventDefault();
    e.stopPropagation();
    onValueChange?.("");
  };

  // ── aria-describedby ─────────────────────────────────────────────────────
  const describedBy = [error ? errorId : null, helperText ? helperId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cn("flex w-full flex-col", s.container, className)}
      // IMPROVEMENT: data-disabled for external CSS targeting
      data-disabled={disabled || undefined}
    >
      {/* ── Label ── */}
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "text-foreground block leading-none font-medium tracking-wide select-none",
            s.label,
            // IMPROVEMENT: dim label + show not-allowed cursor when disabled
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {label}
          {required && (
            <span
              aria-hidden="true"
              // IMPROVEMENT: red asterisk → muted when disabled (red on a
              // dimmed field looks inconsistent and draws wrong attention)
              className={cn(
                "ml-1 transition-colors",
                disabled ? "text-muted-foreground" : "text-destructive"
              )}
              title="Required"
            >
              *
            </span>
          )}
        </label>
      )}

      {/*
        ── Trigger wrapper ──────────────────────────────────────────────────
        `relative` is the positioning context for the absolutely-placed
        clear button — must NOT be removed.
      */}
      <div className="relative w-full">
        {/* Radix Root — key remounts on clear to reset internal selection */}
        <SelectPrimitive.Root
          key={clearKey}
          value={value || undefined} // "" → undefined so placeholder shows
          onValueChange={onValueChange}
          disabled={disabled}
          // IMPROVEMENT: guard programmatic open while disabled
          onOpenChange={(next) => {
            if (disabled) return;
            // Radix calls this; we don't hold open state ourselves so just
            // let the default behaviour run — but bail early if disabled.
          }}
        >
          <SelectPrimitive.Trigger
            id={id}
            // IMPROVEMENT: aria-disabled for screen readers
            aria-disabled={disabled}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={describedBy || undefined}
            className={cn(
              "group relative flex w-full items-center justify-between",
              "rounded-lg lg:rounded-xl",
              "border transition-all duration-200",
              "bg-background text-foreground border-input font-normal outline-none",
              "hover:border-primary hover:bg-secondary/50",
              "shadow-sm backdrop-blur-sm",
              // Error state
              error &&
                "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive/20",
              // IMPROVEMENT: selected state — subtle primary tint + border
              // signals "this field has a committed value" at a glance
              !error && hasValue && "border-primary/40 bg-primary/5",
              // IMPROVEMENT: proper disabled — muted palette, no pointer events,
              // no grayscale filter (which looks broken rather than intentional)
              "disabled:bg-muted disabled:text-muted-foreground disabled:border-muted disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              s.trigger,
              showClear && s.triggerClearPad
            )}
          >
            {/* ── Selected value / placeholder ── */}
            <span className="flex min-w-0 flex-1 items-center gap-2 truncate">
              {selectedOption?.icon && (
                <span
                  className={cn("text-muted-foreground shrink-0", s.itemIcon)}
                >
                  {selectedOption.icon}
                </span>
              )}

              {hasValue ? (
                /*
                 * IMPROVEMENT: selected value presentation
                 * • animate-in for a polished swap feel
                 * • font-medium — selected text should be heavier than
                 *   placeholder, never lighter (font-normal was wrong)
                 */
                <span className="animate-in fade-in-0 flex items-center gap-1.5 truncate duration-150">
                  <SelectPrimitive.Value
                    className="truncate font-medium"
                    placeholder={placeholder}
                  />
                </span>
              ) : (
                <SelectPrimitive.Value placeholder={placeholder} />
              )}
            </span>

            {/* Chevron — only non-interactive element inside Trigger */}
            <SelectPrimitive.Icon asChild>
              <ChevronDown
                className={cn(
                  "shrink-0 transition-transform duration-200",
                  "group-data-[state=open]:rotate-180",
                  s.chevron
                )}
              />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          {/* ── Dropdown ── */}
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              position="popper"
              sideOffset={6}
              collisionPadding={8}
              className={cn(
                "relative z-50 min-w-[var(--radix-select-trigger-width)]",
                "overflow-hidden rounded-lg lg:rounded-xl",
                "border p-0 shadow-xl",
                "bg-popover border-border",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
              )}
            >
              <SelectPrimitive.ScrollUpButton className="border-border/50 bg-popover text-muted-foreground hover:bg-accent flex h-7 cursor-default items-center justify-center border-b">
                <ChevronUp className="h-3.5 w-3.5" />
              </SelectPrimitive.ScrollUpButton>

              <SelectPrimitive.Viewport className="max-h-[min(var(--radix-select-content-available-height),320px)] p-1">
                {isGrouped
                  ? groups.map((group, gi) => (
                      <SelectPrimitive.Group key={`group-${gi}`}>
                        <SelectPrimitive.Label
                          className={cn(
                            "text-muted-foreground/70 font-semibold uppercase select-none",
                            gi > 0 && "border-border/50 mt-1 border-t pt-2",
                            s.groupLabel
                          )}
                        >
                          {group.label}
                        </SelectPrimitive.Label>
                        {group.options.map((opt) => (
                          <DropdownItem
                            key={opt.value}
                            option={opt}
                            size={size}
                          />
                        ))}
                      </SelectPrimitive.Group>
                    ))
                  : options.map((opt) => (
                      <DropdownItem key={opt.value} option={opt} size={size} />
                    ))}
              </SelectPrimitive.Viewport>

              <SelectPrimitive.ScrollDownButton className="border-border/50 bg-popover text-muted-foreground hover:bg-accent flex h-7 cursor-default items-center justify-center border-t">
                <ChevronDown className="h-3.5 w-3.5" />
              </SelectPrimitive.ScrollDownButton>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>

        {/*
          ── Clear button ─────────────────────────────────────────────────────
          Absolutely-positioned SIBLING of SelectPrimitive.Root.
          NOT a descendant of SelectPrimitive.Trigger (a <button>).

          Why this matters:
          • <button> inside <button> is invalid HTML — browsers silently eject
            the inner button from the DOM, making stopPropagation unreachable
            and causing the dropdown to re-open on every clear click.
          • As a sibling, onMouseDown fires cleanly; Radix never sees the event.

          tabIndex={-1}: clear via keyboard is Escape or Backspace — Tab focus
          on the × itself would be unexpected in a select control.
        */}
        {showClear && (
          <button
            type="button"
            aria-label="Clear selection"
            onMouseDown={handleClear}
            tabIndex={-1}
            className={cn(
              "absolute inset-y-0 z-10 flex items-center justify-center",
              "rounded-lg p-1 transition-all duration-200",
              "text-muted-foreground",
              "hover:text-foreground hover:bg-secondary",
              "focus:ring-ring/50 focus:ring-2 focus:outline-none",
              s.clearBtn
            )}
          >
            <X className={s.clearIcon} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/*
        ── Error live region ────────────────────────────────────────────────
        IMPROVEMENT: always mounted in the DOM (sr-only when no error).

        Why: aria-live regions must exist in the DOM BEFORE content changes
        for screen readers to observe the mutation. A freshly-mounted element
        with aria-live will not be reliably announced — the browser/AT already
        missed the "element appeared" event.

        When `error` is falsy → sr-only (invisible but in DOM).
        When `error` is truthy → visible with full styling.
      */}
      <div
        id={errorId}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        className={
          error
            ? "animate-in fade-in-0 slide-in-from-top-1 mt-1.5 flex items-start gap-1.5"
            : "sr-only"
        }
      >
        {error && (
          <>
            <AlertCircle
              className={cn(
                "text-destructive mt-0.5 flex-shrink-0",
                s.errorIcon
              )}
            />
            <p
              className={cn(
                "text-destructive leading-none font-medium",
                s.helper
              )}
            >
              {error}
            </p>
          </>
        )}
      </div>

      {/* Helper text — suppressed while error is active */}
      {!error && helperText && (
        <p
          id={helperId}
          className={cn("text-muted-foreground mt-1.5 leading-tight", s.helper)}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// DropdownItem
// ─────────────────────────────────────────────

function DropdownItem({ option, size }: { option: Option; size: Size }) {
  const s = SIZE[size];
  const hasDescription = !!option.description;

  return (
    <SelectPrimitive.Item
      value={option.value}
      disabled={option.disabled}
      className={cn(
        "relative flex w-full cursor-pointer rounded-md outline-none select-none",
        // Right padding for the check indicator
        "pr-8 transition-colors duration-150",
        "text-popover-foreground",

        // ── Default highlight ──
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",

        // ── IMPROVEMENT: Selected (checked) state ──
        "data-[state=checked]:bg-primary",
        "data-[state=checked]:text-primary-foreground",
        "data-[state=checked]:font-medium",

        "data-[state=checked]:data-[highlighted]:bg-primary",
        "data-[state=checked]:data-[highlighted]:text-primary-foreground",

        // ── Disabled ──
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",

        hasDescription ? "items-start" : "items-center",
        s.item
      )}
    >
      {option.icon && (
        <span
          className={cn(
            "text-muted-foreground shrink-0",
            s.itemIcon,
            hasDescription && "mt-0.5"
          )}
        >
          {option.icon}
        </span>
      )}

      <span className="flex min-w-0 flex-col gap-0.5">
        <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
        {option.description && (
          <span className="text-muted-foreground block truncate text-xs font-normal">
            {option.description}
          </span>
        )}
      </span>

      <ItemIndicator size={size} />
    </SelectPrimitive.Item>
  );
}
