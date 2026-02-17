import { Button, type ButtonProps } from "@/shared/components/ui/button";

import { Sheet } from "lucide-react";

export interface DataTableButtonProps extends ButtonProps {
  excel?: boolean;
  excelUrl?: string;
  icon?: React.ReactNode;
  label?: string;
}

const DataTableButton = ({
  excel = false,
  excelUrl,
  icon,
  label,
  children,
  ...props
}: DataTableButtonProps) => {
  if (excel && excelUrl) {
    return (
      <Button
        {...props}
        size="sm"
        // helperText="Export the current table view to Excel"
        asChild
      >
        <a href={excelUrl} download>
          <Sheet className="mr-2" />
          {label || children}
        </a>
      </Button>
    );
  }
  return (
    <Button {...props} size="sm">
      {icon && <span className="mr-2">{icon}</span>}
      {label || children}
    </Button>
  );
};

export default DataTableButton;
