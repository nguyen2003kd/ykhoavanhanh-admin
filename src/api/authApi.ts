/**
 * Auth API - Authentication & Authorization
 */

import { apiGet, apiPost, apiDelete } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { queryKeys } from "@/types/api-response";
import type { LoginPayload, AuthTokenResponse, User, ApiResponse } from "@/types/api-response";
import type { AdminUser, AdminRole } from "@/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapApiUserToAdminUser(apiUser: User): AdminUser {
  return {
    id: apiUser.id,
    fullName: apiUser.full_name || "",
    email: apiUser.email || "",
    phone: apiUser.phone,
    role: (apiUser.is_admin ? "super_admin" : "cskh") as AdminRole,
    avatar: apiUser.avatar,
    isActive: apiUser.is_active ?? true,
    createdAt: apiUser.createdAt || new Date().toISOString(),
    updatedAt: apiUser.updatedAt || new Date().toISOString(),
  };
}

function unwrap<T>(res: { data: ApiResponse<T> }): T {
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Lỗi không xác định");
}

// ─── Service Functions ─────────────────────────────────────────────────────────

async function login(payload: LoginPayload): Promise<AuthTokenResponse> {
  const res = await apiPost<AuthTokenResponse>("/auth/admin-login", payload);
  const data = unwrap(res);
  useAuthStore.getState().setAuth(data);
  return data;
}

async function logout(): Promise<void> {
  try {
    await apiDelete("/auth/logout");
  } catch {
    // ignore 401 on logout
  } finally {
    useAuthStore.getState().resetStore();
  }
}

async function getMyInfo(): Promise<AdminUser> {
  const res = await apiGet<User>("/users/getMyInfo");
  const user = unwrap(res);
  const adminUser = mapApiUserToAdminUser(user);
  useAuthStore.getState().setUser(adminUser);
  return adminUser;
}

async function forgotPassword(email: string): Promise<void> {
  const res = await apiPost("/auth/forgotPassword", { email });
  if (res.data.status === "fail") {
    throw new Error(res.data.message || "Gửi yêu cầu thất bại");
  }
}

async function verifyOTP({ email, otp }: { email: string; otp: string }): Promise<void> {
  const res = await apiPost("/auth/verifyOTP", { email, otp });
  if (res.data.status === "fail") {
    throw new Error(res.data.message || "Xác thực OTP thất bại");
  }
}

async function resendOTP(email: string): Promise<void> {
  const res = await apiPost("/auth/resendOTP", { email });
  if (res.data.status === "fail") {
    throw new Error(res.data.message || "Gửi lại OTP thất bại");
  }
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useLogin(options?: { onSuccess?: (data: AuthTokenResponse) => void; onError?: (error: Error) => void }) {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => options?.onSuccess?.(data),
    onError: (error) => options?.onError?.(error),
  });
}

export function useLogout() {
  return useMutation({ mutationFn: logout });
}

export function useGetMyInfo(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: getMyInfo,
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: options?.enabled ?? true,
  });
}

export function useForgotPassword(options?: { onSuccess?: () => void; onError?: (error: Error) => void }) {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => options?.onSuccess?.(),
    onError: (error) => options?.onError?.(error),
  });
}

export function useVerifyOTP(options?: { onSuccess?: () => void; onError?: (error: Error) => void }) {
  return useMutation({
    mutationFn: verifyOTP,
    onSuccess: () => options?.onSuccess?.(),
    onError: (error) => options?.onError?.(error),
  });
}

export function useResendOTP(options?: { onSuccess?: () => void; onError?: (error: Error) => void }) {
  return useMutation({
    mutationFn: resendOTP,
    onSuccess: () => options?.onSuccess?.(),
    onError: (error) => options?.onError?.(error),
  });
}

// Re-export service for direct usage
export const authService = { login, logout, getMyInfo, forgotPassword, verifyOTP, resendOTP };
