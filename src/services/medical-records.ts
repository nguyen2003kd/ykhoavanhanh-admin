import { apiClient } from "@/lib/api-client";
import { PaginatedResponse, PaginationParams, FilterParams } from "@/types/api";
import { MedicalRecord } from "@/types/medical-record";

export const medicalRecordsService = {
  getAll: (params?: Partial<PaginationParams & FilterParams & { patientId?: string; doctorId?: string }>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get<PaginatedResponse<MedicalRecord>>(`/api/v1/medical-records${q ? `?${q}` : ""}`);
  },
  getById: (id: string) => apiClient.get<MedicalRecord>(`/api/v1/medical-records/${id}`),
  getByPatient: (patientId: string) => apiClient.get<MedicalRecord[]>(`/api/v1/patients/${patientId}/medical-records`),
  create: (data: Partial<MedicalRecord>) => apiClient.post<MedicalRecord>("/api/v1/medical-records", data),
  update: (id: string, data: Partial<MedicalRecord>) => apiClient.put<MedicalRecord>(`/api/v1/medical-records/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/api/v1/medical-records/${id}`),
};
