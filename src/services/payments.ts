import { apiClient } from "@/lib/api-client";
import { PaginatedResponse, PaginationParams } from "@/types/api";
import { Payment } from "@/types/payment";

export const paymentsService = {
  getAll: (params?: Partial<PaginationParams & { status?: string; patientId?: string }>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get<PaginatedResponse<Payment>>(`/api/v1/payments${q ? `?${q}` : ""}`);
  },
  getById: (id: string) => apiClient.get<Payment>(`/api/v1/payments/${id}`),
  refund: (id: string, amount: number, reason: string) =>
    apiClient.post<Payment>(`/api/v1/payments/${id}/refund`, { amount, reason }),
};
