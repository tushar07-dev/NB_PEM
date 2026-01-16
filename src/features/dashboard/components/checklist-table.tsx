import { useState } from "react";
import { initialChecklistData, type ChecklistItem, type Status } from "../types/types";
import { ChecklistRow } from "./checklist-row";

export function ChecklistTable() {
  // Initialize state with your mock data
  const [data, setData] = useState<ChecklistItem[]>(initialChecklistData);

  // Logic to update a specific row
  const handleStatusChange = (id: string, newValue: Status) => {
    const now = new Date();

    // Format: MM-DD-YYYY, HH:MM AM/PM
    const formattedTime = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}-${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}`;

    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              value: newValue,
              signature: "Current User", // In a real app, get this from your Auth context
              timestamp: formattedTime,
            }
          : item
      )
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* ... Table Header ... */}
      <table className="w-full text-left">
        {/* ... Table Head ... */}
        <tbody>
          {data.map((item) => (
            <ChecklistRow
              key={item.id}
              id={item.id}
              text={item.checkpoint}
              signature={item.signature}
              time={item.timestamp}
              currentStatus={item.value}
              onStatusChange={(newStatus) =>
                handleStatusChange(item.id, newStatus)
              }
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
