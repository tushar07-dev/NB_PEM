// src/features/pem-check-lists/pages/components/action-bars/OriginatorActions.tsx
//
// Send to Checker button for the ORIGINATOR role.
// Progress bar has been intentionally removed — it now lives in the page
// header so all roles can always see originator completion.

// import { Send } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface OriginatorActionsProps {
  done: number;
  total: number;
  onSend: () => void;
}

export function OriginatorActions({
  //   done,
  //   total,
  onSend,
}: OriginatorActionsProps) {
  //   const canSend = done === total && total > 0;
  const canSend = true;

  return (
    <button
      type="button"
      onClick={onSend}
      disabled={!canSend}
      title={!canSend ? "Sign all checklist items first" : undefined}
      className={cn(
        // "flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-white transition-colors",
        "font-helvetica-now text-grey-50 rounded-2 flex h-8 items-center justify-center gap-1.5 px-3.5 text-xs leading-(--line-height-300) font-medium tracking-normal uppercase transition-colors lg:h-10 lg:text-sm",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
        canSend
          ? "bg-primary-600 hover:bg-primary-500"
          : "cursor-not-allowed bg-gray-300"
      )}
    >
      {/* <Send className="size-3" /> */}
      Send to Checker
    </button>
  );
}
