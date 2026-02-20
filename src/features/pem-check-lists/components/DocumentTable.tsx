import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/shared/components/data-table/data-table";
import { DataTableColumnHeader } from "@/shared/components/data-table/data-table-column-header";
import { DataTableAdvancedToolbar } from "@/shared/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/shared/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/shared/components/data-table/data-table-sort-list";
import { useDataTable } from "@/shared/hooks/data-table/use-data-table";
import { Button } from "@/shared/components/ui/button";
import { Clock, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

// Data type matching the design
export interface DocumentEntry {
  id: string;
  title: string;
  documentNo: string;
  reasonForIssue: string;
  revisionStatus: string;
  revision: number | null;
  originatorSelfCheck: string | null;
  checker: string | null;
  approver: string | null;
  progress: "Completed" | "Not Started" | "In-Progress";
}

const reasonForIssueOptions = [
  { label: "IFC", value: "IFC" },
  { label: "IFA", value: "IFA" },
  { label: "IFR", value: "IFR" },
];

const revisionStatusOptions = [
  { label: "OF", value: "OF" },
  { label: "AF", value: "AF" },
  { label: "DR", value: "DR" },
];

const progressOptions = [
  { label: "Completed", value: "Completed" },
  { label: "In-Progress", value: "In-Progress" },
  { label: "Not Started", value: "Not Started" },
];

// Sample data (move to props or API in real usage)
const sampleData: DocumentEntry[] = [
  // ... (same as your provided sampleData array)
  {
    id: "1",
    title: "P&ID - Cooling Water System",
    documentNo: "C143-AS-H-XC-00020-01",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: 14,
    originatorSelfCheck: "Xavier Fernandes",
    checker: null,
    approver: null,
    progress: "In-Progress",
  },
  {
    id: "2",
    title: "Electrical Layout - Substation",
    documentNo: "E210-EL-SB-00312-02",
    reasonForIssue: "IFA",
    revisionStatus: "AF",
    revision: 11,
    originatorSelfCheck: "Sophie Chen",
    checker: "Ava Chen",
    approver: "Anna Lee",
    progress: "Completed",
  },
  {
    id: "3",
    title: "HVAC Duct Routing Plan",
    documentNo: "H500-ME-DT-00981-03",
    reasonForIssue: "IFR",
    revisionStatus: "DR",
    revision: 13,
    originatorSelfCheck: "Liam O'Connor",
    checker: "Liam Rodriguez",
    approver: "James Park",
    progress: "Completed",
  },
  {
    id: "4",
    title: "Fire Protection Layout",
    documentNo: "FP320-FR-LT-00451-01",
    reasonForIssue: "IFA",
    revisionStatus: "AF",
    revision: 15,
    originatorSelfCheck: "Isabella Martinez",
    checker: "Maya Patel",
    approver: "Sofia Kim",
    progress: "Completed",
  },
  {
    id: "5",
    title: "Structural Foundation Plan",
    documentNo: "S100-ST-FN-00122-00",
    reasonForIssue: "IFR",
    revisionStatus: "DR",
    revision: null,
    originatorSelfCheck: null,
    checker: null,
    approver: null,
    progress: "Not Started",
  },
  {
    id: "6",
    title: "Pipe Rack Elevation",
    documentNo: "P210-PR-EL-00711-02",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: 9,
    originatorSelfCheck: "Emma Lee",
    checker: "Olivia Brown",
    approver: "Ava Davis",
    progress: "In-Progress",
  },
  {
    id: "7",
    title: "Instrumentation Loop Diagram",
    documentNo: "I450-IN-LP-00289-04",
    reasonForIssue: "IFA",
    revisionStatus: "AF",
    revision: 6,
    originatorSelfCheck: "Lucas Johnson",
    checker: "Lucas Davis",
    approver: "Noah Wilson",
    progress: "In-Progress",
  },
  {
    id: "8",
    title: "Control Panel Wiring Diagram",
    documentNo: "C780-CP-WD-00567-03",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: 19,
    originatorSelfCheck: "Mia Rodriguez",
    checker: "Isabella Martinez",
    approver: "Olivia Smith",
    progress: "In-Progress",
  },
  {
    id: "9",
    title: "Drainage Layout Plan",
    documentNo: "D300-DR-LT-00812-01",
    reasonForIssue: "IFR",
    revisionStatus: "DR",
    revision: 18,
    originatorSelfCheck: "Oliver Scott",
    checker: "James Johnson",
    approver: "Ethan Garcia",
    progress: "In-Progress",
  },
  {
    id: "10",
    title: "Cable Tray Routing",
    documentNo: "E550-CT-RT-00345-02",
    reasonForIssue: "IFA",
    revisionStatus: "AF",
    revision: 20,
    originatorSelfCheck: "Emma Lee",
    checker: "Olivia Brown",
    approver: "Ava Davis",
    progress: "In-Progress",
  },
  {
    id: "11",
    title: "Pump General Arrangement",
    documentNo: "M600-PU-GA-00189-05",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: 17,
    originatorSelfCheck: "Lucas Johnson",
    checker: "Lucas Davis",
    approver: "Noah Wilson",
    progress: "In-Progress",
  },
  {
    id: "12",
    title: "Tank Fabrication Drawing",
    documentNo: "M710-TK-FB-00911-02",
    reasonForIssue: "IFR",
    revisionStatus: "DR",
    revision: 12,
    originatorSelfCheck: "Zoe Williams",
    checker: "Emma Wilson",
    approver: "Isabella Martinez",
    progress: "In-Progress",
  },
  {
    id: "13",
    title: "Transformer Layout Plan",
    documentNo: "E900-TR-LT-00221-01",
    reasonForIssue: "IFA",
    revisionStatus: "AF",
    revision: 16,
    originatorSelfCheck: "Ethan Brown",
    checker: "Sophia Lee",
    approver: "Mia Chen",
    progress: "Completed",
  },
  {
    id: "14",
    title: "Access Platform Details",
    documentNo: "S410-AP-DT-00777-03",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: 21,
    originatorSelfCheck: "Noah Garcia",
    checker: "Ava Wilson",
    approver: "Lucas Brown",
    progress: "Not Started",
  },
  {
    id: "15",
    title: "Emergency Exit Layout",
    documentNo: "AR220-EE-LT-00519-02",
    reasonForIssue: "IFA",
    revisionStatus: "AF",
    revision: 22,
    originatorSelfCheck: "Sophia Davis",
    checker: "Oliver Chen",
    approver: "Emma Park",
    progress: "In-Progress",
  },
  {
    id: "16",
    title: "Compressor Piping Layout",
    documentNo: "M320-CP-PL-00634-01",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: 8,
    originatorSelfCheck: "Aiden Clark",
    checker: "Sophie Turner",
    approver: "James Hall",
    progress: "In-Progress",
  },
  {
    id: "17",
    title: "Grounding & Earthing Layout",
    documentNo: "E430-GE-LT-00743-02",
    reasonForIssue: "IFR",
    revisionStatus: "DR",
    revision: null,
    originatorSelfCheck: null,
    checker: null,
    approver: null,
    progress: "Not Started",
  },
  {
    id: "18",
    title: "Flare Stack General Arrangement",
    documentNo: "P540-FS-GA-00328-03",
    reasonForIssue: "IFA",
    revisionStatus: "AF",
    revision: 10,
    originatorSelfCheck: "Charlotte Evans",
    checker: "Benjamin Moore",
    approver: "Grace Taylor",
    progress: "Completed",
  },
  {
    id: "19",
    title: "Substation Single Line Diagram",
    documentNo: "E670-SS-SL-00892-01",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: 5,
    originatorSelfCheck: "Mason White",
    checker: "Harper Scott",
    approver: "Elijah Adams",
    progress: "In-Progress",
  },
  {
    id: "20",
    title: "Cooling Tower Layout Plan",
    documentNo: "M190-CT-LT-00415-04",
    reasonForIssue: "IFR",
    revisionStatus: "DR",
    revision: 7,
    originatorSelfCheck: "Amelia Harris",
    checker: "Logan Nelson",
    approver: "Chloe Carter",
    progress: "In-Progress",
  },
  {
    id: "21",
    title: "Vessel Nozzle Orientation",
    documentNo: "M820-VN-OR-00556-02",
    reasonForIssue: "IFA",
    revisionStatus: "AF",
    revision: 13,
    originatorSelfCheck: "Henry Mitchell",
    checker: "Zoe Perez",
    approver: "Samuel Roberts",
    progress: "Completed",
  },
  {
    id: "22",
    title: "HVAC Mechanical Room Layout",
    documentNo: "H310-MR-LT-00667-01",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: null,
    originatorSelfCheck: null,
    checker: null,
    approver: null,
    progress: "Not Started",
  },
  {
    id: "23",
    title: "Lighting Layout - Production Area",
    documentNo: "E780-LT-PA-00134-03",
    reasonForIssue: "IFR",
    revisionStatus: "DR",
    revision: 3,
    originatorSelfCheck: "Ella Thompson",
    checker: "William Jackson",
    approver: "Victoria Lewis",
    progress: "In-Progress",
  },
  {
    id: "24",
    title: "Sewage Treatment Plant Layout",
    documentNo: "C260-ST-PL-00988-02",
    reasonForIssue: "IFA",
    revisionStatus: "AF",
    revision: 11,
    originatorSelfCheck: "Jack Walker",
    checker: "Nora Young",
    approver: "Daniel King",
    progress: "Completed",
  },
  {
    id: "25",
    title: "Blower Skid Arrangement",
    documentNo: "M470-BS-AR-00372-01",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: 6,
    originatorSelfCheck: "Penelope Hall",
    checker: "Sebastian Wright",
    approver: "Aurora Green",
    progress: "In-Progress",
  },
  {
    id: "26",
    title: "Chemical Dosing System P&ID",
    documentNo: "C590-CD-PI-00241-04",
    reasonForIssue: "IFR",
    revisionStatus: "DR",
    revision: 9,
    originatorSelfCheck: "Isaac Allen",
    checker: "Lily Baker",
    approver: "Ryan Hill",
    progress: "In-Progress",
  },
  {
    id: "27",
    title: "Steam Distribution Layout",
    documentNo: "M640-SD-LT-00819-02",
    reasonForIssue: "IFA",
    revisionStatus: "AF",
    revision: 14,
    originatorSelfCheck: "Layla Sanchez",
    checker: "Gabriel Rivera",
    approver: "Stella Cooper",
    progress: "Completed",
  },
  {
    id: "28",
    title: "MCC Room Layout Plan",
    documentNo: "E390-MC-LT-00473-03",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: 18,
    originatorSelfCheck: "Owen Bailey",
    checker: "Madison Cox",
    approver: "Carter Nguyen",
    progress: "In-Progress",
  },
  {
    id: "29",
    title: "Structural Steel Column Layout",
    documentNo: "S230-SC-LT-00688-01",
    reasonForIssue: "IFR",
    revisionStatus: "DR",
    revision: null,
    originatorSelfCheck: null,
    checker: null,
    approver: null,
    progress: "Not Started",
  },
  {
    id: "30",
    title: "Fire & Gas Detector Layout",
    documentNo: "FP410-FG-DT-00526-02",
    reasonForIssue: "IFA",
    revisionStatus: "AF",
    revision: 4,
    originatorSelfCheck: "Scarlett Reed",
    checker: "Julian Morgan",
    approver: "Luna Flores",
    progress: "Completed",
  },
  {
    id: "31",
    title: "Heat Exchanger Data Sheet",
    documentNo: "M730-HE-DS-00155-05",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: 16,
    originatorSelfCheck: "Wyatt Butler",
    checker: "Paisley Simmons",
    approver: "Dominic Foster",
    progress: "In-Progress",
  },
  {
    id: "32",
    title: "Instrument Cable Schedule",
    documentNo: "I560-IC-SC-00793-01",
    reasonForIssue: "IFR",
    revisionStatus: "DR",
    revision: 2,
    originatorSelfCheck: "Violet Long",
    checker: "Ezra Peterson",
    approver: "Hazel Hughes",
    progress: "In-Progress",
  },
  {
    id: "33",
    title: "Compressed Air System Layout",
    documentNo: "M850-CA-LT-00362-03",
    reasonForIssue: "IFA",
    revisionStatus: "AF",
    revision: 20,
    originatorSelfCheck: "Miles Ward",
    checker: "Nora Coleman",
    approver: "Eliana Ross",
    progress: "Completed",
  },
  {
    id: "34",
    title: "Effluent Treatment Plant P&ID",
    documentNo: "C970-ET-PI-00947-02",
    reasonForIssue: "IFC",
    revisionStatus: "OF",
    revision: 7,
    originatorSelfCheck: "Jasper Price",
    checker: "Arabella Diaz",
    approver: "Rowan Jenkins",
    progress: "In-Progress",
  },
];

export function DocumentTable() {
  const [selectedRow, setSelectedRow] = useState<DocumentEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleRevHistoryClick = useCallback((row: DocumentEntry) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  }, []);

  const handleRowClick = useCallback(
    (row: DocumentEntry) => {
      navigate("/pem-checklists/control-object-checklist", {
        state: { document: row },
      });
    },
    [navigate]
  );

  const columns = useMemo<ColumnDef<DocumentEntry>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        meta: {
          label: "Title",
          placeholder: "Search title...",
          variant: "text",
        },
      },
      {
        accessorKey: "documentNo",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Document No" />
        ),
        meta: {
          label: "Document No",
          placeholder: "Search document no...",
          variant: "text",
        },
      },
      {
        accessorKey: "reasonForIssue",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Reason For Issue" />
        ),
        meta: {
          label: "Reason For Issue",
          variant: "multiSelect",
          options: reasonForIssueOptions,
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "revisionStatus",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Revision Status" />
        ),
        meta: {
          label: "Revision Status",
          variant: "multiSelect",
          options: revisionStatusOptions,
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "revision",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Revision" />
        ),
        cell: ({ row }) => {
          const value = row.getValue("revision") as number | null;
          return <span>{value !== null ? value : "-"}</span>;
        },
        meta: {
          label: "Revision",
          variant: "number",
        },
      },
      {
        accessorKey: "originatorSelfCheck",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            label="Originator(Self Check)"
          />
        ),
        cell: ({ row }) => {
          const value = row.getValue("originatorSelfCheck") as string | null;
          return <span>{value ?? "-"}</span>;
        },
        meta: {
          label: "Originator(Self Check)",
          placeholder: "Search originator...",
          variant: "text",
        },
      },
      {
        accessorKey: "checker",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Checker" />
        ),
        cell: ({ row }) => {
          const value = row.getValue("checker") as string | null;
          return <span>{value ?? "-"}</span>;
        },
        meta: {
          label: "Checker",
          placeholder: "Search checker...",
          variant: "text",
        },
      },
      {
        accessorKey: "approver",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Approver" />
        ),
        cell: ({ row }) => {
          const value = row.getValue("approver") as string | null;
          return <span>{value ?? "-"}</span>;
        },
        meta: {
          label: "Approver",
          placeholder: "Search approver...",
          variant: "text",
        },
      },
      {
        accessorKey: "progress",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Progress" />
        ),
        cell: ({ row }) => {
          const progress = row.getValue("progress") as string;
          return (
            <span
              className={`text-sm ${
                progress === "Completed"
                  ? "status-completed"
                  : progress === "Not Started"
                    ? "status-not-started"
                    : "status-in-progress"
              }`}
            >
              {progress}
            </span>
          );
        },
        meta: {
          label: "Progress",
          variant: "multiSelect",
          options: progressOptions,
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        id: "revHistory",
        header: () => <span className="">Rev History</span>,
        cell: ({ row }) => (
          <button
            className="icon-btn-dark-blue"
            onClick={(e) => {
              e.stopPropagation();
              handleRevHistoryClick(row.original);
            }}
          >
            <Clock className="h-4 w-4" />
          </button>
        ),
        enableSorting: false,
        enableHiding: false,
        enableColumnFilter: false,
      },
    ],
    [handleRevHistoryClick]
  );

  const { table } = useDataTable({
    data: sampleData,
    columns,
    pageCount: Math.ceil(sampleData.length / 10),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  });

  return (
    <div className="">
      <DataTable
        table={table}
        actionBar={<div>Action Bar</div>}
        onRowClick={handleRowClick}
      >
        <DataTableAdvancedToolbar table={table}>
          <DataTableFilterList table={table} />
          <DataTableSortList table={table} />
        </DataTableAdvancedToolbar>
      </DataTable>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {isModalOpen && (
          <DialogContent className="m-0 h-screen w-screen max-w-none rounded-none p-0">
            <div className="flex h-full flex-col">
              <DialogHeader className="flex flex-row items-center justify-between border-b p-6">
                <DialogTitle className="text-2xl font-bold">
                  Revision History - {selectedRow?.documentNo}
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </DialogHeader>
              <div className="flex-1 overflow-auto p-6">
                {selectedRow && (
                  <div className="space-y-6">
                    <div className="bg-muted/50 rounded-lg p-6">
                      <h3 className="mb-4 text-lg font-semibold">
                        Document Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div>
                          <p className="text-muted-foreground text-sm">Title</p>
                          <p className="font-medium">{selectedRow.title}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Document No
                          </p>
                          <p className="font-medium">
                            {selectedRow.documentNo}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Reason For Issue
                          </p>
                          <p className="font-medium">
                            {selectedRow.reasonForIssue}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Revision Status
                          </p>
                          <p className="font-medium">
                            {selectedRow.revisionStatus}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-6">
                      <h3 className="mb-4 text-lg font-semibold">
                        Current Revision Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Revision
                          </p>
                          <p className="font-medium">
                            {selectedRow.revision ?? "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Originator (Self Check)
                          </p>
                          <p className="font-medium">
                            {selectedRow.originatorSelfCheck ?? "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Checker
                          </p>
                          <p className="font-medium">
                            {selectedRow.checker ?? "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Approver
                          </p>
                          <p className="font-medium">
                            {selectedRow.approver ?? "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Progress
                          </p>
                          <p
                            className={`font-medium ${selectedRow.progress === "Completed" ? "status-completed" : selectedRow.progress === "Not Started" ? "status-not-started" : "status-in-progress"}`}
                          >
                            {selectedRow.progress}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-6">
                      <h3 className="mb-4 text-lg font-semibold">
                        Revision Timeline
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-2 h-2 w-2 rounded-full bg-green-500" />
                          <div>
                            <p className="font-medium">
                              Current Revision {selectedRow.revision ?? "N/A"}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              Latest version
                            </p>
                          </div>
                        </div>
                        {selectedRow.revision && selectedRow.revision > 1 && (
                          <div className="flex items-start gap-4">
                            <div className="mt-2 h-2 w-2 rounded-full bg-gray-400" />
                            <div>
                              <p className="font-medium">
                                Revision {selectedRow.revision - 1}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                Previous version
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
