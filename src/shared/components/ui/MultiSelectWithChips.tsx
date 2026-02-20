"use client";

import * as React from "react";
import { Check, Search, X, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
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

type Size = "sm" | "md" | "lg";

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
  size?: Size;
};

// Size variant configurations
const SIZE_VARIANTS = {
  sm: {
    trigger: "h-8 px-2 text-xs",
    label: "text-[10px] gap-1",
    chevron: "size-3 ml-1.5",
    checkbox: "size-3",
    checkIcon: "size-2",
    commandInput: "h-7 text-xs",
    commandItem: "py-1.5 px-2 text-xs gap-2",
    maxHeight: "max-h-48",
    footer: "px-2 py-1.5 text-[10px]",
    chip: "px-2 py-0.5 text-[10px] gap-1 rounded-md",
    chipIcon: "size-2.5",
    error: "text-[10px]",
    errorIcon: "size-3",
    emptyIcon: "size-4 p-2",
    emptyText: "text-xs",
    gap: "gap-1",
    chipsGap: "gap-1.5",
  },
  md: {
    trigger: "h-10 px-3 text-sm",
    label: "text-xs gap-1.5",
    chevron: "size-4 ml-2",
    checkbox: "size-4",
    checkIcon: "size-3",
    commandInput: "h-9 text-sm",
    commandItem: "py-2.5 px-3 text-sm gap-2",
    maxHeight: "max-h-64",
    footer: "px-3 py-2 text-xs",
    chip: "px-2.5 py-1 text-xs gap-1.5 rounded-lg",
    chipIcon: "size-3",
    error: "text-xs",
    errorIcon: "size-3.5",
    emptyIcon: "size-5 p-3",
    emptyText: "text-sm",
    gap: "gap-1.5",
    chipsGap: "gap-2",
  },
  lg: {
    trigger: "h-12 px-4 text-base",
    label: "text-sm gap-2",
    chevron: "size-5 ml-2.5",
    checkbox: "size-5",
    checkIcon: "size-3.5",
    commandInput: "h-11 text-base",
    commandItem: "py-3 px-4 text-base gap-3",
    maxHeight: "max-h-80",
    footer: "px-4 py-2.5 text-sm",
    chip: "px-3 py-1.5 text-sm gap-2 rounded-lg",
    chipIcon: "size-3.5",
    error: "text-sm",
    errorIcon: "size-4",
    emptyIcon: "size-6 p-4",
    emptyText: "text-base",
    gap: "gap-2",
    chipsGap: "gap-2.5",
  },
} as const;

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
  size = "md",
}: Props) {
  const [open, setOpen] = React.useState(false);

  const sizeClasses = SIZE_VARIANTS[size];

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
    <div className={cn("flex flex-col", sizeClasses.gap, className)}>
      {/* Label */}
      <label
        className={cn(
          "text-primary-500 font-medium tracking-wide uppercase",
          sizeClasses.label
        )}
      >
        {label}
        {required && (
          <span className="text-destructive ml-1 transition-colors">*</span>
        )}
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
              "w-full justify-between font-normal shadow-sm backdrop-blur-sm transition-all duration-200",
              "border-grey-200 bg-grey-100 rounded-xl border",
              "hover:border-primary-100 hover:bg-grey-100",
              "focus:ring-ring/20 focus:border-primary-100 focus:ring-2 focus:outline-none",
              error &&
                "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive/20",
              disabled && "cursor-not-allowed opacity-60 grayscale",
              value.length > 0
                ? "text-primary-100 font-medium"
                : "text-primary-500",
              sizeClasses.trigger
            )}
          >
            <span className="truncate">
              {value.length === 0 ? placeholder : `${value.length} selected`}
            </span>
            <ChevronDown
              className={cn(
                "text-primary-300 shrink-0 transition-transform duration-200",
                open && "rotate-180",
                sizeClasses.chevron
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            "border-grey-300 bg-grey-100 w-full overflow-hidden rounded-xl border p-0 shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command className="bg-grey-100">
            <CommandInput
              placeholder={searchPlaceholder}
              className={cn(
                "border-grey-200 bg-grey-100 border-b",
                "placeholder:text-primary-300",
                sizeClasses.commandInput
              )}
            />
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center gap-2 py-6">
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
              </div>
            </CommandEmpty>
            <CommandGroup
              className={cn("overflow-auto", sizeClasses.maxHeight)}
            >
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
                    className={cn(
                      "cursor-pointer transition-colors duration-150 outline-none",
                      "data-[selected=true]:bg-grey-900 data-[selected=true]:text-white",
                      "font-normal",
                      option.disabled &&
                        "cursor-not-allowed opacity-50 hover:bg-transparent",
                      sizeClasses.commandItem
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center rounded border-2 transition-all",
                        isSelected
                          ? "border-primary-100 bg-primary-100"
                          : "border-grey-300 bg-grey-50",
                        sizeClasses.checkbox
                      )}
                    >
                      {isSelected && (
                        <Check
                          className={cn("text-white", sizeClasses.checkIcon)}
                        />
                      )}
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {/* Footer */}
            {value.length > 0 && (
              <div
                className={cn(
                  "border-grey-200 bg-grey-100 flex items-center justify-between border-t backdrop-blur-sm",
                  sizeClasses.footer
                )}
              >
                <p className="text-primary-500 font-medium">
                  <span className="text-primary-700">{value.length}</span>{" "}
                  selected
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-primary-500 hover:text-primary-700 font-medium transition-colors"
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
        <div className={cn("flex flex-wrap", sizeClasses.chipsGap)}>
          {displayedChips.map((opt) => (
            <div
              key={opt.value}
              className={cn(
                "border-grey-200 bg-grey-100 flex items-center border transition-all",
                "hover:border-primary-100 hover:bg-grey-200",
                sizeClasses.chip
              )}
            >
              <span className="text-primary-700 font-medium">{opt.label}</span>
              <button
                type="button"
                onClick={(e) => removeOption(opt.value, e)}
                disabled={disabled}
                className={cn(
                  "text-primary-300 rounded p-0.5 transition-all",
                  "hover:bg-grey-300 hover:text-primary-500",
                  disabled && "cursor-not-allowed opacity-50"
                )}
                aria-label={`Remove ${opt.label}`}
              >
                <X className={sizeClasses.chipIcon} />
              </button>
            </div>
          ))}

          {remainingCount > 0 && (
            <div
              className={cn(
                "border-grey-200 bg-grey-100 text-primary-500 flex items-center border font-medium",
                sizeClasses.chip
              )}
            >
              +{remainingCount}
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="animate-in fade-in-0 slide-in-from-top-1 flex items-start gap-1.5">
          <svg
            className={cn(
              "text-destructive mt-0.5 shrink-0",
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
