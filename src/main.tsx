import "@/config/env";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { router } from "@/app/router";
import { queryClient } from "@/api/query-client";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { GlobalLoader } from "@/shared/components/GlobalLoader";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { configService } from "@/shared/config/configService";
import { initMonitoring } from "@/shared/services/monitoring";
import "./index.css";

configService.loadConfig().then(() => {
  initMonitoring();
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider delayDuration={200}>
            <GlobalLoader />
            <RouterProvider router={router} />
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </AuthProvider>

        {/* React Query DevTools (only in development) */}
        {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} position="bottom" />
        )}
      </QueryClientProvider>
    </React.StrictMode>
  );
});
