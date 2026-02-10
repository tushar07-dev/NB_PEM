import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useAuth } from "@/app/providers/AuthProvider";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { currentUser, handleLogout } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-red-600">
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            You don't have permission to access this page.
          </p>
          {currentUser && (
            <p className="text-center text-sm text-gray-500">
              Current role:{" "}
              <span className="font-semibold">{currentUser.role}</span>
            </p>
          )}
          <div className="space-y-2">
            <Button className="w-full" onClick={handleGoHome}>
              Go to Dashboard
            </Button>
            <Button className="w-full" variant="outline" onClick={handleGoBack}>
              Go Back
            </Button>
            <Button
              className="w-full"
              variant="ghost"
              onClick={handleLogoutClick}
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
