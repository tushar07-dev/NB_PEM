type Status = "YES" | "NO" | "NA" | null;

interface ChecklistItem {
  id: string;
  checkpoint: string;
  value: Status;
  signature: string;
  timestamp: string;
}

const initialData: ChecklistItem[] = [
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
