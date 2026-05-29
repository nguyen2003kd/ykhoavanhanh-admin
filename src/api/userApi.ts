/**
 * User API - User Management
 */

import type { PaginatedResult } from "./createApi";
import type { PaginationParams } from "@/types/api-response";
import { apiGet, apiDelete } from "@/lib/axios";
import type { User } from "@/types/api-response";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ApiUser {
  id: string;
  created_at?: string;
  created_by?: string | null;
  updated_at?: string;
  updated_by?: string | null;
  full_name?: string | null;
  phone?: string | null;
  is_admin?: boolean;
  avatar?: string | null;
  is_active?: boolean;
  zalo_id?: string | null;
  zalo_avatar?: string | null;
  zalo_id_by_oa?: string | null;
  address?: string | null;
  birthday?: string | null;
  email?: string | null;
}

// ─── Mapper ───────────────────────────────────────────────────────────────

export function mapApiUserToUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    full_name: apiUser.full_name ?? undefined,
    phone: apiUser.phone ?? undefined,
    email: apiUser.email ?? undefined,
    avatar: apiUser.avatar ?? undefined,
    is_active: apiUser.is_active ?? false,
    is_admin: apiUser.is_admin ?? false,
    createdAt: apiUser.created_at,
    updatedAt: apiUser.updated_at,
  };
}

// ─── Service Functions ─────────────────────────────────────────────────────

async function fetchUsersList(params?: PaginationParams): Promise<PaginatedResult<ApiUser>> {
  const res = await apiGet<PaginatedResult<ApiUser>>("/users", { params });
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Không thể lấy danh sách người dùng");
}

async function fetchUserById(id: string): Promise<ApiUser> {
  const res = await apiGet<ApiUser>(`/users/${id}`);
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Không thể lấy thông tin người dùng");
}

async function removeUser(id: string): Promise<void> {
  const res = await apiDelete(`/users/${id}`);
  if (res.data.status === "fail") {
    throw new Error(res.data.message || "Xóa người dùng thất bại");
  }
}

// ─── Hooks ───────────────────────────────────────────────────────────────

export function useUsersList(params?: PaginationParams) {
  return useQuery({
    queryKey: ["users", "list", params] as const,
    queryFn: () => fetchUsersList(params),
    staleTime: 1000 * 60 * 2,
    placeholderData: (previousData) => previousData,
  });
}

export function useUserById(id: string | null | undefined) {
  return useQuery({
    queryKey: ["users", "detail", id] as const,
    queryFn: () => fetchUserById(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDeleteUser(options?: { onSuccess?: () => void; onError?: (error: Error) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      options?.onSuccess?.();
    },
    onError: (error) => options?.onError?.(error),
  });
}
