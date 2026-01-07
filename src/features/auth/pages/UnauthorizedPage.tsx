import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/app/providers/AuthProvider";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const handleBackToLogin = () => {
    // Clear auth state so they can try a different account/role
    handleLogout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 p-4 text-center font-sans">
      <div className="flex flex-col items-center max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        
        {/* Visual Icon */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert size={32} />
        </div>

        {/* Text Content */}
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Access Denied
        </h1>
        <p className="mb-8 text-slate-500 text-sm leading-relaxed">
          You do not have the necessary permissions to access this section. 
          Please contact your administrator if you believe this is an error.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <Button 
            variant="default" 
            className="w-full bg-[#081E32] hover:bg-[#051320] text-white"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 border-slate-200 text-slate-600 hover:bg-slate-50"
            onClick={handleBackToLogin}
          >
            <ArrowLeft size={16} />
            Back to Login
          </Button>
        </div>
      </div>
      
      {/* Footer Info */}
      <p className="mt-8 text-xs text-slate-400 uppercase tracking-widest">
        Error Code: 403 Forbidden
      </p>
    </div>
  );
}