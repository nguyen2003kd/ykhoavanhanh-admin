/**
 * User-Roles API - Assign Roles to Users
 * Base path: /api/v1.0/user-roles
 */

import type { PaginatedResult } from "./createApi";
import type { PaginationParams } from "@/types/api-response";
import { apiGet, apiPost, apiDelete } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ApiUserRole {
  id: string;
  user_id: string;
  role_id: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    is_admin: boolean;
  };
  role: {
    id: string;
    role_name: string;
    description: string | null;
    receptionist: boolean;
    membership: boolean;
    marketing: boolean;
    accountant: boolean;
    customer_service: boolean;
  };
}

export interface CreateUserRolePayload {
  user_id: string;
  role_id: string;
}

// ─── Query Keys ────────────────────────────────────────────────────────────────

const userRolesBase = ["user-roles"] as const;

export const userRoleKeys = {
  all: userRolesBase,
  list: (params?: PaginationParams) => [...userRolesBase, "list", params] as const,
  detail: (id: string) => [...userRolesBase, "detail", id] as const,
  byUser: (userId: string) => [...userRolesBase, "byUser", userId] as const,
  byRole: (roleId: string) => [...userRolesBase, "byRole", roleId] as const,
};

// ─── Service Functions ─────────────────────────────────────────────────────

async function fetchUserRolesList(
  params?: PaginationParams & { user_id?: string; role_id?: string }
): Promise<PaginatedResult<ApiUserRole>> {
  const res = await apiGet<PaginatedResult<ApiUserRole>>("/user-roles", { params });
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Không thể lấy danh sách gán vai trò");
}

async function fetchUserRoleById(id: string): Promise<ApiUserRole> {
  const res = await apiGet<ApiUserRole>(`/user-roles/${id}`);
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Không thể lấy thông tin gán vai trò");
}

async function createUserRole(payload: CreateUserRolePayload): Promise<ApiUserRole> {
  const res = await apiPost<ApiUserRole>("/user-roles", payload);
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Gán vai trò thất bại");
}

async function deleteUserRole(id: string): Promise<void> {
  const res = await apiDelete(`/user-roles/${id}`);
  if (res.data.status === "fail") {
    throw new Error(res.data.message || "Gỡ gán vai trò thất bại");
  }
}

// ─── Hooks ─────────────────────────────────────────────────────────────

export function useUserRolesList(
  params?: PaginationParams & { user_id?: string; role_id?: string }
) {
  return useQuery({
    queryKey: userRoleKeys.list(params),
    queryFn: () => fetchUserRolesList(params),
    staleTime: 1000 * 60 * 2,
    placeholderData: (previousData) => previousData,
  });
}

export function useUserRoleById(id: string | null | undefined) {
  return useQuery({
    queryKey: userRoleKeys.detail(id ?? ""),
    queryFn: () => fetchUserRoleById(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateUserRole(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userRoleKeys.all });
      options?.onSuccess?.();
    },
    onError: (error) => options?.onError?.(error),
  });
}

export function useDeleteUserRole(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userRoleKeys.all });
      options?.onSuccess?.();
    },
    onError: (error) => options?.onError?.(error),
  });
}