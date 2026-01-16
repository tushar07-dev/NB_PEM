import { cn } from "@/shared/lib/utils";

type Status = "YES" | "NO" | "NA" | null;

export const StatusButton = ({
  label,
  active,
  onClick,
}: {
  label: Status;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "rounded-full border px-6 py-1.5 text-[10px] font-bold transition-all",
      active
        ? "border-slate-800 bg-white text-slate-800 shadow-sm"
        : "border-transparent bg-slate-50 text-slate-400 hover:bg-slate-100"
    )}
  >
    {label}
  </button>
);
