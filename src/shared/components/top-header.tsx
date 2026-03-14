// src/shared/components/top-header.tsx
import { memo } from "react";
import { Bell, Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Icons } from "@/shared/components/icons";
import { useProjectStore } from "../store/projectStore";
import { useGenericPEMStore } from "../store/genericPemStore";
import { useAuthStore } from "../store/authStore";
import { useDocumentFilterStore } from "../store/documentFilterStore";
import { useProjects } from "@/api/queries/project.queries";
import { useGenericPEMs } from "@/features/pem-check-lists/api/queries";

const SELECT_TRIGGER_CLS =
  "header-pill h-9 w-40 px-5 text-sm md:flex lg:h-11 lg:w-44 lg:text-base xl:w-48";
const SELECT_CONTENT_CLS = "border-border bg-popover rounded-xl shadow-lg";

// ── Never re-renders unless user navigates away ──────────────────────────────
const HeaderLeft = memo(function HeaderLeft() {
  return (
    <div className="flex items-center gap-3">
      <Icons.ProjectLogo className="text-primary-foreground" />
      <span className="brand-text">PEM Digital</span>
      <div className="header-search-container w-62">
        <Input
          type="text"
          placeholder="Search Anything..."
          title="Search coming soon"
          className="header-pill text-primary-700 h-8 px-4 pr-10 text-sm lg:h-11"
        />
        <Search className="text-primary-400 absolute top-1/2 right-3 size-4 -translate-y-1/2" />
      </div>
    </div>
  );
});

// ── Re-renders only when project/PEM data changes ────────────────────────────
const HeaderSelectors = memo(function HeaderSelectors() {
  const { data: projects = [], isLoading: loadingProjects } = useProjects();
  const { data: genericPEMs = [], isLoading: loadingPEMs } = useGenericPEMs();
  const { selectedProject, setSelectedProject } = useProjectStore();
  const { selectedGenericPEM, setSelectedGenericPEM } = useGenericPEMStore();
  const resetDocumentFilters = useDocumentFilterStore(
    (s) => s.resetDocumentFilters
  );

  const handleProjectChange = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      resetDocumentFilters();
    }
  };

  const handleGenericPEMChange = (pemValue: string) => {
    const pem = genericPEMs.find((p) => p.value === pemValue);
    if (pem) {
      setSelectedGenericPEM(pem);
      resetDocumentFilters();
    }
  };

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* Generic PEM */}
      {loadingPEMs ? (
        <Skeleton className="hidden h-9 w-40 rounded-full bg-gray-50 md:flex lg:h-11 lg:w-44 xl:w-48" />
      ) : (
        <Select
          value={selectedGenericPEM?.value ?? ""}
          onValueChange={handleGenericPEMChange}
        >
          <SelectTrigger className={SELECT_TRIGGER_CLS}>
            <SelectValue placeholder="Generic PEM" />
          </SelectTrigger>
          <SelectContent className={SELECT_CONTENT_CLS}>
            <SelectGroup>
              {genericPEMs.map((pem, index) => (
                <SelectItem
                  key={`generic-pem-${pem.value}-${index}`}
                  value={pem.value}
                  className="cursor-pointer rounded-lg"
                >
                  {pem.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      {/* Project */}
      {loadingProjects ? (
        <Skeleton className="hidden h-9 w-40 rounded-full bg-gray-50 md:flex lg:h-11 lg:w-44 xl:w-48" />
      ) : (
        <Select
          value={selectedProject?.id ?? ""}
          onValueChange={handleProjectChange}
        >
          <SelectTrigger className={SELECT_TRIGGER_CLS}>
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent className={SELECT_CONTENT_CLS}>
            <SelectGroup>
              {projects.map((project) => (
                <SelectItem
                  key={project.id}
                  value={project.id}
                  className="cursor-pointer rounded-lg"
                >
                  {project.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
});

// ── Re-renders only when auth profile changes ────────────────────────────────
const HeaderActions = memo(function HeaderActions() {
  const { profile } = useAuthStore();

  const initials =
    profile?.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="header-icon-btn relative h-9 w-9 lg:h-11 lg:w-11"
        aria-label="Notifications"
      >
        <Bell className="size-4 lg:size-5" />
      </Button>
      <Avatar className="size-10 ring-1 ring-white/20 hover:ring-white/40 lg:size-12">
        <AvatarFallback className="avatar-fallback">{initials}</AvatarFallback>
      </Avatar>
    </div>
  );
});

// ── Root — never re-renders itself ───────────────────────────────────────────
export function TopHeader() {
  return (
    <header className="top-header-bar">
      <HeaderLeft />
      <div className="flex items-center gap-2 md:gap-3">
        <HeaderSelectors />
        <HeaderActions />
      </div>
    </header>
  );
}
