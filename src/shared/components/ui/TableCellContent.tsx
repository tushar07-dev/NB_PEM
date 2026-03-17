// import * as React from "react";
// import { useRef, useState, useEffect } from "react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/shared/components/ui/tooltip";
// import { cn } from "@/shared/lib/utils";

// export default function TableCellContent({
//   className,
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) {
//   const ref = useRef<HTMLSpanElement>(null);
//   const [isTruncated, setIsTruncated] = useState(false);

//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;

//     // Check on mount
//     setIsTruncated(el.scrollWidth > el.clientWidth);

//     // Re-check on resize
//     const observer = new ResizeObserver(() => {
//       setIsTruncated(el.scrollWidth > el.clientWidth);
//     });
//     observer.observe(el);
//     return () => observer.disconnect();
//   }, [children]);

//   const span = (
//     <span
//       ref={ref}
//       className={cn(
//         "block truncate",   // ✅ key: truncate = overflow:hidden + text-overflow:ellipsis + whitespace:nowrap
//         className
//       )}
//     >
//       {children}
//     </span>
//   );

//   if (!isTruncated) return span;

//   return (
//     <TooltipProvider delayDuration={300}>
//       <Tooltip>
//         <TooltipTrigger asChild>{span}</TooltipTrigger>
//         <TooltipContent
//           side="top"
//           className="max-w-[300px] break-words text-xs"
//         >
//           {children}
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   );
// }