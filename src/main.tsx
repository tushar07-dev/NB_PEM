// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { router } from "@/app/router";
import { queryClient } from "@/api/query-client";
import AuthProvider from "@/app/providers/AuthProvider";
import { GlobalLoader } from "@/shared/components/GlobalLoader";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider delayDuration={200}>
          <GlobalLoader />
          <RouterProvider router={router} />
        </TooltipProvider>
      </AuthProvider>

      {/* React Query DevTools (only in development) */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  </React.StrictMode>
);
