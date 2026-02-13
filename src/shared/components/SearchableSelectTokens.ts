/**
 * Design Tokens for SearchableFilterSelect Component
 * Leverages existing CSS variables from globals.css
 *
 * These map directly to:
 * - --component-sm-height, --component-md-height, --component-lg-height
 * - --component-sm-text, --component-md-text, --component-lg-text
 * - --component-sm-px, --component-md-px, --component-lg-px
 */

export const SELECT_SIZE_CONFIG = {
  sm: {
    // Container & Layout
    container: "gap-0.5",

    // Main Trigger Button
    trigger: [
      "h-[var(--component-sm-height,2rem)]",
      "lg:h-[var(--component-sm-height-md,2.25rem)]",
      "px-[var(--component-sm-px,0.5rem)]",
      "lg:px-[var(--component-sm-px-md,0.625rem)]",
      "text-[var(--component-sm-text,0.75rem)]",
      "lg:text-[var(--component-sm-text-md,0.875rem)]",
    ].join(" "),

    // Label
    label: "text-xs lg:text-sm",

    // Search Input
    input: "h-8 lg:h-9 text-sm px-8 pr-8",

    // Icons
    searchIcon: "size-3.5 lg:size-4 left-2.5",
    clearIcon: "size-3.5",
    clearButton: "right-2.5",

    // Dropdown Items
    item: "py-2 px-2.5 text-sm",

    // Dropdown Container
    maxHeight: "max-h-56 lg:max-h-64",
    searchContainer: "p-2.5",

    // Footer & Error
    footer: "px-2.5 py-2 text-xs",
    error: "text-xs",
    errorIcon: "size-3.5",

    // Empty State
    emptyIcon: "size-5",
    emptyIconPadding: "p-2.5",
    emptyText: "text-sm",
    emptySubtext: "text-xs",
  },

  md: {
    container: "gap-1",

    trigger: [
      "h-[var(--component-md-height,2.5rem)]",
      "lg:h-[var(--component-md-height-lg,3rem)]",
      "px-[var(--component-md-px,0.75rem)]",
      "lg:px-[var(--component-md-px-md,1rem)]",
      "text-[var(--component-md-text,0.875rem)]",
      "lg:text-[var(--component-md-text-md,1rem)]",
    ].join(" "),

    label: "text-sm lg:text-base",

    input: "h-10 lg:h-11 text-base px-10 pr-10",

    searchIcon: "size-4 lg:size-5 left-3",
    clearIcon: "size-4",
    clearButton: "right-3",

    item: "py-2.5 lg:py-3 px-3 lg:px-4 text-base",

    maxHeight: "max-h-64 lg:max-h-80",
    searchContainer: "p-3 lg:p-4",

    footer: "px-3 lg:px-4 py-2.5 text-sm",
    error: "text-sm",
    errorIcon: "size-4",

    emptyIcon: "size-6",
    emptyIconPadding: "p-3",
    emptyText: "text-base",
    emptySubtext: "text-sm",
  },

  lg: {
    container: "gap-1.5",

    trigger: [
      "h-[var(--component-lg-height,3rem)]",
      "lg:h-[var(--component-lg-height-lg,4rem)]",
      "px-[var(--component-lg-px,1rem)]",
      "lg:px-[var(--component-lg-px-md,1.25rem)]",
      "text-[var(--component-lg-text,1rem)]",
      "lg:text-[var(--component-lg-text-md,1.125rem)]",
    ].join(" "),

    label: "text-base lg:text-lg",

    input: "h-12 lg:h-14 text-lg px-12 pr-12",

    searchIcon: "size-5 lg:size-6 left-4",
    clearIcon: "size-4.5",
    clearButton: "right-4",

    item: "py-3 lg:py-4 px-4 lg:px-6 text-lg",

    maxHeight: "max-h-72 lg:max-h-96",
    searchContainer: "p-4 lg:p-5",

    footer: "px-4 lg:px-5 py-3 text-base",
    error: "text-base",
    errorIcon: "size-4.5",

    emptyIcon: "size-7",
    emptyIconPadding: "p-4",
    emptyText: "text-lg",
    emptySubtext: "text-base",
  },
} as const;

/**
 * Base styles that apply to all sizes
 * Uses semantic color tokens from your theme
 */
export const SELECT_BASE_STYLES = {
  trigger: [
    "group relative w-full",
    // "rounded-lg lg:rounded-xl",
    "border transition-all duration-200",
    "bg-background text-foreground border-input",
    "hover:border-primary hover:bg-secondary/50",
    "focus:ring-2 focus:ring-ring/20 focus:border-primary focus:outline-none",
    "disabled:cursor-not-allowed disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground disabled:border-muted",
    "shadow-sm backdrop-blur-sm",
  ].join(" "),

  label: ["font-medium tracking-wide capitalize", "text-primary-500"].join(" "),

  input: [
    "w-full rounded-lg lg:rounded-xl",
    "border bg-background text-foreground border-border",
    "placeholder:text-muted-foreground",
    "transition-all duration-200",
    "hover:border-primary hover:bg-secondary/50",
    "focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none",
  ].join(" "),

  content: [
    "overflow-hidden rounded-lg lg:rounded-xl",
    "border p-0 shadow-xl",
    "bg-popover border-border",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  ].join(" "),

  searchContainer: [
    "sticky top-0 z-10",
    "border-b backdrop-blur-sm",
    "bg-popover border-border",
  ].join(" "),

  item: [
    "cursor-pointer transition-colors duration-150 outline-none",
    "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
    "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
    "font-normal data-[state=checked]:font-medium",
  ].join(" "),

  clearButton: [
    "rounded-lg p-1 transition-all duration-200",
    "text-muted-foreground",
    "hover:text-foreground hover:bg-secondary",
    "focus:ring-2 focus:ring-ring/50 focus:outline-none",
  ].join(" "),

  errorContainer: [
    "flex items-start gap-1.5",
    "animate-in fade-in-0 slide-in-from-top-1",
  ].join(" "),

  errorIcon: "flex-shrink-0 mt-0.5 text-destructive",

  errorText: "font-medium text-destructive",

  footer: ["border-t backdrop-blur-sm", "bg-popover border-border"].join(" "),

  emptyState:
    "flex flex-col items-center justify-center gap-2.5 px-4 py-8 text-center",

  emptyIconWrapper: "rounded-full bg-muted",

  emptyIcon: "text-muted-foreground size-full",

  emptyText: "font-medium text-foreground",

  emptySubtext: "text-muted-foreground",

  gradient: {
    top: "pointer-events-none sticky top-0 z-10 h-2 lg:h-3 bg-gradient-to-b from-popover to-transparent",
    bottom:
      "pointer-events-none sticky bottom-0 z-10 h-2 lg:h-3 bg-gradient-to-t from-popover to-transparent",
  },

  scrollbar: [
    "relative overflow-y-auto",
    "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300",
    "hover:scrollbar-thumb-gray-400",
  ].join(" "),
} as const;
