import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";

export interface AuthState {
  isAuthenticated: boolean;
  principal: Principal | null;
  login: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export function useAuth(): AuthState {
  const { identity, login, clear, loginStatus } = useInternetIdentity();

  const principal = identity?.getPrincipal() ?? null;
  const isAuthenticated =
    loginStatus === "success" && principal !== null && !principal.isAnonymous();
  const isLoading = loginStatus === "logging-in";

  const handleLogin = async () => {
    await login();
  };

  const handleLogout = () => {
    clear();
  };

  return {
    isAuthenticated,
    principal,
    login: handleLogin,
    logout: handleLogout,
    isLoading,
  };
}
