// src/api/endpoints.ts

/**
 * API Endpoints Configuration
 * Centralized source of truth for all API routes
 */
export const API_ENDPOINTS = {
  // Project endpoints
  project: {
    getAll: "/api/Project/GetProjects",
  },

  // Discipline endpoints
  discipline: {
    getByProject: (projectId: string) =>
      `/api/Discipline/GetDisciplines/${projectId}`,
  },

  // Document endpoints
  document: {
    getGroup: (disciplineId: string) =>
      `/api/Document/GetDocumentGroup/${disciplineId}`,
    getType: (disciplineId: string) =>
      `/api/Document/GetDocumentType/${disciplineId}`,
  },

  // Common Document endpoints
  common: {
    getFacilityCode: (disciplineId: string) =>
      `/api/CommonDocument/GetFacilityCode/${disciplineId}`,
    getSystem: (disciplineId: string) =>
      `/api/CommonDocument/GetSystem/${disciplineId}`,
    getArea: (disciplineId: string) =>
      `/api/CommonDocument/GetArea/${disciplineId}`,
  },
} as const;
