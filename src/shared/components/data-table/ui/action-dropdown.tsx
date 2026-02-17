import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  type TDropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";
import _ from "lodash";
import { type LucideIcon, MoreVertical } from "lucide-react";

export type TTableActionDropdown = {
  items: ({ label: string; icon: LucideIcon } & TDropdownMenuItem)[];
  disabled?: boolean;
};

const TableActionDropdown = ({ items, disabled }: TTableActionDropdown) => {
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={disabled} variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {items.map((item) => {
            return (
              <DropdownMenuItem
                key={`${_.kebabCase(item.label)}-table-dropdown-item`}
                {...item}
              >
                {item.icon && <item.icon />}
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TableActionDropdown;
