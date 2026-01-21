import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { SearchableFilterSelect } from "@/shared/components/ui/SearchableFilterSelect";

export const AssignmentCard = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-medium">Assigned To</CardTitle>
        <Button variant="outline" size="sm" className="h-8">
          SAVE
        </Button>
      </CardHeader>
      <CardContent>
        {/* Internal grid for the inputs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            {/* <Label htmlFor="originator">
              Originator <span className="text-destructive">*</span>
            </Label> */}
            <SearchableFilterSelect
              label="Originator"
              placeholder="Eg. XC"
              options={[
                { value: "option1", label: "Option 1" },
                { value: "option2", label: "Option 2" },
              ]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="checker">
              Checker <span className="text-destructive">*</span>
            </Label>
            <Select>
              <SelectTrigger id="checker">
                <SelectValue placeholder="Eg. XC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user2">Sofia Martinez</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="approver">
              Approver <span className="text-destructive">*</span>
            </Label>
            <Select>
              <SelectTrigger id="approver">
                <SelectValue placeholder="Eg. XC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user3">Liam Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
