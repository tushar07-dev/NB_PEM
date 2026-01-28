import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

export const DocumentSearchBar = () => (
  <div className="group relative mb-3 sm:mb-4">
    <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 sm:h-4 sm:w-4" />
    <Input
      placeholder="Search..."
      className="h-8 border-slate-200 bg-slate-50/50 pl-9 text-[10px] transition-all sm:h-10 sm:pl-10 sm:text-xs"
    />
  </div>
);