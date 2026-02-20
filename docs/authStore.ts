import { logoutApi } from "@/api/auth";
import { merge } from "lodash";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type UserRole = {
  roleId: string;
};

export type IUserDetails = {
  roles: { roleId: string }[];
  id: string;
  mail: string;
  displayName: string;
  mobilePhone: string;
  employeeId: string;
  companyName: string;
  department: string;
  fullName: string;
  country: string;
  isAdmin: boolean;
  givenName: string;
  surname: string;
  photo: string;
};

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  userDetails: null | IUserDetails;
}

export interface AuthAction {
  setAuthDetails: (token: string, refreshToken: string) => void;
  setUserDetails: (userDetails: IUserDetails | null) => void;
  handleLogout: () => Promise<boolean>;
}

interface AuthStore extends AuthState {
  actions: AuthAction;
}

const AUTH_INITIAL_STATE = {
  token: null,
  userDetails: null,
  refreshToken: null,
};

const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...AUTH_INITIAL_STATE,
        actions: {
          setAuthDetails: (token: string, refreshToken: string) => {
            set({ token, refreshToken });
          },
          setUserDetails: (userDetails) => {
            set({ userDetails: userDetails });
          },
          handleLogout: async () => {
            try {
              const response = await logoutApi();
              if (response && response.status === -1) {
                set(AUTH_INITIAL_STATE);
                return true;
              }
              // console.warn("Logout failed on server, state not cleared.");
              return true;
            } catch (error) {
              console.error("Error in handleLogout:", error);
              return false;
            }
          },
        },
      })),
      {
        name: "auth",
        merge: (persistedState, currentState) => {
          return merge({}, currentState, persistedState);
        },
      }
    )
  )
);

export const useToken = () => useAuthStore((state) => state.token);
export const useUserDetails = () => useAuthStore((state) => state.userDetails);
export const useIsUserAdmin = () =>
  useAuthStore((state) => state.userDetails?.isAdmin);
export const useAuthActions = () => useAuthStore((state) => state.actions);

export const getTokenFromAuthStore = () => {
  return useAuthStore.getState().token;
};

export const setTokenOnAuthStore = (token: string) => {
  return useAuthStore.setState({ token });
};

export const handleLogoutAuthStore = () => {
  useAuthStore.setState(AUTH_INITIAL_STATE);
};

export const getRefreshTokenFromAuthStore = () => {
  return useAuthStore.getState().refreshToken;
};
