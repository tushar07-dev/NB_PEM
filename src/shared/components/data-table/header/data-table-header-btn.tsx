import { Button, type ButtonProps } from "@/shared/components/ui/button";

export interface IDataTableHeaderBtn extends ButtonProps {}

const DataTableHeaderBtn = ({ ...props }: IDataTableHeaderBtn) => {
  return (
    <Button size={"sm"} {...props}>
      {props.children}
    </Button>
  );
};

export default DataTableHeaderBtn;
