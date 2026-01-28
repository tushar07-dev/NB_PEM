import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
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
  const { handleLogin: login } = useAuth();
  const { error, isError, setError, clearError } = useAsyncError();
  navigate("/dashboard");
  const handleLogin = async () => {
    clearError();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
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
            <Label>Email</Label>
            <Input
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isError && <p className="text-sm text-red-500">{error?.message}</p>}

          <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
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
              <p className="text-xs text-gray-500">Error ID: {error.message}</p>
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
