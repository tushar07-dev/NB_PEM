// src/shared/components/advanced-table/filters/NumberFilter.tsx

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { NumberFilterConfig, NumberFilterValue } from "../types";

interface NumberFilterProps {
  config: NumberFilterConfig;
  value: NumberFilterValue | number | null;
  onChange: (value: NumberFilterValue | null) => void;
  onClose: () => void;
}

export function NumberFilter({
  config,
  value,
  onChange,
  onClose,
}: NumberFilterProps) {
  const operators = config.operators || ["equals"];
  const defaultOperator = operators[0];

  const [operator, setOperator] = useState<string>(
    typeof value === "object" && value !== null
      ? value.operator
      : defaultOperator
  );

  const [numValue, setNumValue] = useState<string>(
    typeof value === "number"
      ? String(value)
      : typeof value === "object" &&
          value !== null &&
          !Array.isArray(value.value)
        ? String(value.value)
        : ""
  );

  const [rangeStart, setRangeStart] = useState<string>(
    typeof value === "object" && value !== null && Array.isArray(value.value)
      ? String(value.value[0])
      : ""
  );

  const [rangeEnd, setRangeEnd] = useState<string>(
    typeof value === "object" && value !== null && Array.isArray(value.value)
      ? String(value.value[1])
      : ""
  );

  const handleClear = () => {
    setNumValue("");
    setRangeStart("");
    setRangeEnd("");
    setOperator(defaultOperator);
    onChange(null);
  };

  const handleApply = () => {
    if (operator === "between") {
      if (!rangeStart || !rangeEnd) return;
      onChange({
        operator: "between",
        value: [Number(rangeStart), Number(rangeEnd)],
      });
    } else {
      if (!numValue) return;
      onChange({
        operator: operator as any,
        value: Number(numValue),
      });
    }
    onClose();
  };

  return (
    <div className="w-80 space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">
          Filter by {config.label || "number"}
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
                {numberOperatorLabels[op]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Input based on operator */}
      {operator === "between" ? (
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="From"
            value={rangeStart}
            onChange={(e) => setRangeStart(e.target.value)}
            min={config.min}
            max={config.max}
            step={config.step || 1}
            className="h-9"
          />
          <Input
            type="number"
            placeholder="To"
            value={rangeEnd}
            onChange={(e) => setRangeEnd(e.target.value)}
            min={config.min}
            max={config.max}
            step={config.step || 1}
            className="h-9"
          />
        </div>
      ) : (
        <Input
          type="number"
          placeholder={config.placeholder || "Enter value..."}
          value={numValue}
          onChange={(e) => setNumValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleApply();
          }}
          min={config.min}
          max={config.max}
          step={config.step || 1}
          className="h-9"
          autoFocus
        />
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

const numberOperatorLabels: Record<string, string> = {
  equals: "Equals",
  notEquals: "Not equals",
  greaterThan: "Greater than",
  lessThan: "Less than",
  between: "Between",
};
