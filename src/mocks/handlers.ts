import { http, HttpResponse } from "msw";

/**
 * MSW handlers for API mocking in tests.
 * Based on actual API endpoints from Swagger spec.
 */
export const handlers = [
  // Project API
  http.get("*/api/Project/GetProjects", () =>
    HttpResponse.json({
      message: "Success",
      status: 200,
      data: [
        { projectID: "1", projectName: "Project Alpha", pemID: 1 },
        { projectID: "2", projectName: "Project Beta", pemID: 2 },
      ],
      errors: null,
    })
  ),

  // Discipline API
  http.get("*/api/Discipline/GetDisciplines", () =>
    HttpResponse.json({
      message: "Success",
      status: 200,
      data: [
        { id: "1", disciplineName: "Electrical" },
        { id: "2", disciplineName: "Mechanical" },
      ],
      errors: null,
    })
  ),

  // Document Group API
  http.get("*/api/Document/GetDocumentGroup", () =>
    HttpResponse.json({
      message: "Success",
      status: 200,
      data: [
        { id: "1", documentGroup: "Engineering" },
        { id: "2", documentGroup: "Construction" },
      ],
      errors: null,
    })
  ),

  // Document Type API
  http.get("*/api/Document/GetDocumentType/:documentGroup", () =>
    HttpResponse.json({
      message: "Success",
      status: 200,
      data: [
        { id: "1", documentType: "Drawing" },
        { id: "2", documentType: "Specification" },
      ],
      errors: null,
    })
  ),

  // Common Document APIs
  http.get("*/api/CommonDocument/GetFacilityCode", () =>
    HttpResponse.json({
      message: "Success",
      status: 200,
      data: [
        { id: "1", facilityCode: "FAC-001" },
        { id: "2", facilityCode: "FAC-002" },
      ],
      errors: null,
    })
  ),

  http.get("*/api/CommonDocument/GetSystem", () =>
    HttpResponse.json({
      message: "Success",
      status: 200,
      data: [
        { id: "1", system: "HVAC" },
        { id: "2", system: "Electrical" },
      ],
      errors: null,
    })
  ),

  http.get("*/api/CommonDocument/GetArea", () =>
    HttpResponse.json({
      message: "Success",
      status: 200,
      data: [
        { id: "1", area: "Area A" },
        { id: "2", area: "Area B" },
      ],
      errors: null,
    })
  ),

  // Generic PEM API
  http.get("*/api/GenericPEM/GetGenericPEM", () =>
    HttpResponse.json({
      message: "Success",
      status: 200,
      data: [{ pemName: "PEM Standard" }, { pemName: "PEM Custom" }],
      errors: null,
    })
  ),

  // Project Documents API (POST with pagination)
  http.post("*/api/ProjectDocuments/GetProjectDocuments", () =>
    HttpResponse.json({
      message: "Success",
      status: 200,
      data: {
        items: [
          {
            documentName: "Test Document",
            documentNo: "DOC-001",
            reasonForIssue: "Initial Issue",
            revisionStatus: "Draft",
            revision: "A",
            originator: "John Doe",
            checker: "Jane Smith",
            approver: "Bob Wilson",
            progress: "50%",
            projectId: 1,
            disciplineId: 1,
            documentTypeId: 1,
          },
        ],
        totalPages: 1,
        page: 1,
        pageSize: 10,
        total: 1,
      },
      errors: null,
    })
  ),
];
