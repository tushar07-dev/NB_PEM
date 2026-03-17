import React from "react";
import { ROUTES } from "@/shared/config/routes";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { Icons } from "./icons";

// Route segment → human-readable label.
// Add a new entry here whenever a new page/route is created.
const ROUTE_NAMES: Record<string, string> = {
  dashboard: "Dashboard",
  // PEM Requirements
  "pem-requirements": "PEM Requirements",
  "control-object-requirement": "Control Object Requirement",
  "document-requirement": "Document Requirement",
  "discipline-activity-requirement": "Discipline Activity Requirement",
  // PEM Checklists
  "pem-checklists": "PEM Check Lists",
  "control-object-checklist": "Control Object Check List",
  "document-checklist": "Document Check List",
  checklist: "Document Checklist Detaile",
  "discipline-activity-checklist": "Discipline Activity Check List",
  // Admin
  admin: "Admin",
  settings: "Settings",
};

/**
 * Segments that have no real page — they immediately redirect to a child.
 * Rendered as plain text in the breadcrumb instead of clickable links,
 * to avoid navigating to a URL that just redirects again.
 */
const REDIRECT_ONLY_SEGMENTS = new Set([
  "pem-requirements",
  "pem-checklists",
  "admin",
]);

/**
 * Converts an unmapped URL segment into a readable fallback label.
 * e.g. "my-new-page" → "My New Page"
 */
function slugToLabel(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function DynamicBreadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split("/").filter(Boolean);

  // Don't show breadcrumb on dashboard or root
  if (pathnames.length === 0 || pathnames[0] === "dashboard") {
    return null;
  }

  // Skip single-segment paths — "Home > Admin" adds no value when the
  // user is about to be redirected to a child page anyway.
  if (pathnames.length === 1) {
    return null;
  }

  // "Home" is always the first crumb, linking to /dashboard
  const homeCrumb = {
    url: ROUTES.DASHBOARD,
    label: "Home",
    isLast: false,
    isRedirectOnly: false,
  };

    const routeCrumbs = pathnames.slice(1).map((segment, index) => {
      const url = `/${pathnames.slice(0, index + 2).join("/")}`;
      const isLast = index === pathnames.slice(1).length - 1;
      const label = ROUTE_NAMES[segment] ?? slugToLabel(segment);
      const isRedirectOnly = REDIRECT_ONLY_SEGMENTS.has(segment);

      return { url, label, isLast, isRedirectOnly };
    });
console.log("Breadcrumb segments:", [homeCrumb, ...routeCrumbs]);
  const allCrumbs = [homeCrumb, ...routeCrumbs];

  return (
    <div className="mb-2 flex items-center gap-3 border-b border-gray-200 px-7 py-2 lg:mb-4 lg:py-4">
      {/* Back button — uses browser history so it always goes to the
          actual previous page, not a URL that may redirect again. */}
      <button
        onClick={() => navigate(-1)}
        className="bg-grey-50 flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 transition-colors hover:bg-gray-50"
        aria-label="Go back"
        type="button"
      >
        <Icons.ArrowLeftIcon className="h-4 w-4 text-gray-600" />
      </button>

      {/* Breadcrumb trail */}
      <Breadcrumb>
        <BreadcrumbList>
          {allCrumbs.map((item) => (
            <React.Fragment key={item.url}>
              <BreadcrumbItem>
                {item.isLast || item.isRedirectOnly ? (
                  // Current page OR redirect-only section → plain text, not a link
                  <BreadcrumbPage
                    className={
                      item.isLast
                        ? "font-medium text-gray-900"
                        : "font-normal text-gray-500"
                    }
                  >
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
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
