import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AdminUser } from "@/types/user";
import { AuthTokenResponse, RefreshTokenResponse } from "@/types/api-response";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: string | null;
  tokenExpiresAt: number | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (tokens: AuthTokenResponse, user?: AdminUser) => void;
  setUser: (user: AdminUser) => void;
  updateAccessToken: (tokens: RefreshTokenResponse) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      tokenExpiresAt: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setAuth: (tokens, user) => {
        const expiresAt = Date.now() + parseInt(tokens.expiresIn, 10) * 1000;
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: tokens.expiresIn,
          tokenExpiresAt: expiresAt,
          user: user || null,
          isAuthenticated: true,
          isLoading: false,
        });
      },
      setUser: (user) => set({ user, isAuthenticated: true }),
      updateAccessToken: (tokens) => {
        const expiresAt = Date.now() + parseInt(tokens.expiresIn, 10) * 1000;
        set({
          accessToken: tokens.accessToken,
          expiresIn: tokens.expiresIn,
          tokenExpiresAt: expiresAt,
        });
      },
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          expiresIn: null,
          tokenExpiresAt: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "vh-auth-storage",
      partialize: (state: AuthState) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresIn: state.expiresIn,
        tokenExpiresAt: state.tokenExpiresAt,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  ) as any
);

export const getAccessToken = () => useAuthStore.getState().accessToken;
export const isTokenExpired = () => {
  const tokenExpiresAt = useAuthStore.getState().tokenExpiresAt;
  if (!tokenExpiresAt) return true;
  return Date.now() >= tokenExpiresAt - 30000;
};

export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useRefreshToken = () => useAuthStore((state) => state.refreshToken);
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
