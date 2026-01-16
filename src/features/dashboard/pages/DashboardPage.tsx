"use client"
import { useAuth } from "@/app/providers/AuthProvider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { DashboardFilter } from "../components/global-filter";
import { ProjectHero } from "../components/project-hero";
import { ChecklistSidebar } from "../components/checklist-sidebar";
import { ChecklistTable } from "../components/checklist-table";
import { DashboardLoading } from "../components/skeletons/dashboard-loading";
import { useEffect, useState } from "react";


const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    // Base container with consistent padding and max-width for ultra-wide screens
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="mx-auto space-y-8">
        {/* Row 1: Global Filter & Top Actions */}
        <section className="w-full">
          <DashboardFilter />
        </section>

        {/* Row 3: Hero Area (Project Description) */}
        <section className="w-full">
          <ProjectHero />
        </section>

        {/* Row 4: Main Content Area - Sidebar + Table */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar - Spans 4 columns on large screens */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <ChecklistSidebar />
          </aside>

          {/* Main Table - Spans 8 columns on large screens */}
          <main className="lg:col-span-8 xl:col-span-9">
            <ChecklistTable />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
