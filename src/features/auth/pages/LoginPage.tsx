import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/app/providers/useAuth";
import { ErrorBoundary } from "@/shared/errors/ErrorBoundary";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ROUTES } from "@/shared/config/routes";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogin, isLoading } = useAuth();

  const from =
    (location.state as { from?: { pathname?: string } })?.from?.pathname ||
    ROUTES.DASHBOARD;

  const handleLoginClick = async () => {
    try {
      await handleLogin();
      navigate(from, { replace: true });
    } catch {
      // MSAL popup handles its own error UI
      // ErrorBoundary above catches unexpected errors
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">PEM Digital</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center text-sm">
            Sign in with your Aker Solutions Microsoft account
          </p>
          <Button
            className="w-full"
            onClick={handleLoginClick}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in with Microsoft"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const LoginPage = () => {
  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }) => (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
          <Card className="w-full max-w-md">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-lg font-semibold text-red-600">
                Login Error
              </h2>
              <p className="text-gray-600">
                Something went wrong. Please try again.
              </p>
              <p className="text-xs text-gray-500">{error.message}</p>
              <Button onClick={resetErrorBoundary} className="w-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    >
      <LoginForm />
    </ErrorBoundary>
  );
};

export default LoginPage;
