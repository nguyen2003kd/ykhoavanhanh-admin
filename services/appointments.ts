import { apiClient } from "@/lib/api-client";
import { PaginatedResponse, PaginationParams, FilterParams } from "@/types/api";
import { Appointment } from "@/app/(dashboard)/appointments/types";

export const appointmentsService = {
  getAll: (params?: Partial<PaginationParams & FilterParams & { doctorId?: string; patientId?: string }>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get<PaginatedResponse<Appointment>>(`/api/v1/appointments${q ? `?${q}` : ""}`);
  },
  getById: (id: string) => apiClient.get<Appointment>(`/api/v1/appointments/${id}`),
  create: (data: Partial<Appointment>) => apiClient.post<Appointment>("/api/v1/appointments", data),
  update: (id: string, data: Partial<Appointment>) => apiClient.put<Appointment>(`/api/v1/appointments/${id}`, data),
  updateStatus: (id: string, status: Appointment["status"]) => apiClient.patch<Appointment>(`/api/v1/appointments/${id}/status`, { status }),
  delete: (id: string) => apiClient.delete<void>(`/api/v1/appointments/${id}`),
};
