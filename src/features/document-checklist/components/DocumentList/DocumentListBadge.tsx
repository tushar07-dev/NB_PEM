// components/document-badge.tsx
import { Badge } from "@/shared/components/ui/badge";

export function DocumentListBadge({
  status,
}: {
  status: "Started" | "Completed" | "None";
}) {
  if (status === "None") return null;

  const styles = {
    Started: "bg-blue-100 text-blue-600 hover:bg-blue-100 border-none",
    Completed: "bg-green-100 text-green-600 hover:bg-green-100 border-none",
  };

  return (
    <Badge
      variant="secondary"
      className={`${styles[status]} px-3 py-1 font-medium`}
    >
      {status}
    </Badge>
  );
}
