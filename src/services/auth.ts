import { apiClient } from "@/lib/api-client";
import { setAuthSession, setCurrentUserSession, clearAuthSession, getCurrentUserSession } from "@/lib/auth-session";
import { LoginPayload, AuthTokenResponse } from "@/types/api";
import { AdminUser } from "@/types/user";

// Tài khoản ảo tạm thời (khi chưa có API)
const DEMO_ACCOUNT = {
  email: "admin@gmail.com",
  password: "12345678",
};

export const authService = {
  async login(payload: LoginPayload): Promise<AuthTokenResponse> {
    // Kiểm tra tài khoản ảo
    if (payload.identifier === DEMO_ACCOUNT.email && payload.password === DEMO_ACCOUNT.password) {
      // Tạo fake admin user
      const fakeUser: AdminUser = {
        id: "demo-admin",
        fullName: "Admin Demo",
        email: DEMO_ACCOUNT.email,
        phone: "0900000000",
        role: "super_admin",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Tạo fake token response
      const fakeResponse: AuthTokenResponse = {
        accessToken: "fake-jwt-token-" + Date.now(),
        refreshToken: "fake-refresh-token-" + Date.now(),
        expiresIn: "86400",
      };
      
      setAuthSession(fakeResponse);
      setCurrentUserSession(fakeUser);
      return fakeResponse;
    }

    const res = await apiClient.post<AuthTokenResponse>("/api/v1/auth/login", payload);
    setAuthSession(res);
    return res;
  },

  async getMyInfo(): Promise<AdminUser> {
    // Nếu đang dùng demo account, trả về user từ session
    const cachedUser = getCurrentUserSession();
    if (cachedUser && cachedUser.id === "demo-admin") {
      return cachedUser;
    }
    
    const res = await apiClient.get<AdminUser>("/api/v1/auth/me");
    setCurrentUserSession(res);
    return res;
  },

  async logout(): Promise<void> {
    await apiClient.post("/api/v1/auth/logout", {}).catch(() => {});
    clearAuthSession();
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/api/v1/auth/forgot-password", { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post("/api/v1/auth/reset-password", { token, newPassword });
  },
};
