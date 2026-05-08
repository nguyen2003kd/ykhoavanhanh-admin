import { apiClient } from "@/lib/api-client";
import { PaginatedResponse, PaginationParams } from "@/types/api";
import { DoctorReview } from "@/types/review";

export const reviewsService = {
  getAll: (params?: Partial<PaginationParams & { doctorId?: string; isApproved?: boolean; search?: string }>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get<PaginatedResponse<DoctorReview>>(`/api/v1/reviews${q ? `?${q}` : ""}`);
  },
  getById: (id: string) => apiClient.get<DoctorReview>(`/api/v1/reviews/${id}`),
  approve: (id: string) => apiClient.patch<DoctorReview>(`/api/v1/reviews/${id}/approve`, {}),
  hide: (id: string) => apiClient.patch<DoctorReview>(`/api/v1/reviews/${id}/hide`, {}),
  replyDoctor: (id: string, reply: string) => apiClient.patch<DoctorReview>(`/api/v1/reviews/${id}/reply`, { reply }),
  delete: (id: string) => apiClient.delete<void>(`/api/v1/reviews/${id}`),
};
