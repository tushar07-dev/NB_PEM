import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Trash2 } from "lucide-react"; // Or use the icon shown in the image
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { SearchableFilterSelect } from "@/shared/components/ui/SearchableFilterSelect";

export const ChecklistFilters = () => {
  // Define the filters based on the image provided
  const filters = [
    { label: "Discipline", placeholder: "Eg. HVAC", required: true },
    { label: "Document Group", placeholder: "Eg. ENG", required: true },
    { label: "Document Type", placeholder: "EG. XC", required: true },
    { label: "Facility Code", placeholder: "EG. XC", required: false },
    { label: "System", placeholder: "EG. XC", required: false },
    { label: "Area", placeholder: "EG. XC", required: false },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-semibold text-slate-700">
          Filter
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs font-bold text-slate-500 uppercase"
        >
          <Trash2 className="h-3 w-3" />
          Clear All
        </Button>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {/* Responsive Grid: 1 col on mobile, 3 cols on desktop */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3">
          {filters.map((filter, index) => (
            <div key={index} className="space-y-1.5">
              {/* <Label className="text-xs font-medium text-slate-500">
                {filter.label}
                {filter.required && (
                  <span className="ml-0.5 text-red-500">*</span>
                )}
              </Label>
              <Select>
                <SelectTrigger className="h-10 border-none bg-slate-50 text-slate-400">
                  <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="example">Example Option</SelectItem>
                </SelectContent>
              </Select> */}
              <SearchableFilterSelect
                label= {`${filter.label}`}
                placeholder={filter.placeholder}
                options={[
                  { value: "option1", label: "Option 1" },
                  { value: "option2", label: "Option 2" },
                ]}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
