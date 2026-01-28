import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { router } from "@/app/router"
import AuthProvider from "@/app/providers/AuthProvider"
import { ErrorProvider } from "@/app/providers/ErrorProvider"
import { ErrorBoundary } from "@/shared/errors/ErrorBoundary"
import { MsalProvider } from "@azure/msal-react"
import { ThemeProvider } from "next-themes"
import "./index.css"
import { configService } from "@/shared/config/configService"
import { initializeMsalInstance } from "@/shared/config/msalConfig"
import { initializeApi } from "@/shared/services/axios"
import { initMonitoring } from "@/shared/services/monitoring"

// App component that requires config
function App() {
  // const msalInstance = initializeMsalInstance()

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {/* <MsalProvider instance={msalInstance}> */}
        <ErrorProvider>
          <ErrorBoundary> 
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </ErrorBoundary>
        </ErrorProvider>
      {/* </MsalProvider> */}
    </ThemeProvider>
  )
}

// Main initialization function
async function initializeApp() {
  try {
    // Load runtime configuration first
    // await configService.loadConfig()

    // Initialize services that depend on config
    // initializeApi()
    // initMonitoring()

    // Render the app
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  } catch (error) {
    console.error('Failed to initialize app:', error)

    // Render error fallback if config loading fails
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center max-w-md p-6">
            <h2 className="text-lg font-semibold text-red-600 mb-4">
              Configuration Error
            </h2>
            <p className="text-gray-600 mb-4">
              Failed to load application configuration. Please check your config.json file.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </React.StrictMode>
    )
  }
}

// Start the application
initializeApp()