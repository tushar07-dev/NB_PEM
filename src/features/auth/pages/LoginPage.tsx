import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/app/providers/useAuth";
import { ErrorBoundary } from "@/shared/errors/ErrorBoundary";
import { useAsyncError } from "@/shared/hooks/useAsyncError";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogin } = useAuth();
  const { error, isError, setError, clearError } = useAsyncError();

  // Get the page user was trying to access before login
  const from =
    (location.state as { from?: { pathname?: string } })?.from?.pathname ||
    "/dashboard";
  const handleLoginSubmit = async () => {
    clearError();
    setIsLoading(true);

    try {
      await handleLogin(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Login failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && email && password && !isLoading) {
      handleLoginSubmit();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {isError && <p className="text-sm text-red-500">{error?.message}</p>}

          <Button
            className="w-full"
            onClick={handleLoginSubmit}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const LoginPage = () => {
  const [loginAttempts, setLoginAttempts] = useState(0);

  return (
    <ErrorBoundary
      resetKeys={[loginAttempts]}
      onReset={() => {
        setLoginAttempts((prev) => prev + 1);
      }}
      fallback={({ error, resetErrorBoundary }) => (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
          <Card className="w-full max-w-md">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-lg font-semibold text-red-600">
                Login Error
              </h2>
              <p className="text-gray-600">
                Something went wrong during login. Please try again.
              </p>
              <p className="text-xs text-gray-500">Error: {error.message}</p>
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
