import { http, HttpResponse } from "msw";

/**
 * MSW handlers for API mocking in tests.
 * Based on actual API endpoints from Swagger spec.
 *
 * Mock scenario matrix — login as tushar.shelke@akersolutions.com to test:
 *
 *  S1  projectDocumentId=1  NOT_STARTED             Tushar=ORIGINATOR  → Define responsibilities dialog
 *  S2  projectDocumentId=2  PENDING_WITH_ORIGINATOR  Tushar=ORIGINATOR  → ✏️ Unlocked, progress, Send to Checker
 *  S3  projectDocumentId=3  PENDING_WITH_CHECKER     Tushar=ORIGINATOR  → 🔒 Locked (waiting for checker)
 *  S4  projectDocumentId=4  PENDING_WITH_APPROVER    Tushar=ORIGINATOR  → 🔒 Locked (waiting for approver)
 *  S5  projectDocumentId=5  REJECTED_BY_CHECKER      Tushar=ORIGINATOR  → ✏️ Unlocked, warning, resend
 *  S6  projectDocumentId=6  REJECTED_BY_APPROVER     Tushar=ORIGINATOR  → ✏️ Unlocked, warning, resend
 *  S7  projectDocumentId=7  COMPLETED                Tushar=ORIGINATOR  → 🔒 Locked, ✓ Released badge
 *  S8  projectDocumentId=8  PENDING_WITH_CHECKER     Tushar=CHECKER     → ✏️ Unlocked, Checker buttons
 *  S9  projectDocumentId=9  PENDING_WITH_APPROVER    Tushar=APPROVER    → ✏️ Unlocked, Approver buttons
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

  // ─── Project Documents ───────────────────────────────────────────────────
  http.post("*/api/ProjectDocuments/GetProjectDocuments", () =>
    HttpResponse.json({
      message: "Success",
      status: 200,
      data: {
        items: [
          // S1: No responsibilities assigned — row click opens Define dialog
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
          // S2: Originator's turn — fill checklist + send to checker
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
          // S3: Sent to checker — originator locked, info banner
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
          // S4: Sent to approver — originator locked, info banner
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
          // S8: Tushar IS the checker, status = PENDING_WITH_CHECKER
          // Tests: CheckerActions rendered, checkerSignature auto-saved,
          //        originatorSignature from Nilesh already filled
          {
            projectDocumentId: 8,
            documentName: "Fire & Gas Detection Layout",
            documentNo: "DOC-008",
            reasonForIssue: "IFC",
            revisionStatus: "OF",
            revision: "A",
            originator: "nilesh.thakur@akersolutions.com",
            checker: "tushar.shelke@akersolutions.com",
            approver: "sanghati.chatterjee2@akersolutions.com",
            progress: "IN_PROGRESS",
            workflowStatus: "PENDING_WITH_CHECKER",
          },
          // S9: Tushar IS the approver, status = PENDING_WITH_APPROVER
          // Tests: ApproverActions rendered (Reject + Approve & Release)
          {
            projectDocumentId: 9,
            documentName: "Safety Instrumented System Diagram",
            documentNo: "DOC-009",
            reasonForIssue: "IFA",
            revisionStatus: "AF",
            revision: "B",
            originator: "nilesh.thakur@akersolutions.com",
            checker: "sanghati.chatterjee2@akersolutions.com",
            approver: "tushar.shelke@akersolutions.com",
            progress: "COMPLETED",
            workflowStatus: "PENDING_WITH_APPROVER",
          },
        ],
        totalPages: 1,
        page: 1,
        pageSize: 10,
        total: 9,
      },
      errors: null,
    })
  ),

  // ─── Checklist items ─────────────────────────────────────────────────────
  // S8: originatorSignature pre-filled (Nilesh signed), checkerSignature null
  // S9: both signatures filled (checker already completed)
  // All others: blank items for originator to fill
  http.get(
    "*/api/ProjectDocumentChecklists/GetProjectDocumentChecklists/:id",
    ({ params }) => {
      const id = Number(params.id);

      // S9 — Approver view: all items signed by originator + checker
      if (id === 9) {
        return HttpResponse.json({
          message: "Success",
          status: 200,
          data: [
            {
              checkpointId: 901,
              checkpoint:
                "Verify all instruments listed in the cause & effect matrix",
              category: "Instrumentation",
              qualityLevel: ["Quality Level 1", "Quality Level 2"],
              checkResult: "OK",
              originatorSignature: "Nilesh Thakur|2025-03-01T08:00:00.000Z",
              checkerSignature: "Sanghati Chatterjee|2025-03-05T10:00:00.000Z",
            },
            {
              checkpointId: 902,
              checkpoint: "Confirm SIL rating matches risk assessment",
              category: "Safety",
              qualityLevel: ["Quality Level 2"],
              checkResult: "OK",
              originatorSignature: "Nilesh Thakur|2025-03-01T08:05:00.000Z",
              checkerSignature: "Sanghati Chatterjee|2025-03-05T10:05:00.000Z",
            },
            {
              checkpointId: 903,
              checkpoint: "Review proof test interval documentation",
              category: "Safety",
              qualityLevel: ["Quality Level 1"],
              checkResult: "NA",
              originatorSignature: "Nilesh Thakur|2025-03-01T08:10:00.000Z",
              checkerSignature: "Sanghati Chatterjee|2025-03-05T10:10:00.000Z",
            },
          ],
          errors: null,
        });
      }

      // S8 — Checker view: originator signed all, checker signatures empty
      if (id === 8) {
        return HttpResponse.json({
          message: "Success",
          status: 200,
          data: [
            {
              checkpointId: 801,
              checkpoint:
                "Confirm detector coverage zones match layout drawing",
              category: "Fire & Gas",
              qualityLevel: ["Quality Level 1", "Quality Level 2"],
              checkResult: "OK",
              originatorSignature: "Nilesh Thakur|2025-02-28T09:00:00.000Z",
              checkerSignature: null,
            },
            {
              checkpointId: 802,
              checkpoint: "Verify manual call point locations per escape route",
              category: "Fire & Gas",
              qualityLevel: ["Quality Level 1"],
              checkResult: "OK",
              originatorSignature: "Nilesh Thakur|2025-02-28T09:05:00.000Z",
              checkerSignature: null,
            },
            {
              checkpointId: 803,
              checkpoint: "Check cable routing avoids hazardous areas",
              category: "Electrical",
              qualityLevel: ["Quality Level 2"],
              checkResult: "NA",
              originatorSignature: "Nilesh Thakur|2025-02-28T09:10:00.000Z",
              checkerSignature: null,
            },
            {
              checkpointId: 804,
              checkpoint:
                "Confirm panel location is accessible for maintenance",
              category: "General",
              qualityLevel: [],
              checkResult: null,
              originatorSignature: null,
              checkerSignature: null,
            },
          ],
          errors: null,
        });
      }

      // Default — S1 through S7
      return HttpResponse.json({
        message: "Success",
        status: 200,
        data: [
          {
            checkpointId: 101,
            checkpoint: "All P&ID symbols conform to ISA-5.1 standard",
            category: "Documentation",
            qualityLevel: ["Quality Level 1", "Quality Level 2"],
            checkResult: null,
            originatorSignature: null,
            checkerSignature: null,
          },
          {
            checkpointId: 102,
            checkpoint: "Pipe classes correctly referenced on all lines",
            category: "Piping",
            qualityLevel: ["Quality Level 1"],
            checkResult: null,
            originatorSignature: null,
            checkerSignature: null,
          },
          {
            checkpointId: 103,
            checkpoint: "All control loops numbered sequentially",
            category: "Instrumentation",
            qualityLevel: ["Quality Level 2"],
            checkResult: null,
            originatorSignature: null,
            checkerSignature: null,
          },
          {
            checkpointId: 104,
            checkpoint: "Relief valve locations match cause & effect matrix",
            category: "Safety",
            qualityLevel: ["Quality Level 1", "Quality Level 2"],
            checkResult: null,
            originatorSignature: null,
            checkerSignature: null,
          },
          {
            checkpointId: 105,
            checkpoint: "Equipment nozzle numbers match equipment data sheets",
            category: "Equipment",
            qualityLevel: [],
            checkResult: null,
            originatorSignature: null,
            checkerSignature: null,
          },
        ],
        errors: null,
      });
    }
  ),

  // ─── SaveCheckResults ────────────────────────────────────────────────────
  http.post(
    "*/api/ProjectDocumentChecklists/SaveCheckResults",
    async ({ request }) => {
      const body = await request.json();
      console.log("[MSW] SaveCheckResults →", body);
      return HttpResponse.json({
        message: "Success",
        status: 200,
        data: { id: (body as { checkpointId: number }).checkpointId },
        errors: null,
      });
    }
  ),

  // ─── SetStatusAndComments ────────────────────────────────────────────────
  http.post(
    "*/api/ProjectDocuments/SetStatusAndComments",
    async ({ request }) => {
      const body = await request.json();
      console.log("[MSW] SetStatusAndComments →", body);
      return HttpResponse.json({
        message: "Success",
        status: 200,
        data: {
          projectDocumentId: (body as { projectDocumentId: number })
            .projectDocumentId,
        },
        errors: null,
      });
    }
  ),

  // ─── AssignProjectDocumentRoles ──────────────────────────────────────────
  http.post(
    "*/api/ProjectDocuments/AssignProjectDocumentRoles",
    async ({ request }) => {
      const body = await request.json();
      console.log("[MSW] AssignProjectDocumentRoles →", body);
      return HttpResponse.json({
        message: "Success",
        status: 200,
        data: {
          projectDocumentId: (body as { projectDocumentId: number })
            .projectDocumentId,
        },
        errors: null,
      });
    }
  ),

  // ─── SendEmail ───────────────────────────────────────────────────────────
  http.post("*/api/Email/Send", async ({ request }) => {
    const body = await request.json();
    console.log("[MSW] Email/Send →", body);
    return HttpResponse.json({
      message: "Success",
      status: 200,
      data: null,
      errors: null,
    });
  }),
];
