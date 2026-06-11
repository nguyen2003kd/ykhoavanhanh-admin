/* eslint-disable react-hooks/rules-of-hooks */
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { PaginationParams } from "@/types/api-response";
import { apiGet, apiPost, apiDelete } from "@/lib/axios";

export interface ChatDataItem {
  id: string;
  title: string;
  content: string;
  fileType: string;
  htmlContent: string;
  imageCount: number;
  date: string;
}

export interface CreateChatDataPayload {
  title: string;
  content: string;
  fileType: string;
  htmlContent: string;
  imageCount: number;
}

const baseKey = "chatData";
const resource = "api/v1.0/chatData";

export const chatDataKeys = {
  all: [baseKey] as const,
  list: (params?: PaginationParams) => [baseKey, "list", params] as const,
  detail: (id: string) => [baseKey, "detail", id] as const,
};

export const chatDataService = {
  getList: async (params?: PaginationParams): Promise<ChatDataItem[]> => {
    const res = await apiGet<ChatDataItem[]>(`/${resource}`, { params });
    if (res.data.status === "success" && res.data.responseData) {
      return res.data.responseData;
    }
    throw new Error(res.data.message || "Không thể lấy danh sách chatData");
  },

  create: async (data: CreateChatDataPayload): Promise<ChatDataItem> => {
    const res = await apiPost<ChatDataItem>(`/${resource}`, data as unknown as Record<string, unknown>);
    if (res.data.status === "success" && res.data.responseData) {
      return res.data.responseData;
    }
    throw new Error(res.data.message || "Tạo chatData thất bại");
  },

  remove: async (id: string): Promise<unknown> => {
    const res = await apiDelete<unknown>(`/${resource}/${id}`);
    if (res.data.status === "success") {
      return res.data.responseData;
    }
    throw new Error(res.data.message || "Xóa chatData thất bại");
  },
};

export const chatDataHooks = {
  useList: (
    params?: PaginationParams,
    options?: { enabled?: boolean; staleTime?: number }
  ): UseQueryResult<ChatDataItem[], Error> => {
    return useQuery<ChatDataItem[], Error>({
      queryKey: chatDataKeys.list(params),
      queryFn: () => chatDataService.getList(params),
      staleTime: 1000 * 60 * 2,
      enabled: options?.enabled ?? true,
      ...options,
    });
  },

  useCreate: (
    options?: UseMutationOptions<ChatDataItem, Error, CreateChatDataPayload>
  ) => {
    const qc = useQueryClient();
    return useMutation<ChatDataItem, Error, CreateChatDataPayload>({
      mutationFn: (data) => chatDataService.create(data),
      onSuccess: () => qc.invalidateQueries({ queryKey: chatDataKeys.all }),
      ...options,
    });
  },

  useDelete: (
    options?: UseMutationOptions<unknown, Error, string>
  ) => {
    const qc = useQueryClient();
    return useMutation<unknown, Error, string>({
      mutationFn: (id) => chatDataService.remove(id),
      onSuccess: () => qc.invalidateQueries({ queryKey: chatDataKeys.all }),
      ...options,
    });
  },
};

export const ChatDataApi = {
  service: chatDataService,
  keys: chatDataKeys,
  hooks: chatDataHooks,
};

export default ChatDataApi;
