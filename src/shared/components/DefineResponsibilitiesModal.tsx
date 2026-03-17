import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog"; // Adjust path based on your setup
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { Button } from "./ui/button";
import type { DocumentEntry } from "@/features/pem-check-lists/types/document";

interface ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  documentData?: DocumentEntry | null;
}
export function DefineResponsibilitiesModal({
  isOpen,
  onOpenChange,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 rounded-[24px] p-8 sm:max-w-120">
        <DialogHeader>
          <DialogTitle className="text-primary-500 text-2xl font-bold">
            Define Responsibilities
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          {/* Originator Field */}
          <div className="grid gap-2">
            <Label
              htmlFor="originator"
              className="text-sm font-medium text-slate-500"
            >
              Originator (Responsible)<span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger className="h-12 border-none bg-slate-50 text-slate-400">
                <SelectValue placeholder="EG. Amir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amir">Amir</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Checker Field */}
          <div className="grid gap-2">
            <Label
              htmlFor="checker"
              className="text-sm font-medium text-slate-500"
            >
              Checker (Reviewer)
            </Label>
            <Select>
              <SelectTrigger className="h-12 border-none bg-slate-50 text-slate-400">
                <SelectValue placeholder="EG. Sanghati" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sanghati">Sanghati</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Approver Field */}
          <div className="grid gap-2">
            <Label
              htmlFor="approver"
              className="text-sm font-medium text-slate-500"
            >
              Approver (Accountable)
            </Label>
            <Select>
              <SelectTrigger className="h-12 border-none bg-slate-50 text-slate-400">
                <SelectValue placeholder="EG. Xavier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xavier">Xavier</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Note Section */}
        <div className="bg-warning-50 border-warning-100 rounded-xl border p-4">
          <h4 className="text-warning-700 mb-1 text-lg font-bold">Note:</h4>
          <p className="text-primary-300 text-sm leading-relaxed">
            Please ensure that the names you fill in match those provided in the
            document
          </p>
        </div>

        <DialogFooter className="mt-2 flex gap-3 sm:justify-end">
          <Button
            variant="outline"
            className="text-primary-200 border-primary-200 rounded-lg px-8 py-6 font-semibold tracking-wide uppercase hover:bg-slate-50"
          >
            View Only
          </Button>
          <Button className="rounded-lg bg-[#0f172a] px-12 py-6 font-semibold tracking-wide text-white uppercase hover:bg-[#1e293b]">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
