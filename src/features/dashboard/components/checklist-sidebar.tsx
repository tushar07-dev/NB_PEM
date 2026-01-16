import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";

export function ChecklistSidebar() {
  return (
    <div className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-sm font-bold text-slate-700">
        Document Checklist
      </h3>
      <div className="space-y-4">
        {/* Document Group Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500">
            Document Group<span className="text-red-500">*</span>
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Eg. ENG" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eng">Engineering</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Document Type Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500">
            Document Type<span className="text-red-500">*</span>
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Eg. XC" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xc">XC Type</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
