import { FileText } from "lucide-react";
import { DocumentListBadge } from "./DocumentListBadge";
import { useSidebar } from "@/shared/components/ui/sidebar";
import { cn } from "@/shared/lib/utils";

interface DocumentItemProps {
  doc: {
    title: string;
    code: string;
    status?: "Started" | "Completed";
    isActive?: boolean;
  };
}

export const DocumentListItem = ({ doc }: DocumentItemProps) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  return (
    <div
      className={cn(
        "doc-list-item", // Base utility class
        doc.isActive ? "doc-list-item-active" : "doc-list-item-hover",
        isExpanded ? "gap-2 p-2" : "gap-3 p-3" // Dynamic padding/gap
      )}
    >
      {/* Responsive Icon Container */}
      <div className={cn("doc-icon-box", isExpanded ? "h-8 w-8" : "h-10 w-10")}>
        <FileText
          className={cn("text-slate-600", isExpanded ? "h-4 w-4" : "h-5 w-5")}
        />{" "}
      </div>

      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
          {/* Title: We use max-w-full to ensure it can take the whole line if the badge wraps */}
          <p
            className={cn(
              "doc-title max-w-full",
              isExpanded ? "text-[11px]" : "text-[13px]"
            )}
          >
            {doc.title}
          </p>

          {/* Badge Wrapper: The badge will now drop down if gap-x-2 is violated */}
          {doc.status && (
            <div
              className={cn(
                "shrink-0 origin-left lg:origin-right", // origin changes based on placement
                isExpanded ? "scale-75" : "scale-90 sm:scale-100"
              )}
            >
              <DocumentListBadge status={doc.status} />
            </div>
          )}
        </div>

        {/* Metadata: Use "break-words" or "truncate" based on preference */}
        <p
          className={cn(
            "doc-code mt-0.5",
            isExpanded ? "text-[9px]" : "text-[11px]" // Adaptive font size
          )}
        >
          {doc.code}
        </p>
      </div>
    </div>
  );
};
