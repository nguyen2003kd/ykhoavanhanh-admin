/* eslint-disable react-hooks/rules-of-hooks */
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/axios";
import type { PaginationParams } from "@/types/api-response";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  rows: T[];
  count: number;
  totalPages: number;
  currentPage: number;
}

// ─── Create API Factory ───────────────────────────────────────────────────

export function createApi<TEntity>(
  resource: string
) {
  const baseKey = resource;

  const keys = {
    all: [baseKey] as const,
    list: (params?: PaginationParams) => [baseKey, "list", params] as const,
    detail: (id: string) => [baseKey, "detail", id] as const,
  };

  // ─── Service Functions ───────────────────────────────────────────────────

  const service = {
    getList: async (params?: PaginationParams): Promise<PaginatedResult<TEntity>> => {
      const res = await apiGet<PaginatedResult<TEntity>>(`/${resource}`, { params });
      if (res.data.status === "success" && res.data.responseData) {
        return res.data.responseData;
      }
      throw new Error(res.data.message || `Không thể lấy danh sách ${resource}`);
    },

    getById: async (id: string): Promise<TEntity> => {
      const res = await apiGet<TEntity>(`/${resource}/${id}`);
      if (res.data.status === "success" && res.data.responseData) {
        return res.data.responseData;
      }
      throw new Error(res.data.message || `Không thể lấy ${resource}`);
    },

    create: async (data: Partial<TEntity>): Promise<TEntity> => {
      const res = await apiPost<TEntity>(`/${resource}`, data as Record<string, unknown>);
      if (res.data.status === "success" && res.data.responseData) {
        return res.data.responseData;
      }
      throw new Error(res.data.message || `Tạo ${resource} thất bại`);
    },

    update: async (id: string, data: Partial<TEntity>): Promise<TEntity> => {
      const res = await apiPut<TEntity>(`/${resource}/${id}`, data as Record<string, unknown>);
      if (res.data.status === "success" && res.data.responseData) {
        return res.data.responseData;
      }
      throw new Error(res.data.message || `Cập nhật ${resource} thất bại`);
    },

    patch: async (id: string, data: Partial<TEntity>): Promise<TEntity> => {
      const res = await apiPatch<TEntity>(`/${resource}/${id}`, data as Record<string, unknown>);
      if (res.data.status === "success" && res.data.responseData) {
        return res.data.responseData;
      }
      throw new Error(res.data.message || `Cập nhật ${resource} thất bại`);
    },

    remove: async (id: string): Promise<void> => {
      const res = await apiDelete(`/${resource}/${id}`);
      if (res.data.status === "fail") {
        throw new Error(res.data.message || `Xóa ${resource} thất bại`);
      }
    },
  };

  // ─── CRUD Hooks ────────────────────────────────────────────────────────

  const hooks = {
    useList: (
      params?: PaginationParams,
      options?: { enabled?: boolean; staleTime?: number }
    ): UseQueryResult<PaginatedResult<TEntity>, Error> => {
      return useQuery<PaginatedResult<TEntity>, Error>({
        queryKey: keys.list(params),
        queryFn: () => service.getList(params),
        staleTime: 1000 * 60 * 2,
        enabled: options?.enabled ?? true,
        ...options,
      });
    },

    useDetail: (
      id: string | null | undefined,
      options?: { enabled?: boolean; staleTime?: number }
    ): UseQueryResult<TEntity, Error> => {
      return useQuery<TEntity, Error>({
        queryKey: keys.detail(id ?? ""),
        queryFn: () => service.getById(id!),
        enabled: Boolean(id),
        staleTime: 1000 * 60 * 5,
        ...options,
      });
    },

    useCreate: (
      options?: UseMutationOptions<TEntity, Error, Partial<TEntity>>
    ) => {
      const qc = useQueryClient();
      return useMutation<TEntity, Error, Partial<TEntity>>({
        mutationFn: (data) => service.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
        ...options,
      });
    },

    useUpdate: (
      options?: UseMutationOptions<TEntity, Error, { id: string; data: Partial<TEntity> }>
    ) => {
      const qc = useQueryClient();
      return useMutation<TEntity, Error, { id: string; data: Partial<TEntity> }>({
        mutationFn: ({ id, data }) => service.update(id, data),
        onSuccess: (_, { id }) => {
          qc.invalidateQueries({ queryKey: keys.all });
          qc.invalidateQueries({ queryKey: keys.detail(id) });
        },
        ...options,
      });
    },

    usePatch: (
      options?: UseMutationOptions<TEntity, Error, { id: string; data: Partial<TEntity> }>
    ) => {
      const qc = useQueryClient();
      return useMutation<TEntity, Error, { id: string; data: Partial<TEntity> }>({
        mutationFn: ({ id, data }) => service.patch(id, data),
        onSuccess: (_, { id }) => {
          qc.invalidateQueries({ queryKey: keys.all });
          qc.invalidateQueries({ queryKey: keys.detail(id) });
        },
        ...options,
      });
    },

    useDelete: (
      options?: UseMutationOptions<void, Error, string>
    ) => {
      const qc = useQueryClient();
      return useMutation<void, Error, string>({
        mutationFn: (id) => service.remove(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
        ...options,
      });
    },
  };

  return { service, keys, hooks };
}
