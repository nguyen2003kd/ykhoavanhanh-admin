import { clearAuthSession, getAccessToken, getRefreshToken, setAccessTokenSession } from "@/lib/auth-session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const REFRESH_ENDPOINT = "/api/v1/auth/refresh-token";

class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(baseUrl: string) { this.baseUrl = baseUrl; }

  private getHeaders(headers?: HeadersInit, token?: string): Headers {
    const h = new Headers(headers);
    if (!h.has("Content-Type")) h.set("Content-Type", "application/json");
    if (token) h.set("Authorization", `Bearer ${token}`);
    return h;
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (this.refreshPromise) return this.refreshPromise;
    this.refreshPromise = this.doRefresh();
    try { return await this.refreshPromise; } finally { this.refreshPromise = null; }
  }

  private async doRefresh(): Promise<string | null> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;
    try {
      const res = await fetch(`${this.baseUrl}${REFRESH_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) { clearAuthSession(); return null; }
      const data = await res.json();
      setAccessTokenSession(data.accessToken, data.expiresIn);
      return data.accessToken;
    } catch {
      clearAuthSession();
      return null;
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const accessToken = getAccessToken();
    const headers = this.getHeaders(options.headers, accessToken ?? undefined);
    const res = await fetch(`${this.baseUrl}${endpoint}`, { ...options, headers });

    if (res.status === 401) {
      const newToken = await this.refreshAccessToken();
      if (!newToken) {
        clearAuthSession();
        if (typeof window !== "undefined") window.location.href = "/auth/login";
        throw new Error("Unauthorized");
      }
      const retryHeaders = this.getHeaders(options.headers, newToken);
      const retryRes = await fetch(`${this.baseUrl}${endpoint}`, { ...options, headers: retryHeaders });
      if (!retryRes.ok) throw new Error(`HTTP ${retryRes.status}`);
      return retryRes.json();
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }
    if (res.status === 204) return undefined as T;
    return res.json();
  }

  get<T>(endpoint: string) { return this.request<T>(endpoint, { method: "GET" }); }
  post<T>(endpoint: string, body: unknown) { return this.request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }); }
  put<T>(endpoint: string, body: unknown) { return this.request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }); }
  patch<T>(endpoint: string, body: unknown) { return this.request<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) }); }
  delete<T>(endpoint: string) { return this.request<T>(endpoint, { method: "DELETE" }); }
}

export const apiClient = new ApiClient(API_BASE_URL);
