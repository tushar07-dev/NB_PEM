// 1. Define the possible status values
export type Status = "YES" | "NO" | "NA" | null;

// 2. Define the structure of a single checklist item
export interface ChecklistItem {
  id: string;
  checkpoint: string;
  value: Status;
  signature: string;
  timestamp: string;
}

// 3. Create the initial data array based on your design
export const initialChecklistData: ChecklistItem[] = [
  {
    id: "01",
    checkpoint:
      "Drawing Made In Accordance With Project Requirements (Client Template).",
    value: "YES",
    signature: "Xavier Fernandes",
    timestamp: "02-12-2025, 01:02AM",
  },
  {
    id: "02",
    checkpoint: "Included And Checked: All Relevant Information Included.",
    value: "NO",
    signature: "Sofia Martinez",
    timestamp: "02-12-2025, 01:12AM",
  },
];
