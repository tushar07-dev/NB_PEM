import { StatusButton } from "./checklist-status-toggle";

interface ChecklistRowProps {
  id: string;
  text: string;
  signature: string;
  time: string;
  currentStatus: "YES" | "NO" | "NA" | null; // Must match your state type
  onStatusChange: (status: "YES" | "NO" | "NA" | null) => void;
}

export function ChecklistRow({
  id,
  text,
  signature,
  time,
  currentStatus,
  onStatusChange,
}: ChecklistRowProps) {
  return (
    <tr className="group transition-colors hover:bg-slate-50/50">
      {/* ID Column */}
      <td className="px-6 py-4 align-top text-xs font-bold text-slate-700">
        {id}
      </td>

      {/* Checkpoint Text Column - Leading alignment is key here */}
      <td className="max-w-md px-6 py-4 align-top">
        <p className="text-[13px] leading-relaxed font-medium text-slate-600">
          {text}
        </p>
      </td>

      {/* Value/Toggle Column */}
      <td className="px-6 py-4 align-top">
        <div className="flex items-center justify-center gap-2">
          <StatusButton
            label="YES"
            active={currentStatus === "YES"}
            onClick={() => onStatusChange("YES")}
          />
          <StatusButton
            label="NO"
            active={currentStatus === "NO"}
            onClick={() => onStatusChange("NO")}
          />
          <StatusButton
            label="NA"
            active={currentStatus === "NA"}
            onClick={() => onStatusChange("NA")}
          />
        </div>
      </td>

      {/* Signature Column */}
      <td className="px-6 py-4 align-top whitespace-nowrap">
        <span className="text-[13px] text-slate-500">{signature}</span>
      </td>

      {/* Timestamp Column */}
      <td className="px-6 py-4 align-top whitespace-nowrap">
        <span className="block font-mono text-[11px] leading-tight text-slate-400">
          {time.split(",")[0]},<br />
          {time.split(",")[1]}
        </span>
      </td>
    </tr>
  );
}
