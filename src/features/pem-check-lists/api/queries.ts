// src/features/pem-check-lists/api/queries.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { customInstance } from "@/api/mutator/custom-instance";

import type {
  DisciplineResponseDto,
  DisciplineResponseDtoListApiResponse,
  DocumentGroupResponseDto,
  DocumentGroupResponseDtoListApiResponse,
  DocumentTypeResponseDto,
  DocumentTypeResponseDtoListApiResponse,
  FacilityCodeResponseDto,
  FacilityCodeResponseDtoListApiResponse,
  SystemResponseDto,
  SystemResponseDtoListApiResponse,
  AreaResponseDto,
  AreaResponseDtoListApiResponse,
  GenericPEMResponseDto,
  GenericPEMResponseDtoListApiResponse,
  PagedRequest,
  ProjectDocumentsResponseDto,
  ProjectDocumentsResponseDtoPagedResponseApiResponse,
  AssignProjectDocumentRolesRequestDto,
  AssignProjectDocumentRolesResponseDtoApiResponse,
  EmailRequestDto,
} from "@/api/generated/schemas";

export type {
  PagedRequest,
  ProjectDocumentsResponseDto,
  DisciplineResponseDto,
  DocumentGroupResponseDto,
  DocumentTypeResponseDto,
  FacilityCodeResponseDto,
  SystemResponseDto,
  AreaResponseDto,
  GenericPEMResponseDto,
  AssignProjectDocumentRolesRequestDto,
  EmailRequestDto,
};

// ============================================
// Dropdown Item Type (for UI selects)
// ============================================
export interface DropdownItem {
  value: string;
  label: string;
}

