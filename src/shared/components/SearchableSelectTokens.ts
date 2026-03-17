// Breakpoints from globals.css:
//   md: 800px   → scaled-down values
//   lg: 1500px  → Figma exact values
//
// text-base = --fs-200 → 12px at md, 14px at lg (CSS var handles it automatically)
// text-sm   = --fs-100 → 12px always
// text-xs   = --fs-50  → 10px always

export const SELECT_SIZE_CONFIG = {
  // Compact — for intentional override (e.g. dense filter panels)
  sm: {
    container: "gap-0.5",
    trigger:
      "h-[40px] lg:h-[44px] px-[14px] lg:px-5 py-2 lg:py-3 gap-2 rounded-xl",
    label: "text-base leading-5 tracking-[-0.56px] px-[14px] lg:px-5",
    input:
      "h-[36px] lg:h-[40px] rounded-[8px] text-base px-[36px] lg:px-[40px] pr-[36px] lg:pr-[40px]",
    searchIcon: "size-3.5 lg:size-4 left-2 lg:left-[12px]",
    clearIcon: "size-3.5 lg:size-4",
    clearButton: "right-2 lg:right-[12px]",
    item: "py-[6px] lg:py-[7px] px-[14px] lg:px-4 text-base leading-5 tracking-[-0.56px]",
    maxHeight: "max-h-52 lg:max-h-56",
    searchContainer: "p-[12px] lg:p-4",
    footer: "px-3 lg:px-4 py-2 lg:py-2 text-base",
    error: "text-sm",
    errorIcon: "size-3.5 lg:size-4",
    emptyIcon: "size-4 lg:size-5",
    emptyIconPadding: "p-2 lg:p-2.5",
    emptyText: "text-base",
    emptySubtext: "text-sm",
  },

  // Default — md scaled → lg Figma exact
  md: {
    container: "gap-1",
    trigger: "h-[44px] lg:h-[48px] px-4 lg:px-5 py-2 lg:py-3 gap-2 rounded-xl",
    label: "text-base leading-5 tracking-[-0.56px] px-4 lg:px-5",
    input:
      "h-[38px] lg:h-[40px] rounded-[8px] text-base px-[38px] lg:px-[40px] pr-[38px] lg:pr-[40px]",
    searchIcon: "size-4 left-[12px]",
    clearIcon: "size-4",
    clearButton: "right-[12px]",
    item: "py-[6px] lg:py-[7px] px-[14px] lg:px-4 text-base leading-5 tracking-[-0.56px]",
    maxHeight: "max-h-56 lg:max-h-64",
    searchContainer: "p-[14px] lg:p-4",
    footer: "px-[14px] lg:px-4 py-[9px] lg:py-2 text-base",
    error: "text-sm",
    errorIcon: "size-4",
    emptyIcon: "size-5 lg:size-6",
    emptyIconPadding: "p-2.5 lg:p-3",
    emptyText: "text-base",
    emptySubtext: "text-sm",
  },

  // Large — for spacious layouts
  lg: {
    container: "gap-1.5",
    trigger: "h-[48px] lg:h-[54px] px-5 lg:px-5 py-2 lg:py-3 gap-2 rounded-xl",
    label: "text-base leading-5 tracking-[-0.56px] px-5 lg:px-5",
    input: "h-[40px] rounded-[8px] text-base px-[40px] pr-[40px]",
    searchIcon: "size-4 left-[12px]",
    clearIcon: "size-4",
    clearButton: "right-[12px]",
    item: "py-[7px] px-4 text-base leading-5 tracking-[-0.56px]",
    maxHeight: "max-h-64 lg:max-h-72",
    searchContainer: "p-4",
    footer: "px-4 py-2 text-base",
    error: "text-base",
    errorIcon: "size-4",
    emptyIcon: "size-6 lg:size-7",
    emptyIconPadding: "p-3 lg:p-4",
    emptyText: "text-base",
    emptySubtext: "text-sm",
  },
} as const;

