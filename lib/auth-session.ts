import { AdminUser } from "@/types/user";
import { AuthTokenResponse } from "@/types/api";

export const ACCESS_TOKEN_KEY = "vh_access_token";
export const REFRESH_TOKEN_KEY = "vh_refresh_token";
export const TOKEN_EXPIRES_IN_KEY = "vh_token_expires_in";
export const CURRENT_USER_KEY = "vh_current_user";

function isBrowser() { return typeof window !== "undefined"; }

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setAuthSession(tokens: AuthTokenResponse): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  localStorage.setItem(TOKEN_EXPIRES_IN_KEY, tokens.expiresIn);
}

export function setAccessTokenSession(accessToken: string, expiresIn: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(TOKEN_EXPIRES_IN_KEY, expiresIn);
}

export function setCurrentUserSession(user: AdminUser): void {
  if (!isBrowser()) return;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUserSession(): AdminUser | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as AdminUser; } catch { return null; }
}

export function clearAuthSession(): void {
  if (!isBrowser()) return;
  [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, TOKEN_EXPIRES_IN_KEY, CURRENT_USER_KEY].forEach((k) => localStorage.removeItem(k));
}

export function hasAuthSession(): boolean {
  return Boolean(getAccessToken());
}
