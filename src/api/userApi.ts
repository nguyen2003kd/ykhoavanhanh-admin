/**
 * User API - User Management
 */

import type { PaginatedResult } from "./createApi";
import type { PaginationParams } from "@/types/api-response";
import { apiGet, apiDelete, apiPut } from "@/lib/axios";
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
  email?: string | null;
  cccd?: string | null;
  is_admin?: boolean;
  avatar?: string | null;
  is_active?: boolean;
  zalo_id?: string | null;
  zalo_avatar?: string | null;
  zalo_id_by_oa?: string | null;
  address?: string | null;
  birthday?: string | null;
  role?: string | null;
}

// ─── Mapper ─────────────────────────────────────────────────────────────

export function mapApiUserToUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    full_name: apiUser.full_name ?? undefined,
    phone: apiUser.phone ?? undefined,
    email: apiUser.email ?? undefined,
    cccd: apiUser.cccd ?? undefined,
    avatar: apiUser.avatar ?? undefined,
    is_active: apiUser.is_active ?? false,
    is_admin: apiUser.is_admin ?? false,
    createdAt: apiUser.created_at,
    updatedAt: apiUser.updated_at,
  };
}

// ─── Query Keys ────────────────────────────────────────────────────────────────

const userBase = ["users"] as const;

export const userKeys = {
  all: userBase,
  list: (params?: PaginationParams) =>
    [...userBase, "list", params] as const,
  detail: (id: string) =>
    [...userBase, "detail", id] as const,
};

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

async function updateUser(id: string, payload: Partial<ApiUser>): Promise<ApiUser> {
  const res = await apiPut<ApiUser>(`/users/${id}`, payload);
  if (res.data.status === "fail") {
    throw new Error(res.data.message || "Cập nhật người dùng thất bại");
  }
  return res.data.responseData as ApiUser;
}

// ─── Hooks ─────────────────────────────────────────────────────────────

export function useUsersList(params?: PaginationParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => fetchUsersList(params),
    staleTime: 1000 * 60 * 2,
    placeholderData: (previousData) => previousData,
  });
}

export function useUserById(id: string | null | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id ?? ""),
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
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.();
    },
    onError: (error) => options?.onError?.(error),
  });
}

export function useUpdateUser(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ApiUser> }) =>
      updateUser(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      options?.onSuccess?.();
    },
    onError: (error) => options?.onError?.(error),
  });
}