// Auto — responsive without explicit size prop
// md (800px): slightly compact | lg (1500px): Figma exact
export const SELECT_AUTO_CONFIG = {
  container: "gap-1 lg:gap-1",
  trigger:
    "h-[40px] lg:h-[44px] px-[14px] lg:px-5 py-2 lg:py-3 gap-2 rounded-sm lg:rounded-md",
  label: "text-base leading-5 tracking-[-0.56px] px-[14px] lg:px-5",
  input:
    "h-[36px] lg:h-[40px] rounded-[8px] text-base px-[36px] lg:px-[40px] pr-[36px] lg:pr-[40px]",
  searchIcon: "size-3.5 lg:size-4 left-2 lg:left-[12px]",
  clearIcon: "size-3.5 lg:size-4",
  clearButton: "right-2 lg:right-[12px]",
  item: "py-[6px] lg:py-[7px] px-[14px] lg:px-4 text-base leading-5 tracking-[-0.56px]",
  maxHeight: "max-h-52 lg:max-h-64",
  searchContainer: "p-[12px] lg:p-4",
  footer: "px-3 lg:px-4 py-2 lg:py-2 text-base",
  error: "text-sm",
  errorIcon: "size-3.5 lg:size-4",
  emptyIcon: "size-5 lg:size-6",
  emptyIconPadding: "p-2.5 lg:p-3",
  emptyText: "text-base",
  emptySubtext: "text-sm",
} as const;

export const SELECT_BASE_STYLES = {
  trigger: [
    "group relative w-full flex items-center",
    "border transition-all duration-200",
    "bg-grey-100 border-grey-200 text-foreground",
    "hover:bg-grey-200 hover:border-grey-300",
    "focus:ring-2 focus:ring-ring/20 focus:outline-none",
    "disabled:cursor-not-allowed disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground disabled:border-muted",
  ].join(" "),

  // label px is now in size config so it can scale with breakpoints
  label: [
    "font-medium capitalize",
    "text-base leading-5 tracking-[-0.56px]",
    "text-primary-500 opacity-80",
  ].join(" "),

  input: [
    "w-full border bg-white text-foreground border-grey-300",
    "placeholder:text-primary-100",
    "transition-all duration-200",
    "hover:border-grey-400",
    "focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none",
  ].join(" "),

  content: [
    "overflow-hidden rounded-xl",
    "p-0 bg-white",
    "border border-grey-100",
    "shadow-[0px_11px_20px_0px_rgba(0,0,0,0.10)]",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  ].join(" "),

  searchContainer: [
    "sticky top-0 z-10",
    "border-b border-grey-100",
    "bg-white",
  ].join(" "),

  item: [
    "cursor-pointer transition-colors duration-150 outline-none",
    "capitalize font-normal text-primary-500",
    "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
    "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
    "data-[state=checked]:font-medium",
  ].join(" "),

  clearButton: [
    "rounded-lg p-1 transition-all duration-200 text-primary-100",
    "hover:text-primary-500 hover:bg-grey-200",
    "focus:ring-2 focus:ring-ring/50 focus:outline-none",
  ].join(" "),

  errorContainer:
    "flex items-start gap-1.5 animate-in fade-in-0 slide-in-from-top-1",
  errorIcon: "flex-shrink-0 mt-0.5 text-destructive",
  errorText: "font-medium text-destructive",

  footer: "border-t border-grey-100 bg-white",

  emptyState:
    "flex flex-col items-center justify-center gap-2.5 px-4 py-8 text-center",
  emptyIconWrapper: "rounded-full bg-grey-200",
  emptyIcon: "text-primary-100 size-full",
  emptyText: "font-medium text-primary-500",
  emptySubtext: "text-primary-100",

  gradient: {
    top: "pointer-events-none sticky top-0 z-10 h-2 bg-gradient-to-b from-white to-transparent",
    bottom:
      "pointer-events-none sticky bottom-0 z-10 h-2 bg-gradient-to-t from-white to-transparent",
  },

  scrollbar: [
    "relative overflow-y-auto",
    "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300",
    "hover:scrollbar-thumb-gray-400",
  ].join(" "),
} as const;
