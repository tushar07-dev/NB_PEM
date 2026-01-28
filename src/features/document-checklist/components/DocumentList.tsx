import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { DocumentSearchBar } from "./DocumentList/DocumentSearchBar";
import { DocumentListHeader } from "./DocumentList/DocumentListHeader";
import { DocumentListItem } from "./DocumentList/DocumentListItem";
import { useSidebar } from "@/shared/components/ui/sidebar";
import { cn } from "@/shared/lib/utils";

// Types for our document items
interface Document {
  id: string;
  title: string;
  code: string;
  status?: "Started" | "Completed";
  isActive?: boolean;
}

export const DocumentList = () => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

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
    <div
      className={cn(
        "doc-list-container rounded-2xl",
        isExpanded ? "p-3" : "p-5"
      )}
    >
      <DocumentListHeader title="Document List" />

      <div className="mt-2">
        <DocumentSearchBar />
      </div>

      <ScrollArea className="-mx-1 mt-2 flex-1 border-t border-slate-100 pt-2">
        <div className={cn("flex flex-col", isExpanded ? "gap-1" : "gap-2")}>
          {documents.map((doc) => (
            <DocumentListItem key={doc.id} doc={doc} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
