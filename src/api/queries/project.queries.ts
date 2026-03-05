// src/api/queries/project.queries.ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { customInstance } from "@/api/mutator/custom-instance";
import type {
  ProjectResponseDto,
  ProjectResponseDtoListApiResponse,
} from "@/api/generated/schemas";

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
 * Transform API response to Project format
 */
function transformProjects(data: ProjectResponseDto[]): Project[] {
  return data.map((item) => ({
    id: item.projectID ?? "",
    name: item.projectName ?? "",
  }));
}

/**
 * Fetch all projects
 * @returns Projects for select dropdown
 */
export function useProjects(): UseQueryResult<Project[], Error> {
  return useQuery({
    queryKey: projectQueryKeys.list(),
    queryFn: async (): Promise<Project[]> => {
      const response = await customInstance<ProjectResponseDtoListApiResponse>({
        url: "/api/Project/GetProjects",
        method: "GET",
      });

      // Accept -1, 0, or 200 as success
      const status = response.status ?? 0;
      if (status > 0 && status !== 200) {
        throw new Error(response.message ?? "Failed to fetch projects");
      }

      return transformProjects(response.data ?? []);
    },
    staleTime: 10 * 60 * 1000, // Projects don't change often - cache 10min
  });
}
