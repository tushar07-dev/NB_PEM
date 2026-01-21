import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";
// You'll likely need a ToggleGroup or custom buttons for YES/NO/NA

export const ChecklistTableRow = ({ item }) => {
  return (
    <TableRow className={item.isHighlighted ? "bg-blue-50/50" : ""}>
      <TableCell className="text-xs font-medium text-slate-700">
        {item.checkpoint}
      </TableCell>

      <TableCell>{/* We need a YES/NO/NA toggle here */}</TableCell>

      <TableCell>
        <Input
          placeholder="Write Reason"
          className="h-8 border-slate-200 bg-white text-xs"
        />
      </TableCell>

      <TableCell className="text-xs text-slate-600">{item.signature}</TableCell>

      <TableCell className="text-right text-xs text-slate-600">
        {item.date}
      </TableCell>
    </TableRow>
  );
};
