import { Plus } from "lucide-react";
import { Button, type ButtonProps } from "@/shared/components/ui/button";

export interface IDataTableAddBtn extends ButtonProps {}

const DataTableAddBtn = ({ ...props }: IDataTableAddBtn) => {
  return (
    <Button {...props} variant={"default"} size={"sm"}>
      <Plus />
    </Button>
  );
};

export default DataTableAddBtn;
