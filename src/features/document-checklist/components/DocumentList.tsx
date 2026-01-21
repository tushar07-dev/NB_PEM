import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Badge } from "@/shared/components/ui/badge";
import { FileText } from "lucide-react";

// Types for our document items
interface Document {
  id: string;
  title: string;
  code: string;
  status?: "Started" | "Completed";
  isActive?: boolean;
}

export const DocumentList = () => {
  // Example data based on the image
  const documents: Document[] = [
    {
      id: "1",
      title: "Drawing for P&ID",
      code: "C143-AS-H-XC-00020-01 • IFC • Rev 01 • OF",
      status: "Started",
      isActive: true,
    },
    {
      id: "2",
      title: "Drawing for P&ID",
      code: "C143-AS-H-XC-00021-02 • IFC • Rev 01 • OF",
      status: "Completed",
    },
    {
      id: "3",
      title: "Drawing for P&ID",
      code: "C143-AS-H-XC-00022-03 • IFC • Rev 01 • OF",
    },
    // ... add more items
  ];

  return (
    <div className="flex h-full flex-col rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-700">
        Document List
      </h3>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search..."
          className="h-9 border-none bg-slate-50 pl-10 text-xs"
        />
      </div>

      {/* Scrollable List Area */}
      <ScrollArea className="-mx-2 flex-1 px-2">
        <div className="space-y-1">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`flex cursor-pointer items-start gap-3 rounded-md p-3 transition-colors ${
                doc.isActive ? "bg-slate-200" : "hover:bg-slate-50"
              }`}
            >
              <FileText className="mt-1 h-5 w-5 shrink-0 text-slate-500" />

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {doc.title}
                  </p>
                  {doc.status && (
                    <Badge
                      variant="secondary"
                      className={`h-5 px-1.5 py-0 text-[10px] font-medium ${
                        doc.status === "Started"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {doc.status}
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-[10px] leading-tight text-slate-500">
                  {doc.code}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
