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
  // ── One document per workflowStatus — covers every UI scenario ──────────
  // Emails match ALL_USERS + ADMIN_EMAILS so role derivation works when
  // logged in as any of the 4 test accounts.
  http.post("*/api/ProjectDocuments/GetProjectDocuments", () =>
    HttpResponse.json({
      message: "Success",
      status: 200,
      data: {
        items: [
          // S1: No responsibilities assigned yet — row click opens Define dialog
          {
            projectDocumentId: 1,
            documentName: "Piping & Instrumentation Diagram",
            documentNo: "DOC-001",
            reasonForIssue: "IFC",
            revisionStatus: "OF",
            revision: "A",
            originator: null,
            checker: null,
            approver: null,
            progress: "NOT_STARTED",
            workflowStatus: "NOT_STARTED",
          },
          // S2: Originator's turn — can fill checklist + send to checker
          {
            projectDocumentId: 2,
            documentName: "Electrical Single Line Diagram",
            documentNo: "DOC-002",
            reasonForIssue: "IFA",
            revisionStatus: "AF",
            revision: "B",
            originator: "tushar.shelke@akersolutions.com",
            checker: "nilesh.thakur@akersolutions.com",
            approver: "sanghati.chatterjee2@akersolutions.com",
            progress: "IN_PROGRESS",
            workflowStatus: "PENDING_WITH_ORIGINATOR",
          },
          // S3: Checker's turn — originator locked, checker can accept/reject
          {
            projectDocumentId: 3,
            documentName: "Structural General Arrangement",
            documentNo: "DOC-003",
            reasonForIssue: "IFR",
            revisionStatus: "DR",
            revision: "C",
            originator: "tushar.shelke@akersolutions.com",
            checker: "nilesh.thakur@akersolutions.com",
            approver: "sanghati.chatterjee2@akersolutions.com",
            progress: "IN_PROGRESS",
            workflowStatus: "PENDING_WITH_CHECKER",
          },
          // S4: Approver's turn — checker locked, approver can approve/reject
          {
            projectDocumentId: 4,
            documentName: "HVAC Layout Drawing",
            documentNo: "DOC-004",
            reasonForIssue: "IFC",
            revisionStatus: "OF",
            revision: "A",
            originator: "tushar.shelke@akersolutions.com",
            checker: "nilesh.thakur@akersolutions.com",
            approver: "sanghati.chatterjee2@akersolutions.com",
            progress: "COMPLETED",
            workflowStatus: "PENDING_WITH_APPROVER",
          },
          // S5: Checker rejected — originator must fix and re-send
          {
            projectDocumentId: 5,
            documentName: "Mechanical Equipment Layout",
            documentNo: "DOC-005",
            reasonForIssue: "IFA",
            revisionStatus: "AF",
            revision: "B",
            originator: "tushar.shelke@akersolutions.com",
            checker: "nilesh.thakur@akersolutions.com",
            approver: "sanghati.chatterjee2@akersolutions.com",
            progress: "IN_PROGRESS",
            workflowStatus: "REJECTED_BY_CHECKER",
          },
          // S6: Approver rejected — originator must fix and re-send
          {
            projectDocumentId: 6,
            documentName: "Civil Foundation Plan",
            documentNo: "DOC-006",
            reasonForIssue: "IFR",
            revisionStatus: "DR",
            revision: "C",
            originator: "tushar.shelke@akersolutions.com",
            checker: "nilesh.thakur@akersolutions.com",
            approver: "sanghati.chatterjee2@akersolutions.com",
            progress: "IN_PROGRESS",
            workflowStatus: "REJECTED_BY_APPROVER",
          },
          // S7: Fully completed — locked for all roles, green badge shown
          {
            projectDocumentId: 7,
            documentName: "Instrument Hook-Up Drawing",
            documentNo: "DOC-007",
            reasonForIssue: "IFC",
            revisionStatus: "OF",
            revision: "A",
            originator: "tushar.shelke@akersolutions.com",
            checker: "nilesh.thakur@akersolutions.com",
            approver: "sanghati.chatterjee2@akersolutions.com",
            progress: "COMPLETED",
            workflowStatus: "COMPLETED",
          },
        ],
        totalPages: 1,
        page: 1,
        pageSize: 10,
        total: 7,
      },
      errors: null,
    })
  ),
];
