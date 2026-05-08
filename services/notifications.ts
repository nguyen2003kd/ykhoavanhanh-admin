import { apiClient } from "@/lib/api-client";
import { PaginatedResponse, PaginationParams } from "@/types/api";
import { AdminNotification } from "@/types/notification";

export const notificationsService = {
  getAll: (params?: Partial<PaginationParams & { type?: string; status?: string }>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get<PaginatedResponse<AdminNotification>>(`/api/v1/notifications${q ? `?${q}` : ""}`);
  },
  getById: (id: string) => apiClient.get<AdminNotification>(`/api/v1/notifications/${id}`),
  create: (data: Partial<AdminNotification>) => apiClient.post<AdminNotification>("/api/v1/notifications", data),
  send: (id: string) => apiClient.post<AdminNotification>(`/api/v1/notifications/${id}/send`, {}),
  delete: (id: string) => apiClient.delete<void>(`/api/v1/notifications/${id}`),
};
