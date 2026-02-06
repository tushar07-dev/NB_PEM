import { useSidebar } from "@/shared/components/ui/sidebar";

export const DocumentChecklist = () => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  const dynamicGap = isExpanded ? "gap-2 lg:gap-4" : "gap-6";
  const dynamicPadding = isExpanded ? "p-2 lg:p-4" : "p-4 lg:p-6";
  return (
    <div
      className={`grid grid-cols-1 ${dynamicGap} ${dynamicPadding} transition-all duration-300 md:grid-cols-12`}
    >
      Tushar
    </div>
  );
};
