import type React from "react";

import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type {
  BooleanOrNullPropertyKeys,
  DatePropertyKeys,
  NumberPropertyKeys,
  StringOrNullPropertyKeys,
} from "@/shared/types/common";
import type { Option } from "@/shared/types/data-table";
import {
  type CellContext,
  type Column,
  type ColumnDef,
  type CoreRow,
  type Row,
  type Table,
} from "@tanstack/react-table";
import { ArrowUpDown, CalendarIcon, Trash2 } from "lucide-react";
import { DataTableColumnHeader } from "../data-table-column-header";
import { toFormattedDate } from "@/shared/lib/datatime/format";

export const getActionColumn = <T extends object>(): ColumnDef<T> => {
  return {
    id: "actions",
    cell: () => {
      return (
        <div>
          <Button variant="ghost">
            <Trash2 />
          </Button>
        </div>
      );
    },
  };
};

export type TGetBooleanDataTableColumn<T> = {
  key: BooleanOrNullPropertyKeys<T>;
  title: string;
  enableColumnFilter: boolean;
  options?: Option[];
} & Partial<ColumnDef<T>>;

export const getBooleanColumn = <T extends object>({
  key,
  title,
  // options,
  enableColumnFilter,
  ...props
}: TGetBooleanDataTableColumn<T>): ColumnDef<T> => {
  return {
    id: key.toString(),
    accessorKey: key,
    header: ({ column }: { column: Column<T, unknown> }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    enableColumnFilter,
    meta: props.meta ?? {
      label: title,
      variant: "boolean",
      icon: ArrowUpDown,
    },
    cell: props.cell
      ? props.cell
      : ({ cell }) => <div>{cell.getValue() ? "Yes" : "No"}</div>,
    ...props,
  };
};

export type GetBooleanSwitchColumnParams<T extends object> =
  TGetBooleanDataTableColumn<T> & {
    onCheckedChange: (checked: boolean, rowIndex: number) => void;
    disabled?: boolean;
  };

export type TGetDateColumn<T> = {
  key: StringOrNullPropertyKeys<T> | DatePropertyKeys<T>;
  title: string;
  enableColumnFilter: boolean;
  className?: string;
} & Partial<ColumnDef<T>>;

export const getDateColumn = <T extends object>({
  key,
  title,
  className,
  enableColumnFilter,
  ...props
}: TGetDateColumn<T>): ColumnDef<T> => {
  return {
    id: key.toString(),
    accessorKey: key,
    header: ({ column }: { column: Column<T, unknown> }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ cell }) => (
      <div className={className}>{toFormattedDate(cell.getValue()) ?? "-"}</div>
    ),
    meta: props.meta ?? {
      label: title,
      variant: "date",
      icon: CalendarIcon,
    },
    enableColumnFilter,
    ...props,
  };
};

export type TGetIndexColumn<T> = {
  enableColumnFilter?: boolean;
  cell?: (args: {
    cell: CellContext<T, unknown>;
    index: number;
  }) => React.JSX.Element;
  disabled?: string;
};

export const getIndexColumn = <T extends object>({
  cell,
}: TGetIndexColumn<T>): ColumnDef<T> => {
  return {
    id: "index",
    header: "#",
    cell: (cellArgs) => {
      const { row, table } = cellArgs;
      const { pageIndex, pageSize } = table.getState().pagination;
      const index = pageIndex * pageSize + row.index + 1;
      if (typeof cell === "function") {
        return cell({ cell: cellArgs, index });
      }
      return <div>{index}</div>;
    },
    size: 40,
    minSize: 40,
  };
};

export type TGetNumberColumn<T> = {
  key: NumberPropertyKeys<T>;
  title: string;
  enableColumnFilter?: boolean;
  cell?: ({ cell }: CellContext<T, unknown>) => React.JSX.Element;
  disabled?: string;
} & Partial<ColumnDef<T>>;

