// src/features/pem-check-lists/pages/components/action-bars/CompletedBadge.tsx
import { Badge } from "@/shared/components/ui/badge";

export function CompletedBadge() {
  return (
    <Badge
      variant="outline"
      className="border-green-200 bg-green-50 px-2.5 py-0.5 text-xs text-green-700"
    >
      ✓ Document Released
    </Badge>
  );
}
