import { apiClient } from "@/lib/api-client";
import { PaginatedResponse, PaginationParams } from "@/types/api";
import { Promotion } from "@/types/promotion";

export const promotionsService = {
  getAll: (params?: Partial<PaginationParams & { isActive?: boolean }>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get<PaginatedResponse<Promotion>>(`/api/v1/promotions${q ? `?${q}` : ""}`);
  },
  getById: (id: string) => apiClient.get<Promotion>(`/api/v1/promotions/${id}`),
  create: (data: Partial<Promotion>) => apiClient.post<Promotion>("/api/v1/promotions", data),
  update: (id: string, data: Partial<Promotion>) => apiClient.put<Promotion>(`/api/v1/promotions/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/api/v1/promotions/${id}`),
};
