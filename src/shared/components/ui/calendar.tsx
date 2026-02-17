import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import {
  DayPicker,
  type DayPickerSingleProps,
  type SelectSingleEventHandler,
} from "react-day-picker";

import { buttonVariants } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/lib/utils";

const years = Array.from(
  { length: 100 },
  (_, i) => new Date().getFullYear() - 50 + i
);
const months = Array.from({ length: 12 }, (_, i) =>
  format(new Date(0, i), "MMMM")
);

// Extracted components to avoid re-creation on every render
const IconLeft = ({
  className,
  ...props
}: React.ComponentProps<typeof ChevronLeft>) => (
  <ChevronLeft className={cn("size-4", className)} {...props} />
);

const IconRight = ({
  className,
  ...props
}: React.ComponentProps<typeof ChevronRight>) => (
  <ChevronRight className={cn("size-4", className)} {...props} />
);

// Caption component moved outside to avoid re-creation on every render
const Caption = ({
  month,
  setMonth,
}: {
  month: Date;
  setMonth: (date: Date) => void;
}) => (
  <div className="flex items-center justify-center gap-2 pb-2">
    <Select
      value={month.getMonth().toString()}
      onValueChange={(val) => {
        const newMonth = Number.parseInt(val);
        const updated = new Date(month.getTime());
        updated.setMonth(newMonth);
        setMonth(updated);
      }}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Month" />
      </SelectTrigger>
      <SelectContent className="max-h-48 overflow-auto">
        {months.map((label, idx) => (
          <SelectItem key={`month-${idx}-${label}`} value={idx.toString()}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select
      value={month.getFullYear().toString()}
      onValueChange={(val) => {
        const newYear = Number.parseInt(val);
        const updated = new Date(month.getTime());
        updated.setFullYear(newYear);
        setMonth(updated);
      }}
    >
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Year" />
      </SelectTrigger>
      <SelectContent className="max-h-48 overflow-auto">
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

function normalizeToLocalMidnight(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Props without 'mode' to force it to "single" internally
type CalendarProps = Omit<DayPickerSingleProps, "mode"> & {
  selected?: Date;
  onSelect?: SelectSingleEventHandler;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect,
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState<Date>(
    props.defaultMonth || (selected instanceof Date ? selected : new Date())
  );

  // Sync the month shown with selected prop
  React.useEffect(() => {
    if (selected instanceof Date) {
      setMonth(new Date(selected));
    }
  }, [selected]);

  const handleSelect: SelectSingleEventHandler = (
    date,
    selectedDay,
    modifiers,
    event
  ) => {
    if (date && onSelect) {
      const dateStr = date.toLocaleDateString("en-CA");
      const localDate = new Date(dateStr);
      onSelect(localDate, selectedDay, modifiers, event);
    }
  };
  return (
    <DayPicker
      mode="single"
      month={month}
      selected={selected ? normalizeToLocalMidnight(selected) : undefined}
      onSelect={handleSelect}
      onMonthChange={setMonth}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full gap-2",
        caption_label: "text-sm font-medium hidden",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft,
        IconRight,
        Caption: () => <Caption month={month} setMonth={setMonth} />,
      }}
      {...props}
    />
  );
}

export { Calendar };
