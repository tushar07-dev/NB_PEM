// src/features/pem-checklists/components/DocumentTable/RevHistoryModal.tsx
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { type DocumentEntry } from "../../types/document";

interface Props {
  open: boolean;
  onClose: () => void;
  row: DocumentEntry | null;
}

export function RevHistoryModal({ open, onClose, row }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      {open && row && (
        <DialogContent className="m-0 h-screen w-screen max-w-none rounded-none p-0 [&>button:last-child]:hidden">
          <div className="flex h-full flex-col">
            <DialogHeader className="flex flex-row items-center justify-between border-b p-6">
              <DialogTitle className="text-2xl font-bold">
                Revision History — {row.documentNo}
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </DialogHeader>
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                <section className="bg-muted/50 rounded-lg p-6">
                  <h3 className="mb-4 text-lg font-semibold">Document Information</h3>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                      { label: "Title",            value: row.title },
                      { label: "Document No",      value: row.documentNo },
                      { label: "Reason For Issue", value: row.reasonForIssue },
                      { label: "Revision Status",  value: row.revisionStatus },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-muted-foreground text-sm">{label}</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="bg-muted/50 rounded-lg p-6">
                  <h3 className="mb-4 text-lg font-semibold">Current Revision Details</h3>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    {[
                      { label: "Revision",                value: row.revision ?? "-" },
                      { label: "Originator (Self Check)", value: row.originatorSelfCheck ?? "-" },
                      { label: "Checker",                 value: row.checker ?? "-" },
                      { label: "Approver",                value: row.approver ?? "-" },
                      { label: "Progress",                value: row.progress },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-muted-foreground text-sm">{label}</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="bg-muted/50 rounded-lg p-6">
                  <h3 className="mb-4 text-lg font-semibold">Revision Timeline</h3>
                  <div className="flex items-start gap-4">
                    <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                    <div>
                      <p className="font-medium">Current — Revision {row.revision ?? "N/A"}</p>
                      <p className="text-muted-foreground text-sm">Latest version</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}