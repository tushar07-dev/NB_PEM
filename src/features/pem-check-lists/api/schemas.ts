// src/features/pem-check-lists/api/schemas.ts
import { z } from "zod";

/**
 * Generic API response wrapper schema
 */
const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    message: z.string(),
    status: z.number(),
    data: dataSchema,
    errors: z.record(z.string(), z.array(z.string())).optional().nullable(),
  });

/**
 * Dropdown item format (standardized for all selects)
 */
export const DropdownItemSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export type DropdownItem = z.infer<typeof DropdownItemSchema>;

// ============================================
// RAW API Response Schemas (from Swagger)
// ============================================

const ProjectDataSchema = z.object({
  projectID: z.string(),
  projectName: z.string(),
});

const DisciplineDataSchema = z.object({
  id: z.string(),
  disciplineName: z.string(),
});

const DocumentGroupDataSchema = z.object({
  id: z.string(),
  documentGroup: z.string(),
});

const DocumentTypeDataSchema = z.object({
  id: z.string(),
  documentType: z.string(),
});

const FacilityCodeDataSchema = z.object({
  id: z.string(),
  facilityCode: z.string(),
});

const SystemDataSchema = z.object({
  id: z.string(),
  system: z.string(),
});

const AreaDataSchema = z.object({
  id: z.string(),
  area: z.string(),
});

// ============================================
// Full API Response Schemas (with wrapper)
// ============================================

export const ProjectResponseSchema = ApiResponseSchema(
  z.array(ProjectDataSchema)
);
export const DisciplineResponseSchema = ApiResponseSchema(
  z.array(DisciplineDataSchema)
);
export const DocumentGroupResponseSchema = ApiResponseSchema(
  z.array(DocumentGroupDataSchema)
);
export const DocumentTypeResponseSchema = ApiResponseSchema(
  z.array(DocumentTypeDataSchema)
);
export const FacilityCodeResponseSchema = ApiResponseSchema(
  z.array(FacilityCodeDataSchema)
);
export const SystemResponseSchema = ApiResponseSchema(
  z.array(SystemDataSchema)
);
export const AreaResponseSchema = ApiResponseSchema(z.array(AreaDataSchema));

// ============================================
// Transform Functions (API → Dropdown Format)
// ============================================

export function transformProjects(
  data: z.infer<typeof ProjectDataSchema>[]
): DropdownItem[] {
  return data.map((item) => ({
    value: item.projectID,
    label: item.projectName,
  }));
}

export function transformDisciplines(
  data: z.infer<typeof DisciplineDataSchema>[]
): DropdownItem[] {
  return data.map((item) => ({
    value: item.id,
    label: item.disciplineName,
  }));
}

export function transformDocumentGroups(
  data: z.infer<typeof DocumentGroupDataSchema>[]
): DropdownItem[] {
  return data.map((item) => ({
    value: item.id,
    label: item.documentGroup,
  }));
}

export function transformDocumentTypes(
  data: z.infer<typeof DocumentTypeDataSchema>[]
): DropdownItem[] {
  return data.map((item) => ({
    value: item.id,
    label: item.documentType,
  }));
}

export function transformFacilityCodes(
  data: z.infer<typeof FacilityCodeDataSchema>[]
): DropdownItem[] {
  return data.map((item) => ({
    value: item.id,
    label: item.facilityCode,
  }));
}

export function transformSystems(
  data: z.infer<typeof SystemDataSchema>[]
): DropdownItem[] {
  return data.map((item) => ({
    value: item.id,
    label: item.system,
  }));
}

export function transformAreas(
  data: z.infer<typeof AreaDataSchema>[]
): DropdownItem[] {
  return data.map((item) => ({
    value: item.id,
    label: item.area,
  }));
}
