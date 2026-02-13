// src/features/pem-check-lists/api/queries.ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  type DropdownItem,
  DisciplineResponseSchema,
  DocumentGroupResponseSchema,
  DocumentTypeResponseSchema,
  FacilityCodeResponseSchema,
  SystemResponseSchema,
  AreaResponseSchema,
  transformDisciplines,
  transformDocumentGroups,
  transformDocumentTypes,
  transformFacilityCodes,
  transformSystems,
  transformAreas,
} from "./schemas";

// ============================================
// Query Keys Factory (for cache management)
// ============================================
export const documentQueryKeys = {
  all: ["documents"] as const,
  disciplines: (projectId: string) =>
    [...documentQueryKeys.all, "disciplines", projectId] as const,
  documentGroups: (disciplineId: string) =>
    [...documentQueryKeys.all, "groups", disciplineId] as const,
  documentTypes: (disciplineId: string) =>
    [...documentQueryKeys.all, "types", disciplineId] as const,
  facilityCodes: (disciplineId: string) =>
    [...documentQueryKeys.all, "facilities", disciplineId] as const,
  systems: (disciplineId: string) =>
    [...documentQueryKeys.all, "systems", disciplineId] as const,
  areas: (disciplineId: string) =>
    [...documentQueryKeys.all, "areas", disciplineId] as const,
};

// ============================================
// React Query Hooks
// ============================================

/**
 * Fetch disciplines for a given project
 * @param projectId - Project ID (required)
 * @returns Dropdown items for discipline select
 */
export function useDisciplines(
  projectId: string | undefined
): UseQueryResult<DropdownItem[], Error> {
  return useQuery({
    queryKey: documentQueryKeys.disciplines(projectId ?? ""),
    queryFn: async (): Promise<DropdownItem[]> => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }

      const { data } = await apiClient.get(
        API_ENDPOINTS.discipline.getByProject(projectId),
        {
          headers: { "X-React-Query": "true" },
        }
      );

      const validated = DisciplineResponseSchema.parse(data);

      // Accept -1, 0, or 200 as success
      if (validated.status > 0 && validated.status !== 200) {
        throw new Error(validated.message || "Failed to fetch disciplines");
      }

      return transformDisciplines(validated.data);
    },
    enabled: !!projectId,
  });
}

/**
 * Fetch document groups for a given discipline
 * @param disciplineId - Discipline ID (required)
 * @returns Dropdown items for document group select
 */
export function useDocumentGroups(
  disciplineId: string | undefined
): UseQueryResult<DropdownItem[], Error> {
  return useQuery({
    queryKey: documentQueryKeys.documentGroups(disciplineId ?? ""),
    queryFn: async (): Promise<DropdownItem[]> => {
      if (!disciplineId) {
        throw new Error("Discipline ID is required");
      }

      const { data } = await apiClient.get(
        API_ENDPOINTS.document.getGroup(disciplineId),
        {
          headers: { "X-React-Query": "true" },
        }
      );

      const validated = DocumentGroupResponseSchema.parse(data);

      // Accept -1, 0, or 200 as success
      if (validated.status > 0 && validated.status !== 200) {
        throw new Error(validated.message || "Failed to fetch document groups");
      }

      return transformDocumentGroups(validated.data);
    },
    enabled: !!disciplineId,
  });
}

/**
 * Fetch document types for a given discipline
 * @param disciplineId - Discipline ID (required)
 * @returns Dropdown items for document type select
 */
export function useDocumentTypes(
  disciplineId: string | undefined
): UseQueryResult<DropdownItem[], Error> {
  return useQuery({
    queryKey: documentQueryKeys.documentTypes(disciplineId ?? ""),
    queryFn: async (): Promise<DropdownItem[]> => {
      if (!disciplineId) {
        throw new Error("Discipline ID is required");
      }

      const { data } = await apiClient.get(
        API_ENDPOINTS.document.getType(disciplineId),
        {
          headers: { "X-React-Query": "true" },
        }
      );

      const validated = DocumentTypeResponseSchema.parse(data);

      // Accept -1, 0, or 200 as success
      if (validated.status > 0 && validated.status !== 200) {
        throw new Error(validated.message || "Failed to fetch document types");
      }

      return transformDocumentTypes(validated.data);
    },
    enabled: !!disciplineId,
  });
}

/**
 * Fetch facility codes for a given discipline
 * @param disciplineId - Discipline ID (required)
 * @returns Dropdown items for facility code select
 */
export function useFacilityCodes(
  disciplineId: string | undefined
): UseQueryResult<DropdownItem[], Error> {
  return useQuery({
    queryKey: documentQueryKeys.facilityCodes(disciplineId ?? ""),
    queryFn: async (): Promise<DropdownItem[]> => {
      if (!disciplineId) {
        throw new Error("Discipline ID is required");
      }

      const { data } = await apiClient.get(
        API_ENDPOINTS.common.getFacilityCode(disciplineId),
        {
          headers: { "X-React-Query": "true" },
        }
      );

      const validated = FacilityCodeResponseSchema.parse(data);

      // Accept -1, 0, or 200 as success
      if (validated.status > 0 && validated.status !== 200) {
        throw new Error(validated.message || "Failed to fetch facility codes");
      }

      return transformFacilityCodes(validated.data);
    },
    enabled: !!disciplineId,
  });
}

/**
 * Fetch systems for a given discipline
 * @param disciplineId - Discipline ID (required)
 * @returns Dropdown items for system select
 */
export function useSystems(
  disciplineId: string | undefined
): UseQueryResult<DropdownItem[], Error> {
  return useQuery({
    queryKey: documentQueryKeys.systems(disciplineId ?? ""),
    queryFn: async (): Promise<DropdownItem[]> => {
      if (!disciplineId) {
        throw new Error("Discipline ID is required");
      }

      const { data } = await apiClient.get(
        API_ENDPOINTS.common.getSystem(disciplineId),
        {
          headers: { "X-React-Query": "true" },
        }
      );

      const validated = SystemResponseSchema.parse(data);

      // Accept -1, 0, or 200 as success
      if (validated.status > 0 && validated.status !== 200) {
        throw new Error(validated.message || "Failed to fetch systems");
      }

      return transformSystems(validated.data);
    },
    enabled: !!disciplineId,
  });
}

/**
 * Fetch areas for a given discipline
 * @param disciplineId - Discipline ID (required)
 * @returns Dropdown items for area select
 */
export function useAreas(
  disciplineId: string | undefined
): UseQueryResult<DropdownItem[], Error> {
  return useQuery({
    queryKey: documentQueryKeys.areas(disciplineId ?? ""),
    queryFn: async (): Promise<DropdownItem[]> => {
      if (!disciplineId) {
        throw new Error("Discipline ID is required");
      }

      const { data } = await apiClient.get(
        API_ENDPOINTS.common.getArea(disciplineId),
        {
          headers: { "X-React-Query": "true" },
        }
      );

      const validated = AreaResponseSchema.parse(data);

      // Accept -1, 0, or 200 as success
      if (validated.status > 0 && validated.status !== 200) {
        throw new Error(validated.message || "Failed to fetch areas");
      }

      return transformAreas(validated.data);
    },
    enabled: !!disciplineId,
  });
}
