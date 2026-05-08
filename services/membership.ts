import { apiClient } from "@/lib/api-client";
import { PaginatedResponse, PaginationParams } from "@/types/api";
import { MemberProfile, PointTransaction, Gift, GiftRedemption, Voucher, FamilyGroup } from "@/types/membership";

export const membershipService = {
  // Members
  getMembers: (params?: Partial<PaginationParams & { tier?: string; search?: string }>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get<PaginatedResponse<MemberProfile>>(`/api/v1/membership/members${q ? `?${q}` : ""}`);
  },
  getMemberById: (id: string) => apiClient.get<MemberProfile>(`/api/v1/membership/members/${id}`),
  adjustPoints: (memberId: string, points: number, description: string) =>
    apiClient.post<PointTransaction>(`/api/v1/membership/members/${memberId}/adjust-points`, { points, description }),

  // Point transactions
  getTransactions: (memberId: string) => apiClient.get<PointTransaction[]>(`/api/v1/membership/members/${memberId}/transactions`),

  // Family groups
  getFamilyGroups: (params?: Partial<PaginationParams>) => apiClient.get<PaginatedResponse<FamilyGroup>>("/api/v1/membership/family-groups"),
  getFamilyGroupById: (id: string) => apiClient.get<FamilyGroup>(`/api/v1/membership/family-groups/${id}`),

  // Gifts
  getGifts: () => apiClient.get<Gift[]>("/api/v1/membership/gifts"),
  createGift: (data: Partial<Gift>) => apiClient.post<Gift>("/api/v1/membership/gifts", data),
  updateGift: (id: string, data: Partial<Gift>) => apiClient.put<Gift>(`/api/v1/membership/gifts/${id}`, data),
  deleteGift: (id: string) => apiClient.delete<void>(`/api/v1/membership/gifts/${id}`),

  // Redemptions
  getRedemptions: (params?: Partial<PaginationParams & { status?: string }>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get<PaginatedResponse<GiftRedemption>>(`/api/v1/membership/redemptions${q ? `?${q}` : ""}`);
  },
  approveRedemption: (id: string) => apiClient.patch<GiftRedemption>(`/api/v1/membership/redemptions/${id}/approve`, {}),
  rejectRedemption: (id: string, reason: string) => apiClient.patch<GiftRedemption>(`/api/v1/membership/redemptions/${id}/reject`, { reason }),

  // Vouchers
  getVouchers: () => apiClient.get<Voucher[]>("/api/v1/membership/vouchers"),
  createVoucher: (data: Partial<Voucher>) => apiClient.post<Voucher>("/api/v1/membership/vouchers", data),
  updateVoucher: (id: string, data: Partial<Voucher>) => apiClient.put<Voucher>(`/api/v1/membership/vouchers/${id}`, data),
  deleteVoucher: (id: string) => apiClient.delete<void>(`/api/v1/membership/vouchers/${id}`),
};
