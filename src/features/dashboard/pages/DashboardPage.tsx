"use client"

import { useAuth } from "@/app/providers/AuthProvider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { RotateCcw } from "lucide-react";

const DashboardPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="p-5 bg-slate-50 min-h-screen">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger className="text-slate-600 font-semibold">
            Global Filter
          </AccordionTrigger>
          
          <AccordionContent>
            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2">
              
              {/* Filter 1: Project Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 ml-1">Project Type</label>
                <Select>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter 2: Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 ml-1">Status</label>
                <Select>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter 3: Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 ml-1">Category</label>
                <Select>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter 4: Priority */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 ml-1">Priority</label>
                <Select>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter 5: Assigned To */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 ml-1">Assigned To</label>
                <Select>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="me">Assigned to Me</SelectItem>
                    <SelectItem value="team">My Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex justify-end mt-6 pt-4 border-t border-slate-100">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-slate-600 gap-2 hover:bg-slate-50"
                onClick={() => console.log("Filters Reset")}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Filters
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Main Content Area */}
      <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, {currentUser?.name} ({currentUser?.role})</p>
      </div>
    </div>
  );
};

export default DashboardPage;