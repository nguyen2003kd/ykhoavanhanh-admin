import { apiClient } from "@/lib/api-client";
import { AdminUser } from "@/types/user";
import { PaginatedResponse, PaginationParams } from "@/types/api";

export const usersService = {
  getAll: (params?: Partial<PaginationParams & { role?: string; search?: string }>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get<PaginatedResponse<AdminUser>>(`/api/v1/users${q ? `?${q}` : ""}`);
  },
  getById: (id: string) => apiClient.get<AdminUser>(`/api/v1/users/${id}`),
  create: (data: Partial<AdminUser & { password: string }>) => apiClient.post<AdminUser>("/api/v1/users", data),
  update: (id: string, data: Partial<AdminUser>) => apiClient.put<AdminUser>(`/api/v1/users/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/api/v1/users/${id}`),
  getMyInfo: () => apiClient.get<AdminUser>("/api/v1/auth/me"),
};
