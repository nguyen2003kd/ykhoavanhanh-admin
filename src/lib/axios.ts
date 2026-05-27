import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore, isTokenExpired, getAccessToken } from "@/store/authStore";
import { ApiResponse, RefreshTokenResponse } from "@/types/api-response";

// Create axios instance
const createAxiosInstance = (): AxiosInstance => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return api;
};

export const api: AxiosInstance = createAxiosInstance();

// Track ongoing refresh requests to prevent duplicate refresh calls
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Subscribe to token refresh
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Notify all subscribers with new token
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Reset refresh state
const resetRefreshState = () => {
  isRefreshing = false;
  refreshSubscribers = [];
};

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const {  tokenExpiresAt } = useAuthStore.getState();

    // Skip auth for public endpoints
    const publicEndpoints = ["/auth/login", "/auth/register", "/auth/forgotPassword", "/auth/verifyOTP"];
    const isPublic = publicEndpoints.some((ep) => config.url?.includes(ep));

    if (isPublic) {
      return config;
    }

    // Get current token
    let accessToken = getAccessToken();

    // If token is expired or about to expire, try to refresh first
    if (accessToken && isTokenExpired()) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            onRefreshed(newToken);
          } else {
            // Refresh failed, logout
            useAuthStore.getState().logout();
            if (typeof window !== "undefined") {
              window.location.href = "/auth/login";
            }
          }
          resetRefreshState();
        } catch (error) {
          resetRefreshState();
          useAuthStore.getState().logout();
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
          }
          return Promise.reject(error);
        }
      } else {
        // Wait for refresh to complete
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (config.headers) {
              config.headers.Authorization = `Bearer ${token}`;
            }
            resolve(config);
          });
        });
      }
    }

    // Add token to headers
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve) => {
          subscribeTokenRefresh(async (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            try {
              const response = await api(originalRequest);
              resolve(response);
            } catch (err) {
              resolve(Promise.reject(err));
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          onRefreshed(newToken);
          resetRefreshState();

          // Retry original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        resetRefreshState();
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.data) {
      const errorData = error.response.data;
      const errorMessage =
        errorData.message ||
        errorData.message_en ||
        error.response.statusText ||
        "Đã xảy ra lỗi";

      return Promise.reject(new Error(errorMessage));
    }

    // Network error
    if (!error.response) {
      return Promise.reject(new Error("Không thể kết nối đến server"));
    }

    return Promise.reject(error);
  }
);

// Refresh access token
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"}/auth/genNewAccessToken`,
      { refreshToken }
    );

    if (response.data.status === "success" && response.data.responseData) {
      const { accessToken, expiresIn } = response.data.responseData;

      // Update store with new token
      useAuthStore.getState().updateAccessToken({ accessToken, expiresIn });

      return accessToken;
    }

    return null;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
}

// API helper functions
export const apiGet = <T>(url: string, config?: AxiosRequestConfig) =>
  api.get<ApiResponse<T>>(url, config);

export const apiPost = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  api.post<ApiResponse<T>>(url, data, config);

export const apiPut = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  api.put<ApiResponse<T>>(url, data, config);

export const apiPatch = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  api.patch<ApiResponse<T>>(url, data, config);

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig) =>
  api.delete<ApiResponse<T>>(url, config);

// Utility function to extract response data
export const getResponseData = <T>(response: { data: ApiResponse<T> }): T | null => {
  if (response.data.status === "success") {
    return response.data.responseData;
  }
  return null;
};

import type { AxiosRequestConfig } from "axios";

export default api;
