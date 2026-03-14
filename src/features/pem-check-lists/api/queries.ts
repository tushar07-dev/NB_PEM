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
  SaveCheckResultsRequestDto,
  SaveCheckResultsResponseDtoApiResponse,
  SetStatusAndCommentsRequestDto,
  SetStatusAndCommentsResponseDtoApiResponse,
  ProjectDocumentChecklistsResponseDtoListApiResponse,
} from "@/api/generated/schemas";
import type { ChecklistItem, CheckResult } from "../types/checklist";
import { validateApiResponse } from "@/api/utils";

const TEST_MODE = false;

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
          url: "/api/GenericPEM/GetGenericPEM/1",
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
      if (TEST_MODE) {
        console.log(
          "🚫 TEST_MODE: AssignProjectDocumentRoles blocked",
          payload
        );

        return {
          isSuccess: true,
          message: "Mock success (TEST_MODE)",
          data: undefined,
        } as AssignProjectDocumentRolesResponseDtoApiResponse;
      }
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
      if (TEST_MODE) {
        console.log("🚫 TEST_MODE: SendEmail blocked", payload);
        return {
          isSuccess: true,
          message: "Mock email sent (TEST_MODE)",
        } as EmailResult;
      }
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

// ============================================

// Checklist Items Query

// GET /api/ProjectDocumentChecklists/GetProjectDocumentChecklists/{projectDocumentId}

function normalizeCheckResult(raw: string | null | undefined): CheckResult {
  if (raw === "OK") return "OK";
  if (raw === "NA") return "NA";
  return null;
}

export function useChecklistItems(
  projectDocumentId: number | null,
  enabled = true
): UseQueryResult<ChecklistItem[], Error> {
  return useQuery({
    queryKey: ["checklistItems", projectDocumentId],
    queryFn: async (): Promise<ChecklistItem[]> => {
      const response =
        await customInstance<ProjectDocumentChecklistsResponseDtoListApiResponse>(
          {
            url: `/api/ProjectDocumentChecklists/GetProjectDocumentChecklists/${projectDocumentId!}`,
            method: "GET",
          }
        );
      validateApiResponse(response, "Failed to fetch checklist items");
      return (response.data ?? []).map((item, i) => ({
        id: String(item.checkpointId ?? i),
        serialNo: i + 1,
        checkpointId: item.checkpointId ?? 0,
        description: item.checkpoint ?? "",
        category: item.category ?? "",
        qualityLevel: item.qualityLevel ?? [],
        checkResult: normalizeCheckResult(item.checkResult),
        originatorSignature: item.originatorSignature ?? null,
        checkerSignature: item.checkerSignature ?? null,
      }));
    },
    enabled: enabled && projectDocumentId != null && projectDocumentId > 0,
    staleTime: 2 * 60 * 1000,
  });
}
// ============================================
// Save Check Result Mutation
// POST /api/ProjectDocumentChecklists/SaveCheckResults// ============================================

export interface SaveCheckResultPayload {
  checkpointId: number;
  checkResult: CheckResult;
  originatorSignature: string | null;
  checkerSignature: string | null;
}

export function useSaveCheckResult(
  projectDocumentId: number | null
): UseMutationResult<void, Error, SaveCheckResultPayload> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SaveCheckResultPayload): Promise<void> => {
      // 🚫 Block API in TEST_MODE
      // if (TEST_MODE) {
      //   console.log("🚫 TEST_MODE: SaveCheckResults blocked", payload);
      //   return; // return void
      // }
      const response =
        await customInstance<SaveCheckResultsResponseDtoApiResponse>({
          url: "/api/ProjectDocumentChecklists/SaveCheckResults",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          data: {
            checkpointId: payload.checkpointId,
            checkResult: payload.checkResult,
            originatorSignature: payload.originatorSignature,
            checkerSignature: payload.checkerSignature,
          } satisfies SaveCheckResultsRequestDto,
        });
      validateApiResponse(response, "Failed to save check result");
    },
    retry: (failureCount, error) => {
      const status = (error as { status?: number })?.status;
      if (status && status >= 400) return false;
      return failureCount < 2;
    },

    // Only invalidate on success, not on every failure
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["checklistItems", projectDocumentId],
      });
    },
    // auto-save silent retry
  });
}

// ============================================
// Set Status And Comments Mutation
// POST /api/ProjectDocuments/SetStatusAndComments
// ============================================

export interface SetStatusAndCommentsPayload {
  projectDocumentId: number;
  workflowStatus: string | null;
  comments: string | null;
}

export function useSetStatusAndComments(): UseMutationResult<
  void,
  Error,
  SetStatusAndCommentsPayload
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SetStatusAndCommentsPayload): Promise<void> => {
      const response =
        await customInstance<SetStatusAndCommentsResponseDtoApiResponse>({
          url: "/api/ProjectDocuments/SetStatusAndComments",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          data: {
            projectDocumentId: payload.projectDocumentId,
            workflowStatus: payload.workflowStatus,
            comments: payload.comments,
          } satisfies SetStatusAndCommentsRequestDto,
        });
      validateApiResponse(response, "Failed to update document status");
    },
    onSuccess: () => {
      toast.success("Status updated", {
        description: "Document workflow status has been updated.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to update status", {
        description: error.message ?? "An unexpected error occurred.",
        duration: 6000,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: documentQueryKeys.all });
    },
    retry: (failureCount, error) => {
      const status = (error as { status?: number })?.status;
      if (status && status >= 400) return false;
      return failureCount < 2;
    },
  });
}
