// src/features/pem-check-lists/pages/components/StatusBanner.tsx
//
// Renders an info or warning banner from the permissions map.
// No role/status logic here — just takes a banner config and renders.

import { AlertTriangle, Info } from "lucide-react";
import type { DocumentPermissions } from "../../permissions";

interface StatusBannerProps {
  banner: DocumentPermissions["banner"];
}

export function StatusBanner({ banner }: StatusBannerProps) {
  if (!banner) return null;

  if (banner.variant === "info") {
    return (
      <div className="flex items-start gap-2.5 rounded-md border border-blue-200 bg-blue-50 px-3.5 py-2.5">
        <Info className="mt-0.5 size-3.5 shrink-0 text-blue-500" />
        <p className="text-xs text-blue-700">{banner.message}</p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 rounded-md border border-amber-200 bg-amber-50 px-3.5 py-2.5">
      <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
      <p className="text-xs text-amber-700">{banner.message}</p>
    </div>
  );
}
