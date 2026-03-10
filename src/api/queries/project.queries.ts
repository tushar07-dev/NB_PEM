// src/api/queries/project.queries.ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { customInstance } from "@/api/mutator/custom-instance";
import { validateApiResponse } from "@/api/utils";
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

      validateApiResponse(response, "Failed to fetch projects");
      return transformProjects(response.data ?? []);
    },
    staleTime: 10 * 60 * 1000, // Projects don't change often - cache 10min
  });
}
