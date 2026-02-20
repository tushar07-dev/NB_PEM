import { loginApi } from "@/api/auth";
import { useAuthActions } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
 
export const useLogin = () => {
  const { setAuthDetails, setUserDetails } = useAuthActions();
  const navigate = useNavigate();
 
  return useMutation({
    mutationFn: (token: string) => {
      return loginApi(token);
    },
    onSuccess: (data) => {
      if (data.status === -1) {
        setAuthDetails(data.data.token, "");
 
        setUserDetails({
          ...data.data.userDetails,
          fullName: `${data.data.userDetails.givenName} ${data.data.userDetails.surname}`,
          roles: [],
        });
        navigate({ to: "/dashboard" });
      }
    },
  });
};