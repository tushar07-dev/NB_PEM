import { DataTable } from "@/shared/components/data-table/data-table";
import { useDataTable } from "@/shared/hooks/data-table/use-data-table";
import getClientTableColumns, { type Client } from "../columns/columns";
import { DataTableAdvancedToolbar } from "@/shared/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/shared/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/shared/components/data-table/data-table-sort-list";
import DataTableAddBtn from "@/shared/components/data-table/data-table-add-btn";
import { useMemo } from "react";

const CLIENT_TABLE_ID = "client-table-random-id";

const PlaygroundPage = () => {
  const columns = getClientTableColumns();
  const data = useMemo<Client[]>(
    () => [
      {
        id: "client-001",
        name: "Acme Holdings",
        description: "General contractor for HQ rebuild.",
        location: "New York, NY",
        createdDate: "2025-10-12T09:15:00.000Z",
        isActive: true,
        globalSearch: "Acme Holdings New York",
        expand: false,
        children: [
          {
            id: "client-001-a",
            name: "Acme - Safety",
            description: "Safety checklist rollout.",
            location: "New York, NY",
            createdDate: "2025-10-18T11:30:00.000Z",
            isActive: true,
            globalSearch: "Acme Safety New York",
            expand: false,
            children: [],
          },
        ],
      },
      {
        id: "client-002",
        name: "Bluewater Logistics",
        description: "Warehouse compliance audits.",
        location: "Seattle, WA",
        createdDate: "2025-09-01T13:05:00.000Z",
        isActive: true,
        globalSearch: "Bluewater Logistics Seattle",
        expand: false,
        children: [],
      },
      {
        id: "client-003",
        name: "Cedar Ridge Partners",
        description: "Equipment certification renewals.",
        location: "Denver, CO",
        createdDate: "2025-08-20T08:00:00.000Z",
        isActive: false,
        globalSearch: "Cedar Ridge Denver",
        expand: false,
        children: [],
      },
      {
        id: "client-004",
        name: "Delta Field Services",
        description: "Field safety documentation.",
        location: "Houston, TX",
        createdDate: "2025-07-03T16:20:00.000Z",
        isActive: true,
        globalSearch: "Delta Field Houston",
        expand: false,
        children: [],
      },
      {
        id: "client-005",
        name: "Evergreen Utilities",
        description: "Preventive maintenance tracking.",
        location: "Portland, OR",
        createdDate: "2025-06-11T10:45:00.000Z",
        isActive: true,
        globalSearch: "Evergreen Utilities Portland",
        expand: false,
        children: [],
      },
      {
        id: "client-006",
        name: "Fountainhead Labs",
        description: "Lab access compliance reviews.",
        location: "Boston, MA",
        createdDate: "2025-05-27T14:10:00.000Z",
        isActive: false,
        globalSearch: "Fountainhead Labs Boston",
        expand: false,
        children: [],
      },
      {
        id: "client-007",
        name: "Granite Peak Mining",
        description: "On-site inspection scheduling.",
        location: "Phoenix, AZ",
        createdDate: "2025-04-09T09:00:00.000Z",
        isActive: true,
        globalSearch: "Granite Peak Phoenix",
        expand: false,
        children: [],
      },
      {
        id: "client-008",
        name: "Harborline Shipping",
        description: "Dock safety readiness.",
        location: "Miami, FL",
        createdDate: "2025-03-18T17:25:00.000Z",
        isActive: true,
        globalSearch: "Harborline Shipping Miami",
        expand: false,
        children: [],
      },
      {
        id: "client-009",
        name: "Ironclad Manufacturing",
        description: "Machine safety assessments.",
        location: "Chicago, IL",
        createdDate: "2025-02-26T12:40:00.000Z",
        isActive: true,
        globalSearch: "Ironclad Manufacturing Chicago",
        expand: false,
        children: [],
      },
      {
        id: "client-010",
        name: "Juniper Facilities",
        description: "Checklist audits for campuses.",
        location: "Raleigh, NC",
        createdDate: "2025-02-05T15:00:00.000Z",
        isActive: false,
        globalSearch: "Juniper Facilities Raleigh",
        expand: false,
        children: [],
      },
      {
        id: "client-011",
        name: "Keystone Energy",
        description: "Compliance documentation support.",
        location: "Pittsburgh, PA",
        createdDate: "2025-01-19T08:30:00.000Z",
        isActive: true,
        globalSearch: "Keystone Energy Pittsburgh",
        expand: false,
        children: [],
      },
      {
        id: "client-012",
        name: "Lighthouse Retail",
        description: "Store safety walkthroughs.",
        location: "San Diego, CA",
        createdDate: "2025-01-04T13:55:00.000Z",
        isActive: true,
        globalSearch: "Lighthouse Retail San Diego",
        expand: false,
        children: [],
      },
      {
        id: "client-013",
        name: "Maple Ridge Hospital",
        description: "Clinical equipment certification.",
        location: "Nashville, TN",
        createdDate: "2024-12-21T10:10:00.000Z",
        isActive: false,
        globalSearch: "Maple Ridge Hospital Nashville",
        expand: false,
        children: [],
      },
      {
        id: "client-014",
        name: "Northstar Telecom",
        description: "Network upgrade safety plan.",
        location: "Minneapolis, MN",
        createdDate: "2024-12-07T11:20:00.000Z",
        isActive: true,
        globalSearch: "Northstar Telecom Minneapolis",
        expand: false,
        children: [],
      },
      {
        id: "client-015",
        name: "Oakline Foods",
        description: "Food plant checklist reviews.",
        location: "Columbus, OH",
        createdDate: "2024-11-19T09:35:00.000Z",
        isActive: true,
        globalSearch: "Oakline Foods Columbus",
        expand: false,
        children: [],
      },
      {
        id: "client-016",
        name: "Pioneer Fabrication",
        description: "Welding safety compliance.",
        location: "Tulsa, OK",
        createdDate: "2024-11-03T14:50:00.000Z",
        isActive: false,
        globalSearch: "Pioneer Fabrication Tulsa",
        expand: false,
        children: [],
      },
      {
        id: "client-017",
        name: "Quarry Hill Materials",
        description: "Hauling inspection records.",
        location: "Las Vegas, NV",
        createdDate: "2024-10-15T16:05:00.000Z",
        isActive: true,
        globalSearch: "Quarry Hill Materials Las Vegas",
        expand: false,
        children: [],
      },
      {
        id: "client-018",
        name: "Riverstone Health",
        description: "Clinic audit readiness.",
        location: "Charlotte, NC",
        createdDate: "2024-09-30T08:15:00.000Z",
        isActive: true,
        globalSearch: "Riverstone Health Charlotte",
        expand: false,
        children: [],
      },
      {
        id: "client-019",
        name: "Summit Aero",
        description: "Hangar safety checklist.",
        location: "Salt Lake City, UT",
        createdDate: "2024-09-10T12:25:00.000Z",
        isActive: false,
        globalSearch: "Summit Aero Salt Lake City",
        expand: false,
        children: [],
      },
      {
        id: "client-020",
        name: "Timberline Resorts",
        description: "Seasonal staff compliance.",
        location: "Boise, ID",
        createdDate: "2024-08-22T10:00:00.000Z",
        isActive: true,
        globalSearch: "Timberline Resorts Boise",
        expand: false,
        children: [
          {
            id: "client-020-a",
            name: "Timberline - Winter Ops",
            description: "Lift operations checklist.",
            location: "Boise, ID",
            createdDate: "2024-08-28T09:10:00.000Z",
            isActive: true,
            globalSearch: "Timberline Winter Ops Boise",
            expand: false,
            children: [],
          },
        ],
      },
    ],
    []
  );

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data,
    columns,
    tableid: CLIENT_TABLE_ID,
    pageCount: -1,
    getSubRows: (row) => row.children,
    initialState: {
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
  });

  console.log("table state:", table.getState());
  return (
    <div>
      <DataTable className="h-full" isLoading={false} table={table}>
        <DataTableAdvancedToolbar>
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <DataTableFilterList
              table={table}
              shallow={shallow}
              tableid={CLIENT_TABLE_ID}
              debounceMs={debounceMs}
              throttleMs={throttleMs}
              align="start"
              searchInput={{
                label: "Search Name",
                details: { id: "globalSearch" },
              }}
            />
            <DataTableSortList table={table} align="start" />
          </div>
          <div className="flex items-center gap-2">
            <DataTableAddBtn
              onClick={() => {
                // Handle add action
              }}
            />
          </div>
        </DataTableAdvancedToolbar>
      </DataTable>
    </div>
  );
};

export default PlaygroundPage;
