import { apiClient } from "@/lib/api-client";
import { PaginatedResponse, PaginationParams, FilterParams, SortParams } from "@/types/api";
import { Patient } from "@/app/(dashboard)/patients/types";

type PatientsQuery = PaginationParams & FilterParams & SortParams;

export const patientsService = {
  getAll: (params?: Partial<PatientsQuery>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get<PaginatedResponse<Patient>>(`/api/v1/patients${q ? `?${q}` : ""}`);
  },
  getById: (id: string) => apiClient.get<Patient>(`/api/v1/patients/${id}`),
  create: (data: Partial<Patient>) => apiClient.post<Patient>("/api/v1/patients", data),
  update: (id: string, data: Partial<Patient>) => apiClient.put<Patient>(`/api/v1/patients/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/api/v1/patients/${id}`),
};
