// src/shared/components/advanced-table/filters/DateFilter.tsx

import { useState } from "react";
import { X, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/shared/components/ui/button";
// import { Calendar as CalendarComponent } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/lib/utils";
import type { DateFilterConfig, DateFilterValue } from "../types";

interface DateFilterProps {
  config: DateFilterConfig;
  value: DateFilterValue | Date | null;
  onChange: (value: DateFilterValue | null) => void;
  onClose: () => void;
}

export function DateFilter({
  config,
  value,
  onChange,
  onClose,
}: DateFilterProps) {
  const operators = config.operators || ["equals"];
  const defaultOperator = operators[0];

  const [operator, setOperator] = useState<string>(
    typeof value === "object" && value !== null && "operator" in value
      ? value.operator
      : defaultOperator
  );

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value instanceof Date
      ? value
      : typeof value === "object" &&
          value !== null &&
          !Array.isArray(value.value)
        ? (value.value as Date)
        : undefined
  );

  const [rangeStart, setRangeStart] = useState<Date | undefined>(
    typeof value === "object" && value !== null && Array.isArray(value.value)
      ? value.value[0]
      : undefined
  );

  const [rangeEnd, setRangeEnd] = useState<Date | undefined>(
    typeof value === "object" && value !== null && Array.isArray(value.value)
      ? value.value[1]
      : undefined
  );

  const handleClear = () => {
    setSelectedDate(undefined);
    setRangeStart(undefined);
    setRangeEnd(undefined);
    setOperator(defaultOperator);
    onChange(null);
  };

  const handleApply = () => {
    if (operator === "between") {
      if (!rangeStart || !rangeEnd) return;
      onChange({
        operator: "between",
        value: [rangeStart, rangeEnd],
      });
    } else {
      if (!selectedDate) return;
      onChange({
        operator: operator as any,
        value: selectedDate,
      });
    }
    onClose();
  };

  const dateFormat = config.format || "PP";

  return (
    <div className="w-96 space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">
          Filter by {config.label || "date"}
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Operator Selection */}
      {operators.length > 1 && (
        <Select value={operator} onValueChange={setOperator}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {operators.map((op) => (
              <SelectItem key={op} value={op}>
                {dateOperatorLabels[op]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Date Picker based on operator */}
      {operator === "between" ? (
        <div className="space-y-2">
          {/* Range Start */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !rangeStart && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {rangeStart ? format(rangeStart, dateFormat) : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {/* <CalendarComponent
                mode="single"
                selected={rangeStart}
                onSelect={setRangeStart}
                disabled={(date) =>
                  (config.minDate && date < config.minDate) ||
                  (config.maxDate && date > config.maxDate) ||
                  (rangeEnd && date > rangeEnd) ||
                  false
                }
                initialFocus
              /> */}
            </PopoverContent>
          </Popover>

          {/* Range End */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !rangeEnd && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {rangeEnd ? format(rangeEnd, dateFormat) : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {/* <CalendarComponent
                mode="single"
                selected={rangeEnd}
                onSelect={setRangeEnd}
                disabled={(date) =>
                  (config.minDate && date < config.minDate) ||
                  (config.maxDate && date > config.maxDate) ||
                  (rangeStart && date < rangeStart) ||
                  false
                }
                initialFocus
              /> */}
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate
                ? format(selectedDate, dateFormat)
                : config.placeholder || "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {/* <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) =>
                (config.minDate && date < config.minDate) ||
                (config.maxDate && date > config.maxDate) ||
                false
              }
              initialFocus
            /> */}
          </PopoverContent>
        </Popover>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="flex-1"
        >
          Clear
        </Button>
        <Button size="sm" onClick={handleApply} className="flex-1">
          Apply
        </Button>
      </div>
    </div>
  );
}

const dateOperatorLabels: Record<string, string> = {
  equals: "On",
  before: "Before",
  after: "After",
  between: "Between",
};
