// src/shared/components/top-header.tsx
import { Bell, Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { DropdownMenuLabel } from "@/shared/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Icons } from "@/shared/components/icons";
import { useProjectStore } from "../store/projectStore";
import { useProjects } from "@/api/queries/project.queries";

export function TopHeader() {
  // Fetch projects from API
  const { data: projects = [], isLoading } = useProjects();

  // Get selected project from store
  const { selectedProject, setSelectedProject } = useProjectStore();

  // Handle project selection
  const handleProjectChange = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
    }
  };

  return (
    <header role="banner" className="top-header-bar">
      <div className="flex items-center gap-3">
        <Icons.ProjectLogo className="text-primary-foreground" />
        <span className="brand-text">PEM Digital</span>
        <div className="header-search-container" style={{ width: "250px" }}>
          <Input
            type="text"
            placeholder="Search Anything..."
            className="header-pill text-primary-700 h-[32px] px-4 pr-10 text-sm lg:h-[44px]"
          />
          <Search className="text-primary-400 absolute top-1/2 right-3 size-4 -translate-y-1/2" />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* API-Powered Project Selector */}
        <Select
          value={selectedProject?.id}
          onValueChange={handleProjectChange}
          disabled={isLoading}
        >
          <SelectTrigger className="header-pill hidden h-[32px] w-[160px] px-5 py-3 text-sm md:flex lg:h-[46px] lg:w-[180px] lg:text-base xl:w-[200px]">
            <SelectValue
              placeholder={isLoading ? "Loading..." : "Select Project"}
            />
          </SelectTrigger>

          <SelectContent className="border-border bg-popover rounded-xl shadow-lg">
            <DropdownMenuLabel className="text-muted-foreground px-2 py-1.5 text-[12px] font-bold tracking-wider uppercase">
              Active Projects
            </DropdownMenuLabel>
            {projects.map((project) => (
              <SelectItem
                key={project.id}
                value={project.id}
                className="cursor-pointer rounded-lg"
              >
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" className="header-icon-btn">
          <Bell className="size-4 lg:size-5" />
        </Button>

        <Avatar className="size-[32px] border-none ring-1 ring-white/20 hover:ring-white/40 lg:size-[50px]">
          <AvatarFallback className="avatar-fallback">XF</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