// ============================================
// Transform Functions (API → Dropdown Format)
// Sorted alphabetically for stable render order
// ============================================
export function transformDisciplines(
  data: DisciplineResponseDto[]
): DropdownItem[] {
  return data
    .filter((item) => item.id && item.disciplineName)
    .map((item) => ({ value: item.id!, label: item.disciplineName! }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function transformDocumentGroups(
  data: DocumentGroupResponseDto[]
): DropdownItem[] {
  return data
    .filter((item) => item.id && item.documentGroup)
    .map((item) => ({ value: item.id!, label: item.documentGroup! }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function transformDocumentTypes(
  data: DocumentTypeResponseDto[]
): DropdownItem[] {
  return data
    .filter((item) => item.id && item.documentType)
    .map((item) => ({ value: item.id!, label: item.documentType! }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function transformFacilityCodes(
  data: FacilityCodeResponseDto[]
): DropdownItem[] {
  return data
    .filter((item) => item.id && item.facilityCode)
    .map((item) => ({ value: item.id!, label: item.facilityCode! }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function transformSystems(data: SystemResponseDto[]): DropdownItem[] {
  return data
    .filter((item) => item.id && item.system)
    .map((item) => ({ value: item.id!, label: item.system! }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function transformAreas(data: AreaResponseDto[]): DropdownItem[] {
  return data
    .filter((item) => item.id && item.area)
    .map((item) => ({ value: item.id!, label: item.area! }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// Deduplicated by pemName — backend sometimes returns duplicates
export function transformGenericPEMs(
  data: GenericPEMResponseDto[]
): DropdownItem[] {
  const seen = new Set<string>();
  return data
    .filter(
      (item) =>
        item.pemName && !seen.has(item.pemName!) && seen.add(item.pemName!)
    )
    .map((item) => ({ value: item.pemName!, label: item.pemName! }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// ============================================
// Query Keys Factory
// ============================================
export const documentQueryKeys = {
  all: ["documents"] as const,
  disciplines: () => [...documentQueryKeys.all, "disciplines"] as const,
  documentGroups: () => [...documentQueryKeys.all, "groups"] as const,
  documentTypes: (documentGroup: string) =>
    [...documentQueryKeys.all, "types", documentGroup] as const,
  facilityCodes: () => [...documentQueryKeys.all, "facilities"] as const,
  systems: () => [...documentQueryKeys.all, "systems"] as const,
  areas: () => [...documentQueryKeys.all, "areas"] as const,
  genericPEMs: () => [...documentQueryKeys.all, "genericPEMs"] as const,
  projectDocuments: (request: PagedRequest) =>
    [...documentQueryKeys.all, "projectDocuments", request] as const,
};

// ============================================
// API Helper
// ============================================
function validateApiResponse<
  T extends { status?: number | null; message?: string | null },
>(response: T, errorMessage: string): void {
  const status = response.status ?? 0;
  // Treat 0 (field absent) and 2xx as success; throw on 4xx/5xx body status
  if (status !== 0 && status !== -1 && (status < 200 || status >= 300)) {
    throw new Error(response.message ?? errorMessage);
  }
}

// ============================================
// Dropdown Hooks
// ============================================
export function useDisciplines(): UseQueryResult<DropdownItem[], Error> {
  return useQuery({
    queryKey: documentQueryKeys.disciplines(),
    queryFn: async (): Promise<DropdownItem[]> => {
      const response =
        await customInstance<DisciplineResponseDtoListApiResponse>({
          url: "/api/Discipline/GetDisciplines",
          method: "GET",
        });
      validateApiResponse(response, "Failed to fetch disciplines");
      return transformDisciplines(response.data ?? []);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useGenericPEMs(): UseQueryResult<DropdownItem[], Error> {
  return useQuery({
    queryKey: documentQueryKeys.genericPEMs(),
    queryFn: async (): Promise<DropdownItem[]> => {
      const response =
        await customInstance<GenericPEMResponseDtoListApiResponse>({
          url: "/api/GenericPEM/GetGenericPEM",
          method: "GET",
        });
      validateApiResponse(response, "Failed to fetch generic PEMs");
      return transformGenericPEMs(response.data ?? []);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useDocumentGroups(): UseQueryResult<DropdownItem[], Error> {
  return useQuery({
    queryKey: documentQueryKeys.documentGroups(),
    queryFn: async (): Promise<DropdownItem[]> => {
      const response =
        await customInstance<DocumentGroupResponseDtoListApiResponse>({
          url: "/api/Document/GetDocumentGroup",
          method: "GET",
        });
      validateApiResponse(response, "Failed to fetch document groups");
      return transformDocumentGroups(response.data ?? []);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useDocumentTypes(
  documentGroup: string | undefined
): UseQueryResult<DropdownItem[], Error> {
  return useQuery({
    queryKey: documentQueryKeys.documentTypes(documentGroup ?? ""),
    queryFn: async (): Promise<DropdownItem[]> => {
      const response =
        await customInstance<DocumentTypeResponseDtoListApiResponse>({
          url: `/api/Document/GetDocumentType/${documentGroup!}`,
          method: "GET",
        });
      validateApiResponse(response, "Failed to fetch document types");
      return transformDocumentTypes(response.data ?? []);
    },
    enabled: !!documentGroup,
    staleTime: 10 * 60 * 1000,
  });
}

// FIX #4: was ignoring the enabled param — fired on every mount regardless
// of whether the parent filter was active, causing unnecessary API calls.
export function useFacilityCodes(
  enabled = true
): UseQueryResult<DropdownItem[], Error> {
  return useQuery({
    queryKey: documentQueryKeys.facilityCodes(),
    queryFn: async (): Promise<DropdownItem[]> => {
      const response =
        await customInstance<FacilityCodeResponseDtoListApiResponse>({
          url: "/api/CommonDocument/GetFacilityCode",
          method: "GET",
        });
      validateApiResponse(response, "Failed to fetch facility codes");
      return transformFacilityCodes(response.data ?? []);
    },
    staleTime: 10 * 60 * 1000,
    enabled,
  });
}

// FIX #4: same as useFacilityCodes — enabled param was ignored
export function useSystems(
  enabled = true
): UseQueryResult<DropdownItem[], Error> {
  return useQuery({
    queryKey: documentQueryKeys.systems(),
    queryFn: async (): Promise<DropdownItem[]> => {
      const response = await customInstance<SystemResponseDtoListApiResponse>({
        url: "/api/CommonDocument/GetSystem",
        method: "GET",
      });
      validateApiResponse(response, "Failed to fetch systems");
      return transformSystems(response.data ?? []);
    },
    staleTime: 10 * 60 * 1000,
    enabled,
  });
}

// FIX #4: same as useFacilityCodes — enabled param was ignored
export function useAreas(
  enabled = true
): UseQueryResult<DropdownItem[], Error> {
  return useQuery({
    queryKey: documentQueryKeys.areas(),
    queryFn: async (): Promise<DropdownItem[]> => {
      const response = await customInstance<AreaResponseDtoListApiResponse>({
        url: "/api/CommonDocument/GetArea",
        method: "GET",
      });
      validateApiResponse(response, "Failed to fetch areas");
      return transformAreas(response.data ?? []);
    },
    staleTime: 10 * 60 * 1000,
    enabled,
  });
}

// ============================================
// Project Documents (Paginated)
// ============================================
export interface PagedProjectDocumentsResponse {
  items: ProjectDocumentsResponseDto[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export function useProjectDocuments(
  request: PagedRequest,
  enabled = true
): UseQueryResult<PagedProjectDocumentsResponse, Error> {
  return useQuery({
    queryKey: documentQueryKeys.projectDocuments(request),
    queryFn: async (): Promise<PagedProjectDocumentsResponse> => {
      const response =
        await customInstance<ProjectDocumentsResponseDtoPagedResponseApiResponse>(
          {
            url: "/api/ProjectDocuments/GetProjectDocuments",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data: request,
          }
        );

      validateApiResponse(response, "Failed to fetch project documents");

      return {
        items: response.data?.items ?? [],
        total: response.data?.total ?? 0,
        totalPages: response.data?.totalPages ?? 0,
        page: response.data?.page ?? 1,
        pageSize: response.data?.pageSize ?? 10,
      };
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================
// Assign Document Roles Mutation
// ============================================
export function useAssignDocumentRoles(): UseMutationResult<
  AssignProjectDocumentRolesResponseDtoApiResponse,
  Error,
  AssignProjectDocumentRolesRequestDto
> {
  // FIX: use useQueryClient() hook instead of imported singleton —
  // the hook version is always in sync with the nearest QueryClientProvider.
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: AssignProjectDocumentRolesRequestDto
    ): Promise<AssignProjectDocumentRolesResponseDtoApiResponse> => {
      const response =
        await customInstance<AssignProjectDocumentRolesResponseDtoApiResponse>({
          url: "/api/ProjectDocuments/AssignProjectDocumentRoles",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          data: payload,
        });
      validateApiResponse(response, "Failed to assign document roles");
      return response;
    },

    // FIX #7: specific success toast — was relying on DocumentTable to fire
    // toast manually after mutateAsync resolved. Centralising it here means
    // any future caller gets feedback automatically.
    onSuccess: () => {
      toast.success("Responsibilities assigned", {
        description: "Document roles have been updated successfully.",
      });
    },

    // FIX #7: specific error toast — was falling back to generic global
    // MutationCache.onError message which just shows error.message raw.
    onError: (error: Error) => {
      toast.error("Failed to assign responsibilities", {
        description: error.message ?? "An unexpected error occurred.",
        duration: 6000,
      });
    },

    // FIX #6: was onSuccess — onSettled fires whether mutation succeeds or
    // errors, so the cache is always revalidated. Critical once optimistic
    // updates are added; a failed mutation would otherwise leave stale data.
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: documentQueryKeys.all });
    },
  });
}

// ============================================
// Send Email Mutation
// ============================================
interface EmailResult {
  isSuccess: boolean;
  message?: string;
}

export function useSendDocumentEmail(): UseMutationResult<
  EmailResult,
  Error,
  EmailRequestDto
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: EmailRequestDto): Promise<EmailResult> => {
      const response = await customInstance<EmailResult>({
        url: "/api/ProjectDocuments/SendEmail",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: payload,
      });
      if (!response.isSuccess) {
        throw new Error(response.message ?? "Failed to send email");
      }
      return response;
    },

    // FIX #7: specific success toast
    onSuccess: () => {
      toast.success("Email sent", {
        description: "The document email has been sent successfully.",
      });
    },

    // FIX #7: specific error toast
    onError: (error: Error) => {
      toast.error("Failed to send email", {
        description: error.message ?? "An unexpected error occurred.",
        duration: 6000,
      });
    },

    // FIX #6: was onSuccess
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: documentQueryKeys.all });
    },
  });
}
