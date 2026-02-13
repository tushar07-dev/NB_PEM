import { ChevronLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";

// Route name mapping
const routeNames: Record<string, string> = {
  dashboard: "Dashboard",
  "pem-requirements": "PEM Requirements",
  "control-object-requirement": "Control Object Requirement",
  "document-requirement": "Document Requirement",
  "discipline-activity-requirement": "Discipline Activity Requirement",
  "pem-checklists": "PEM Check Lists",
  "control-object-checklist": "Control Object Check List",
  "document-checklist": "Document Check List",
  "discipline-activity-checklist": "Discipline Activity Check List",
  admin: "Admin",
  settings: "Settings",
};

export function DynamicBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show breadcrumb on dashboard
  if (pathnames.length === 0 || pathnames[0] === "dashboard") {
    return null;
  }

  // Build breadcrumb items
  const breadcrumbItems = pathnames.map((_, index) => {
    const url = `/${pathnames.slice(0, index + 1).join("/")}`;
    const routeName = pathnames[index];
    const isLast = index === pathnames.length - 1;

    return {
      url,
      label: routeNames[routeName] || routeName,
      isLast,
    };
  });

  // Get the parent path for the back button
  const parentPath =
    pathnames.length > 1
      ? `/${pathnames.slice(0, -1).join("/")}`
      : "/dashboard";

  return (
    <div className="mb-4 flex items-center gap-3">
      {/* Back Button */}
      <Link
        to={parentPath}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white transition-colors hover:bg-gray-50"
        aria-label="Go back"
      >
        <ChevronLeft className="h-4 w-4 text-gray-600" />
      </Link>

      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <div key={item.url} className="flex items-center gap-2">
              <BreadcrumbItem>
                {item.isLast ? (
                  <BreadcrumbPage className="font-medium text-gray-900">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      to={item.url}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!item.isLast && <BreadcrumbSeparator />}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
