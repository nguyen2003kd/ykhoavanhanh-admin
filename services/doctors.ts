import { apiClient } from "@/lib/api-client";
import { PaginatedResponse, PaginationParams, FilterParams } from "@/types/api";
import { Doctor } from "@/app/(dashboard)/doctors/types";

export const doctorsService = {
  getAll: (params?: Partial<PaginationParams & FilterParams & { specialtyId?: string }>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get<PaginatedResponse<Doctor>>(`/api/v1/doctors${q ? `?${q}` : ""}`);
  },
  getById: (id: string) => apiClient.get<Doctor>(`/api/v1/doctors/${id}`),
  create: (data: Partial<Doctor>) => apiClient.post<Doctor>("/api/v1/doctors", data),
  update: (id: string, data: Partial<Doctor>) => apiClient.put<Doctor>(`/api/v1/doctors/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/api/v1/doctors/${id}`),
};
