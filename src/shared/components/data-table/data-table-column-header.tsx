"use client";

import type { Column } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  EyeOff,
  X,
} from "lucide-react";

import { DataTableColumnFilter } from "@/shared/components/data-table/data-table-column-filter";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { useHasColumnFilter } from "@/shared/store/filter-store";

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  label: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  label,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  const hasFilter = useHasColumnFilter(column.id);
  const canFilter = column.columnDef.enableColumnFilter !== false;

  if (!column.getCanSort() && !column.getCanHide() && !canFilter) {
    return <div className={cn(className)}>{label}</div>;
  }

  return (
    <div className="flex items-center justify-between gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "hover:bg-accent focus:ring-ring data-[state=open]:bg-accent [&_svg]:text-muted-foreground text-primary-400 font-helvetica-now -ml-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 text-base font-medium capitalize focus:ring-1 focus:outline-none [&_svg]:size-4 [&_svg]:shrink-0",
            hasFilter && "text-primary",
            className
          )}
          {...props}
        >
          {label}
          {column.getCanSort() &&
            (column.getIsSorted() === "desc" ? (
              <ChevronDown />
            ) : column.getIsSorted() === "asc" ? (
              <ChevronUp />
            ) : null)}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-28">
          {column.getCanSort() && (
            <>
              <DropdownMenuCheckboxItem
                className="[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
                checked={column.getIsSorted() === "asc"}
                onClick={() => column.toggleSorting(false)}
              >
                <ChevronUp />
                Asc
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                className="[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
                checked={column.getIsSorted() === "desc"}
                onClick={() => column.toggleSorting(true)}
              >
                <ChevronDown />
                Desc
              </DropdownMenuCheckboxItem>
              {column.getIsSorted() && (
                <DropdownMenuItem
                  className="[&_svg]:text-muted-foreground pl-2"
                  onClick={() => column.clearSorting()}
                >
                  <X />
                  Reset
                </DropdownMenuItem>
              )}
            </>
          )}
          {column.getCanHide() && (
            <DropdownMenuCheckboxItem
              className="[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
              checked={!column.getIsVisible()}
              onClick={() => column.toggleVisibility(false)}
            >
              <EyeOff />
              Hide
            </DropdownMenuCheckboxItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {canFilter && <DataTableColumnFilter column={column} />}
    </div>
  );
}
