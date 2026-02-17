import * as React from "react";

import { cn } from "@/lib/utils";

type TTable = React.ComponentProps<"table"> & {
  containerClassName?: string;
};

function Table({ className, containerClassName, ...props }: TTable) {
  return (
    <div data-slot="table-container" className={`w-full ${containerClassName}`}>
      <table
        data-slot="table"
        className={cn(
          "relative w-full caption-bottom overflow-x-auto",
          className
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "bg-secondary dark:bg-primary-100 text-secondary-foreground sticky top-0 z-2 h-[50px]",
        className
      )}
      {...props}
    />
  );
}

type TTablebody = React.ComponentProps<"tbody"> & {
  bodyRef?: React.RefObject<HTMLTableSectionElement>;
};

function TableBody({ className, bodyRef, ...props }: TTablebody) {
  return (
    <tbody
      ref={bodyRef}
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "even:bg-background-secondary data-[state=selected]:bg-muted transition-colors",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "h-10 max-w-[300px] overflow-hidden p-1 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
