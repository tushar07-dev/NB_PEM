// src/features/pem-checklists/components/DocumentTable.tsx
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import type { DocumentRecord } from "../../types/document";

interface DocumentTableProps {
  documents: DocumentRecord[];
}

type SortField = keyof DocumentRecord | null;
type SortDirection = "asc" | "desc" | null;

export function DocumentTable({ documents }: DocumentTableProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction or reset
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedDocuments = [...documents].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === "-" || !aValue) return 1;
    if (bValue === "-" || !bValue) return -1;

    const comparison = aValue > bValue ? 1 : -1;
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const getStatusBadge = (status: DocumentRecord["status"]) => {
    switch (status) {
      case "In Progress":
        return (
          <Badge
            variant="outline"
            className="border-amber-500 bg-amber-50 text-amber-700"
          >
            In Progress
          </Badge>
        );
      case "Completed":
        return (
          <Badge
            variant="outline"
            className="border-green-500 bg-green-50 text-green-700"
          >
            Completed
          </Badge>
        );
      case "Not Started":
        return (
          <Badge
            variant="outline"
            className="border-gray-500 bg-gray-50 text-gray-700"
          >
            Not Started
          </Badge>
        );
      default:
        return null;
    }
  };

  const SortButton = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="-ml-3 h-8 gap-1 text-xs font-medium whitespace-nowrap text-gray-700"
    >
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </Button>
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50">
              <TableHead className="font-medium text-gray-700">
                <SortButton field="title" label="Title" />
              </TableHead>
              <TableHead className="font-medium text-gray-700">
                <SortButton field="documentNo" label="Document No" />
              </TableHead>
              <TableHead className="font-medium text-gray-700">
                <SortButton field="reasonForIssue" label="Reason For Issue" />
              </TableHead>
              <TableHead className="font-medium text-gray-700">
                <SortButton field="revisionStatus" label="Revision Status" />
              </TableHead>
              <TableHead className="font-medium text-gray-700">
                <SortButton field="revision" label="Revision" />
              </TableHead>
              <TableHead className="font-medium text-gray-700">
                <SortButton field="originator" label="Originator(Self Check)" />
              </TableHead>
              <TableHead className="font-medium text-gray-700">
                <SortButton field="checker" label="Checker" />
              </TableHead>
              <TableHead className="font-medium text-gray-700">
                <SortButton field="approver" label="Approver" />
              </TableHead>
              <TableHead className="font-medium text-gray-700">
                <SortButton field="status" label="Status" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDocuments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-24 text-center text-gray-500"
                >
                  No documents found
                </TableCell>
              </TableRow>
            ) : (
              sortedDocuments.map((doc) => (
                <TableRow
                  key={doc.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <TableCell className="font-medium text-gray-900">
                    {doc.title}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {doc.documentNo}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {doc.reasonForIssue}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {doc.revisionStatus}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {doc.revision}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {doc.originator}
                  </TableCell>
                  <TableCell className="text-gray-600">{doc.checker}</TableCell>
                  <TableCell className="text-gray-600">
                    {doc.approver}
                  </TableCell>
                  <TableCell>{getStatusBadge(doc.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
