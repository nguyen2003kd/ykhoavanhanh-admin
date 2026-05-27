import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiDelete } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { queryKeys } from "@/types/api-response";
import type { 
  LoginPayload, 
  RegisterPayload, 
  ZaloLoginPayload, 
  AuthTokenResponse, 
  User,
  ApiResponse 
} from "@/types/api-response";
import type { AdminUser, AdminRole } from "@/types/user";

// Map API User to AdminUser
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

// API Response type helpers
interface LoginResponse extends ApiResponse<AuthTokenResponse & { user?: User }> {}
interface UserResponse extends ApiResponse<User> {}

// Auth Service
export const authService = {
  // Login with phone + password
  login: async (payload: LoginPayload): Promise<AuthTokenResponse> => {
    const response = await apiPost<AuthTokenResponse>("/auth/login", payload);
    if (response.data.status === "success" && response.data.responseData) {
      // Save tokens to store
      useAuthStore.getState().setAuth(response.data.responseData);
      return response.data.responseData;
    }
    throw new Error(response.data.message || "Đăng nhập thất bại");
  },

  // Register new account
  register: async (payload: RegisterPayload): Promise<User> => {
    const response = await apiPost<User>("/auth/register", payload);
    if (response.data.status === "success" && response.data.responseData) {
      return response.data.responseData;
    }
    throw new Error(response.data.message || "Đăng ký thất bại");
  },

  // Login with Zalo
  loginWithZalo: async (payload: ZaloLoginPayload): Promise<AuthTokenResponse> => {
    const response = await apiPost<AuthTokenResponse & { user?: User }>("/auth/zalo", payload);
    if (response.data.status === "success" && response.data.responseData) {
      const { responseData } = response.data;
      const adminUser = responseData.user ? mapApiUserToAdminUser(responseData.user) : undefined;
      useAuthStore.getState().setAuth(responseData, adminUser);
      return responseData;
    }
    throw new Error(response.data.message || "Đăng nhập Zalo thất bại");
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiDelete("/auth/logout");
    } finally {
      useAuthStore.getState().logout();
    }
  },

  // Get current user info
  getMyInfo: async (): Promise<AdminUser> => {
    const response = await apiGet<User>("/users/getMyInfo");
    if (response.data.status === "success" && response.data.responseData) {
      const adminUser = mapApiUserToAdminUser(response.data.responseData);
      useAuthStore.getState().setUser(adminUser);
      return adminUser;
    }
    throw new Error(response.data.message || "Không thể lấy thông tin người dùng");
  },

  // Forgot password - send OTP
  forgotPassword: async (email: string): Promise<void> => {
    const response = await apiPost("/auth/forgotPassword", { email });
    if (response.data.status === "fail") {
      throw new Error(response.data.message || "Gửi yêu cầu thất bại");
    }
  },

  // Verify OTP
  verifyOTP: async (email: string, otp: string): Promise<void> => {
    const response = await apiPost("/auth/verifyOTP", { email, otp });
    if (response.data.status === "fail") {
      throw new Error(response.data.message || "Xác thực OTP thất bại");
    }
  },

  // Resend OTP
  resendOTP: async (email: string): Promise<void> => {
    const response = await apiPost("/auth/resendOTP", { email });
    if (response.data.status === "fail") {
      throw new Error(response.data.message || "Gửi lại OTP thất bại");
    }
  },
};

// TanStack Query Hooks for Auth
export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authService.getMyInfo(),
    enabled: useAuthStore.getState().isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
}

export function useVerifyOTP() {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      authService.verifyOTP(email, otp),
  });
}

export function useResendOTP() {
  return useMutation({
    mutationFn: (email: string) => authService.resendOTP(email),
  });
}