export const getNumberColumn = <T extends object>({
  key,
  title,
  ...props
}: TGetNumberColumn<T>): ColumnDef<T> => {
  return {
    id: key.toString(),
    accessorKey: key,
    header: ({ column }: { column: Column<T, unknown> }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: props.cell
      ? props.cell
      : ({ cell }) => {
          return (
            <div className="w-full overflow-hidden text-ellipsis">
              {cell.getValue<string>() ?? "-"}
            </div>
          );
        },
    meta: props.meta ?? {
      label: title,
      placeholder: `Search ${title.toLowerCase()}...`,
      variant: "text",
    },
    enableColumnFilter: props.enableColumnFilter ?? true,
    ...props,
  };
};

// This stores the last selected index to support shift+click range selection
let lastSelectedIndex: number | null = null;

export const getSelectionColumn = <T extends object>({
  disabledFn,
  isChecked,
  enableSingleSelection = false,
  disableSelectAll = false,
  size = 50,
}: {
  enableSingleSelection?: boolean;
  idKey?: string;
  disableSelectAll?: boolean;
  disabledFn?: (row: CoreRow<T>) => boolean;
  isChecked?: (row: CoreRow<T>) => boolean;
  size?: number;
}): ColumnDef<T> => {
  return {
    id: "select",
    header: ({ table }) =>
      enableSingleSelection || disableSelectAll ? (
        <></>
      ) : (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
    cell: ({ row, table }) => {
      const allRows = table.getRowModel().rows;

      const isDisabled = disabledFn?.(row) ?? false;
      const isSelected =
        row.getIsSelected() || (isChecked ? isChecked(row) : false);

      const handleCheckboxClick = (e: React.MouseEvent) => {
        const thisIndex = row.index;
        // If SHIFT is pressed, select range from last to current
        if (!enableSingleSelection) {
          if (e.shiftKey && lastSelectedIndex !== null) {
            const start = Math.min(lastSelectedIndex, thisIndex);
            const end = Math.max(lastSelectedIndex, thisIndex);
            const newSelection: Record<string, boolean> = {};

            for (let i = start; i <= end; i++) {
              const targetRow = allRows[i];
              if (!disabledFn?.(targetRow)) {
                newSelection[targetRow.id] = true;
              }
            }
            table.setRowSelection({
              ...table.getState().rowSelection,
              ...newSelection,
            });
          } else {
            row.toggleSelected(!row.getIsSelected());
          }
          lastSelectedIndex = thisIndex;
        } else {
          table.setRowSelection({
            [row.id]: true,
          });
        }
      };

      return (
        <div className="flex justify-center">
          <Checkbox
            checked={isSelected}
            disabled={isDisabled}
            aria-label="Select row"
            onClick={handleCheckboxClick}
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    size,
    minSize: size,
  };
};

export type TGetTextDataTableColumn<T> = {
  key: StringOrNullPropertyKeys<T>;
  title: string;
  enableColumnFilter?: boolean;
  cell?: ({ cell }: CellContext<T, unknown>) => React.JSX.Element;
  disabled?: boolean;
  required?: boolean;
  className?: string;
} & Partial<ColumnDef<T>>;

export const getTextColumn = <T extends object>({
  key,
  title,
  required,
  className,
  ...props
}: TGetTextDataTableColumn<T>): ColumnDef<T> => {
  return {
    id: key.toString(),
    accessorKey: key,

    header: ({ column }: { column: Column<T, unknown> }) => (
      <DataTableColumnHeader
        required={required}
        column={column}
        title={title}
      />
    ),
    cell: props.cell
      ? props.cell
      : ({ cell }) => {
          return (
            <DataTableCellText
              value={cell.getValue<string>()}
              className={className}
            />
          );
        },
    meta: props.meta ?? {
      label: title,
      placeholder: `Search ${title.toLowerCase()}...`,
      variant: "text",
    },
    enableColumnFilter: props.enableColumnFilter ?? true,
    ...props,
  };
};

export const DataTableCellText = ({
  value,
  disabled,
  className,
}: {
  value: string;
  disabled?: boolean;
  className?: string;
}) => {
  const cellComp = (
    <div
      className={cn(
        "w-full overflow-hidden text-ellipsis",
        className,
        disabled && "text-muted-foreground"
      )}
    >
      {value ? `${value}` : "-"}
    </div>
  );
  return value?.length > 35 ? (
    <Tooltip>
      <TooltipTrigger asChild>{cellComp}</TooltipTrigger>
      <TooltipContent>
        <p>{value}</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    cellComp
  );
};

export interface IExpandableTextCol<T> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  table: Table<T>;
  row: Row<T>;
  column: Column<T, unknown>;
  value: string;
  minRows?: number;
  maxRows?: number;
}

export const ExpandableTextDataTableCol = <T,>({
  // table,
  // row,
  // column,
  value,
  minRows = 2,
  maxRows = 6,
  className,
  ...props
}: IExpandableTextCol<T>) => {
  // Calculate height based on content
  const calculateHeight = (text: string) => {
    const lineHeight = 20;
    const minHeight = lineHeight * minRows;
    const maxHeight = lineHeight * maxRows;

    // Estimate number of lines based on text length and typical character width
    const avgCharsPerLine = 50; // Approximate characters per line
    const estimatedLines =
      Math.ceil((text || "").length / avgCharsPerLine) || minRows;
    const contentHeight = lineHeight * estimatedLines;

    return Math.max(minHeight, Math.min(contentHeight, maxHeight));
  };

  const height = calculateHeight(value || "");

  return (
    <div
      className={cn(
        "w-full overflow-hidden p-1 text-sm leading-relaxed break-words whitespace-pre-wrap",
        className
      )}
      style={{
        minHeight: `${minRows * 20}px`,
        maxHeight: `${maxRows * 20}px`,
        height: `${height + 5}px`,
        lineHeight: "20px",
      }}
      {...props}
    >
      {value || ""}
    </div>
  );
};

// Types for function parameters
export type GetEditableInputFieldParams<T extends object> =
  TGetTextDataTableColumn<T>;

export type GetEditableSelectFieldParams<T extends object> =
  TGetTextDataTableColumn<T>;

export function getExpandableTextField<T extends object>({
  ...props
}: GetEditableSelectFieldParams<T>) {
  return getTextColumn<T>({
    cell: ({ cell, table, row, column }) => (
      <ExpandableTextDataTableCol<T>
        value={cell.getValue<string>() ?? ""}
        table={table}
        column={column}
        row={row}
      />
    ),
    ...props,
  });
}
