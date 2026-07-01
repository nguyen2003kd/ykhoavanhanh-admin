/**
 * Roles API - Role Management
 * Base path: /api/v1.0/roles
 */

import type { PaginatedResult } from "./createApi";
import type { PaginationParams } from "@/types/api-response";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ApiRole {
  id: string;
  role_name: string;
  description: string | null;
  receptionist: boolean;
  membership: boolean;
  marketing: boolean;
  accountant: boolean;
  customer_service: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateRolePayload {
  role_name: string;
  description?: string | null;
  receptionist?: boolean;
  membership?: boolean;
  marketing?: boolean;
  accountant?: boolean;
  customer_service?: boolean;
}

export interface UpdateRolePayload extends Partial<CreateRolePayload> {}

// ─── Query Keys ────────────────────────────────────────────────────────────────

const rolesBase = ["roles"] as const;

export const roleKeys = {
  all: rolesBase,
  list: (params?: PaginationParams) => [...rolesBase, "list", params] as const,
  detail: (id: string) => [...rolesBase, "detail", id] as const,
};

// ─── Service Functions ─────────────────────────────────────────────────────

async function fetchRolesList(params?: PaginationParams): Promise<PaginatedResult<ApiRole>> {
  const res = await apiGet<PaginatedResult<ApiRole>>("/roles", { params });
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Không thể lấy danh sách vai trò");
}

async function fetchRoleById(id: string): Promise<ApiRole> {
  const res = await apiGet<ApiRole>(`/roles/${id}`);
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Không thể lấy thông tin vai trò");
}

async function createRole(payload: CreateRolePayload): Promise<ApiRole> {
  const res = await apiPost<ApiRole>("/roles", payload);
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Tạo vai trò thất bại");
}

async function updateRole(id: string, payload: UpdateRolePayload): Promise<ApiRole> {
  const res = await apiPut<ApiRole>(`/roles/${id}`, payload);
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Cập nhật vai trò thất bại");
}

async function deleteRole(id: string): Promise<void> {
  const res = await apiDelete(`/roles/${id}`);
  if (res.data.status === "fail") {
    throw new Error(res.data.message || "Xóa vai trò thất bại");
  }
}

// ─── Hooks ─────────────────────────────────────────────────────────────

export function useRolesList(params?: PaginationParams) {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => fetchRolesList(params),
    staleTime: 1000 * 60 * 2,
    placeholderData: (previousData) => previousData,
  });
}

export function useRoleById(id: string | null | undefined) {
  return useQuery({
    queryKey: roleKeys.detail(id ?? ""),
    queryFn: () => fetchRoleById(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateRole(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      options?.onSuccess?.();
    },
    onError: (error) => options?.onError?.(error),
  });
}

export function useUpdateRole(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRolePayload }) =>
      updateRole(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(id) });
      options?.onSuccess?.();
    },
    onError: (error) => options?.onError?.(error),
  });
}

export function useDeleteRole(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      options?.onSuccess?.();
    },
    onError: (error) => options?.onError?.(error),
  });
}