// src/api/queries/project.queries.ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  ProjectResponseSchema,
  transformProjects,
  type DropdownItem,
} from "@/features/pem-check-lists/api/schemas";

export type Project = {
  id: string;
  name: string;
};

// Query key factory
export const projectQueryKeys = {
  all: ["projects"] as const,
  list: () => [...projectQueryKeys.all, "list"] as const,
};

/**
 * Fetch all projects
 * @returns Dropdown items for project select
 */
export function useProjects(): UseQueryResult<Project[], Error> {
  return useQuery({
    queryKey: projectQueryKeys.list(),
    queryFn: async (): Promise<Project[]> => {
      const { data } = await apiClient.get(API_ENDPOINTS.project.getAll, {
        headers: { "X-React-Query": "true" },
      });

      const validated = ProjectResponseSchema.parse(data);

      // Accept -1, 0, or 200 as success
      if (validated.status > 0 && validated.status !== 200) {
        throw new Error(validated.message || "Failed to fetch projects");
      }

      // Transform to Project format
      const dropdownItems = transformProjects(validated.data);

      return dropdownItems.map((item) => ({
        id: item.value,
        name: item.label,
      }));
    },
    staleTime: 10 * 60 * 1000, // Projects don't change often - cache 10min
  });
}
