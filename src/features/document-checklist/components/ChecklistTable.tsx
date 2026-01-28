import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress"; // Shadcn progress bar
import { ChecklistTableRow } from "./ChecklistTableRow";
import { Clock4 } from "lucide-react";
import { useSidebar } from "@/shared/components/ui/sidebar";
import { cn } from "@/lib/utils";

export const ChecklistTable = () => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  // Example data based on the image
  const checklistItems = [
    {
      id: 1,
      checkpoint:
        "Drawing Made In Accordance With Project Requirements (Client Template).",
      value: "YES",
      signature: "Xavier Fernandes",
      date: "02-12-25",
    },
    {
      id: 2,
      checkpoint: "Included And Checked: All Relevant Information Included.",
      value: "NO",
      signature: "Sofia Martinez",
      date: "03-12-25",
      isHighlighted: true,
    },
    {
      id: 3,
      checkpoint:
        "Drawing Made In Accordance With Project Requirements (Client Template).",
      value: "YES",
      signature: "Xavier Fernandes",
      date: "02-12-25",
    },
    {
      id: 4,
      checkpoint: "Included And Checked: All Relevant Information Included.",
      value: "NO",
      signature: "Sofia Martinez",
      date: "03-12-25",
      isHighlighted: true,
    },
    {
      id: 5,
      checkpoint:
        "Drawing Made In Accordance With Project Requirements (Client Template).",
      value: "YES",
      signature: "Xavier Fernandes",
      date: "02-12-25",
    },
    {
      id: 6,
      checkpoint: "Included And Checked: All Relevant Information Included.",
      value: "NO",
      signature: "Sofia Martinez",
      date: "03-12-25",
      isHighlighted: true,
    },
    {
      id: 7,
      checkpoint:
        "Drawing Made In Accordance With Project Requirements (Client Template).",
      value: "YES",
      signature: "Xavier Fernandes",
      date: "02-12-25",
    },
    {
      id: 8,
      checkpoint: "Included And Checked: All Relevant Information Included.",
      value: "NO",
      signature: "Sofia Martinez",
      date: "03-12-25",
      isHighlighted: true,
    },
    {
      id: 9,
      checkpoint:
        "Drawing Made In Accordance With Project Requirements (Client Template).",
      value: "YES",
      signature: "Xavier Fernandes",
      date: "02-12-25",
    },
    {
      id: 10,
      checkpoint: "Included And Checked: All Relevant Information Included.",
      value: "NO",
      signature: "Sofia Martinez",
      date: "03-12-25",
      isHighlighted: true,
    },
  ];

  return (
    <div
      className={cn(
        "h-full rounded-lg border bg-white shadow-sm transition-all duration-300",
        isExpanded ? "p-2 sm:p-2" : "p-4" // Reduce padding when sidebar is open
      )}
    >
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h3 className="text-sm font-semibold text-slate-700">
          Document Checklist Table
        </h3>

        {/* Progress and Actions */}
        <div className="flex w-full items-center gap-4 md:w-auto">
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold text-slate-500">05/20</span>
            <Progress value={25} className="h-2 w-24" />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-bold uppercase"
          >
            <Clock4 className="h-3 w-3" />
            Revision History
          </Button>
          <Button
            size="sm"
            className="bg-[#1a2b3b] text-xs font-bold uppercase"
          >
            Release
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-slate-100">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-b hover:bg-transparent">
              <TableHead className="w-[40%] text-[10px] font-bold text-slate-500 uppercase">
                Checkpoint
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase">
                Value
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase">
                Reason
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase">
                Signature
              </TableHead>
              <TableHead className="text-right text-[10px] font-bold text-slate-500 uppercase">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checklistItems.map((item) => (
              <ChecklistTableRow key={item.id} item={item} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
