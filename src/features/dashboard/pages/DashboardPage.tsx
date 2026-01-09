"use client"

import { useAuth } from "@/app/providers/AuthProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
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
import {
  RotateCcw,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Upload,
  Download,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";

// Dashboard Stats Component
function StatsCards() {
  const stats = [
    {
      title: "Total Projects",
      value: "128",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Tasks",
      value: "45",
      change: "+8%",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Completed",
      value: "72",
      change: "+23%",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Review",
      value: "11",
      change: "-3%",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">{stat.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Simple Bar Chart Component
function BarChart() {
  const data = [
    { label: "Jan", value: 65 },
    { label: "Feb", value: 80 },
    { label: "Mar", value: 45 },
    { label: "Apr", value: 90 },
    { label: "May", value: 75 },
    { label: "Jun", value: 60 },
  ];

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Monthly Progress
        </CardTitle>
        <CardDescription>Project completion trends over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between h-48 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full bg-muted rounded-t-lg relative" style={{ height: "160px" }}>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all duration-300"
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Status Distribution Chart (Simple Donut)
function StatusChart() {
  const data = [
    { label: "Completed", value: 72, color: "bg-green-500" },
    { label: "In Progress", value: 45, color: "bg-blue-500" },
    { label: "Pending", value: 11, color: "bg-amber-500" },
  ];

  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Status Distribution
        </CardTitle>
        <CardDescription>Current project status breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-8">
          {/* Simple Progress Bars */}
          <div className="space-y-4 w-full">
            {data.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${(item.value / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Total: <span className="font-medium text-foreground">{total} projects</span>
        </p>
      </CardFooter>
    </Card>
  );
}

// Recent Activity Component
function RecentActivity() {
  const activities = [
    {
      title: "PEM Requirements Updated",
      description: "Project Alpha - Phase 2",
      time: "2 hours ago",
      icon: FileText,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Checklist Completed",
      description: "Discipline Activity List #123",
      time: "4 hours ago",
      icon: CheckCircle2,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "New Task Assigned",
      description: "Document Review - Phase 3",
      time: "Yesterday",
      icon: Clock,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Report Generated",
      description: "Monthly Summary Report",
      time: "2 days ago",
      icon: BarChart3,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {activity.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-center border-t pt-4">
        <Button variant="ghost" size="sm" className="text-primary">
          View All Activity
        </Button>
      </CardFooter>
    </Card>
  );
}

// Quick Actions Component
function QuickActions() {
  const actions = [
    {
      title: "Create New",
      description: "Start a new project",
      icon: Plus,
      variant: "default" as const,
    },
    {
      title: "Upload Document",
      description: "Add files to project",
      icon: Upload,
      variant: "outline" as const,
    },
    {
      title: "Generate Report",
      description: "Export project data",
      icon: Download,
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className="h-auto flex-col gap-2 py-4"
            >
              <action.icon className="h-5 w-5" />
              <span className="text-sm">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Team Members Component
function TeamMembers() {
  const members = [
    { name: "John Doe", role: "Project Manager", initials: "JD" },
    { name: "Sarah Smith", role: "Lead Engineer", initials: "SS" },
    { name: "Mike Johnson", role: "QA Engineer", initials: "MJ" },
    { name: "Emily Brown", role: "Designer", initials: "EB" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Members
        </CardTitle>
        <CardDescription>Active team on current project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {member.initials}
              </div>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Main Dashboard Page
const DashboardPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="p-5 bg-slate-50 min-h-screen space-y-6">
      {/* Filter Section */}
      <Accordion type="single" collapsible className="w-full bg-white rounded-xl shadow-sm">
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger className="text-slate-600 font-semibold px-4">
            Global Filter
          </AccordionTrigger>
          
          <AccordionContent>
            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2 px-4">
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
            <div className="flex justify-end mt-6 pt-4 border-t border-slate-100 px-4 pb-4">
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

      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back, {currentUser?.name || "User"} ({currentUser?.role})</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <StatsCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart />
        <StatusChart />
      </div>

      {/* Activity and Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <TeamMembers />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
