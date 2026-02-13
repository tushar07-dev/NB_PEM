
import { Circle, CheckCircle2, Clock } from "lucide-react";
import type { DataTableFilterField } from "@/shared/components/data-table/types";
import type { DocumentRecord } from "../../types/document";

export const documentTableFilterFields: DataTableFilterField<DocumentRecord>[] =
  [
    {
      label: "Status",
      value: "status",
      options: [
        {
          label: "Not Started",
          value: "Not Started",
          icon: Circle,
        },
        {
          label: "In Progress",
          value: "In Progress",
          icon: Clock,
        },
        {
          label: "Completed",
          value: "Completed",
          icon: CheckCircle2,
        },
      ],
    },
    {
      label: "Reason For Issue",
      value: "reasonForIssue",
      options: [
        { label: "IFC", value: "IFC" },
        { label: "IFD", value: "IFD" },
        { label: "AFC", value: "AFC" },
        { label: "IFR", value: "IFR" },
      ],
    },
    {
      label: "Revision Status",
      value: "revisionStatus",
      options: [
        { label: "OF", value: "OF" },
        { label: "R1", value: "R1" },
        { label: "R2", value: "R2" },
        { label: "R3", value: "R3" },
      ],
    },
  ];
