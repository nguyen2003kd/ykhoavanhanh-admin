import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiPatch, apiDelete, api } from "@/lib/axios";
import { createApi } from "./createApi";
import type { ApiFile } from "@/components/shares/rich-text-editor/types/types";
import type { PostCategory } from "./postCategoriesApi";

// ─── Types riêng cho Posts (theo api.md) ─────────────────────────────────

export interface PostMedia {
  id: string;
  post_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  media_type: "THUMBNAIL" | "CONTENT" | "GALLERY";
  alt_text?: string;
  sort_order: number;
  url?: string;
  created_at: string;
}

export interface Post {
  id: string;
  name: string;
  description?: string;
  content?: string;
  thumbnail_path?: string;
  img_path?: string[];
  slug?: string;
  status: "DRAFT" | "PUBLISHED" | "HIDDEN" | "ARCHIVED";
  is_featured: boolean;
  view_count: number;
  category_id?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  category?: PostCategory;
  post_media?: PostMedia[];
}

export interface PaginatedPosts {
  count: number;
  rows: Post[];
  totalPages: number;
  currentPage: number;
}

export interface PostQuery {
  currentPage?: number;
  pageSize?: number;
  category_id?: string;
  status?: Post["status"];
  is_featured?: boolean;
  search?: string;
  sort_by?: "created_at" | "published_at" | "view_count";
  sort_order?: "ASC" | "DESC";
}

export interface CreatePostPayload {
  name: string;
  description?: string;
  content?: string;
  category_id?: string;
  slug?: string;
  thumbnail_path?: string;
  status?: Post["status"];
  is_featured?: boolean;
  published_at?: string;
}

export interface UpdatePostPayload extends Partial<CreatePostPayload> {}

// ─── CRUD factory ──────────────────────────────────────────────────────────

const { service: baseService, hooks: baseHooks, keys } = createApi<Post>("posts");

// ─── Media upload service (multipart/form-data) ───────────────────────────

export const postsMediaService = {
  upload: async (
    postId: string,
    file: File,
    options?: { media_type?: PostMedia["media_type"]; alt_text?: string }
  ): Promise<PostMedia> => {
    const formData = new FormData();
    formData.append("file", file);
    if (options?.media_type) formData.append("media_type", options.media_type);
    if (options?.alt_text) formData.append("alt_text", options.alt_text);

    const res = await api.post(`/posts/${postId}/media`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.status === "success" && res.data.responseData) {
      return res.data.responseData;
    }
    throw new Error(res.data.message || "Upload media thất bại");
  },

  uploadMultiple: async (
    postId: string,
    files: File[],
    options?: { media_type?: PostMedia["media_type"]; alt_text?: string }
  ): Promise<PostMedia[]> => {
    return Promise.all(
      files.map((file) => postsMediaService.upload(postId, file, options))
    );
  },

  remove: async (postId: string, mediaId: string): Promise<void> => {
    const res = await apiDelete(`/posts/${postId}/media/${mediaId}`);
    if (res.data.status === "fail") {
      throw new Error(res.data.message || "Xoá media thất bại");
    }
  },
};

// ─── Enrich service với custom methods ────────────────────────────────────

export const postsService = {
  ...baseService,
  getList: async (params?: PostQuery): Promise<PaginatedPosts> => {
    const res = await apiGet<PaginatedPosts>("/posts", { params });
    if (res.data.status === "success" && res.data.responseData) {
      return res.data.responseData;
    }
    throw new Error(res.data.message || "Không thể lấy danh sách tin tức");
  },

  getById: async (id: string): Promise<Post> => {
    const res = await apiGet<Post>(`/posts/${id}`);
    if (res.data.status === "success" && res.data.responseData) {
      return res.data.responseData;
    }
    throw new Error(res.data.message || "Không thể lấy tin tức");
  },

  create: async (data: CreatePostPayload): Promise<Post> => {
    const res = await apiPost<Post>("/posts", data);
    if (res.data.status === "success" && res.data.responseData) {
      return res.data.responseData;
    }
    throw new Error(res.data.message || "Tạo tin tức thất bại");
  },

  update: async (id: string, data: UpdatePostPayload): Promise<Post> => {
    const res = await apiPut<Post>(`/posts/${id}`, data);
    if (res.data.status === "success" && res.data.responseData) {
      return res.data.responseData;
    }
    throw new Error(res.data.message || "Cập nhật tin tức thất bại");
  },

  patch: async (id: string, data: UpdatePostPayload): Promise<Post> => {
    const res = await apiPatch<Post>(`/posts/${id}`, data);
    if (res.data.status === "success" && res.data.responseData) {
      return res.data.responseData;
    }
    throw new Error(res.data.message || "Cập nhật tin tức thất bại");
  },

  remove: async (id: string): Promise<void> => {
    const res = await apiDelete(`/posts/${id}`);
    if (res.data.status === "fail") {
      throw new Error(res.data.message || "Xóa tin tức thất bại");
    }
  },

  // Editor file upload helper — trả về ApiFile[] để khớp TextEditor interface
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uploadEditorFile: async (_file: File): Promise<ApiFile & { url: string }> => {
    throw new Error("Vui lòng truyền postId khi upload cho bài viết đã lưu");
  },

  uploadEditorFileForPost: async (
    postId: string,
    file: File
  ): Promise<ApiFile & { url: string }> => {
    const media = await postsMediaService.upload(postId, file, { media_type: "CONTENT" });
    return {
      _id: media.id,
      path: media.file_path,
      original: media.file_path,
      mime: media.file_type,
      compress_info: {},
      url: media.url ?? media.file_path,
    };
  },
};

// ─── Query Keys (export để reuse) ─────────────────────────────────────────

export const postsKeys = keys;

// ─── Enrich hooks với custom mutation signatures ────────────────────────────

export const postsHooks = {
  ...baseHooks,

  useList: (
    params?: PostQuery,
    options?: { enabled?: boolean; staleTime?: number }
  ): UseQueryResult<PaginatedPosts, Error> => {
    return useQuery<PaginatedPosts, Error>({
      queryKey: postsKeys.list(params),
      queryFn: () => postsService.getList(params),
      staleTime: 1000 * 60 * 2,
      enabled: options?.enabled ?? true,
      ...options,
    });
  },

  useDetail: (
    id: string | null | undefined,
    options?: { enabled?: boolean; staleTime?: number }
  ): UseQueryResult<Post, Error> => {
    return useQuery<Post, Error>({
      queryKey: postsKeys.detail(id ?? ""),
      queryFn: () => postsService.getById(id!),
      enabled: Boolean(id),
      staleTime: 1000 * 60 * 5,
      ...options,
    });
  },

  useCreate: (
    options?: UseMutationOptions<Post, Error, CreatePostPayload>
  ) => {
    const qc = useQueryClient();
    const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = options ?? {};
    return useMutation<Post, Error, CreatePostPayload>({
      mutationFn: (data) => postsService.create(data),
      onSuccess: (data, variables, context) => {
        qc.invalidateQueries({ queryKey: postsKeys.all });
        (userOnSuccess as unknown as undefined | ((d: typeof data, v: typeof variables, c: typeof context) => unknown))?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        (userOnError as unknown as undefined | ((e: typeof error, v: typeof variables, c: typeof context) => unknown))?.(error, variables, context);
      },
      ...rest,
    });
  },

  useUpdate: (
    options?: UseMutationOptions<Post, Error, { id: string; data: UpdatePostPayload }>
  ) => {
    const qc = useQueryClient();
    const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = options ?? {};
    return useMutation<Post, Error, { id: string; data: UpdatePostPayload }>({
      mutationFn: ({ id, data }) => postsService.update(id, data),
      onSuccess: (data, variables, context) => {
        qc.invalidateQueries({ queryKey: postsKeys.all });
        qc.invalidateQueries({ queryKey: postsKeys.detail(variables.id) });
        (userOnSuccess as unknown as undefined | ((d: typeof data, v: typeof variables, c: typeof context) => unknown))?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        (userOnError as unknown as undefined | ((e: typeof error, v: typeof variables, c: typeof context) => unknown))?.(error, variables, context);
      },
      ...rest,
    });
  },

  usePatch: (
    options?: UseMutationOptions<Post, Error, { id: string; data: UpdatePostPayload }>
  ) => {
    const qc = useQueryClient();
    const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = options ?? {};
    return useMutation<Post, Error, { id: string; data: UpdatePostPayload }>({
      mutationFn: ({ id, data }) => postsService.patch(id, data),
      onSuccess: (data, variables, context) => {
        qc.invalidateQueries({ queryKey: postsKeys.all });
        qc.invalidateQueries({ queryKey: postsKeys.detail(variables.id) });
        (userOnSuccess as unknown as undefined | ((d: typeof data, v: typeof variables, c: typeof context) => unknown))?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        (userOnError as unknown as undefined | ((e: typeof error, v: typeof variables, c: typeof context) => unknown))?.(error, variables, context);
      },
      ...rest,
    });
  },

  useDelete: (
    options?: UseMutationOptions<void, Error, string>
  ) => {
    const qc = useQueryClient();
    const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = options ?? {};
    return useMutation<void, Error, string>({
      mutationFn: (id) => postsService.remove(id),
      onSuccess: (data, variables, context) => {
        qc.invalidateQueries({ queryKey: postsKeys.all });
        (userOnSuccess as unknown as undefined | ((d: typeof data, v: typeof variables, c: typeof context) => unknown))?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        (userOnError as unknown as undefined | ((e: typeof error, v: typeof variables, c: typeof context) => unknown))?.(error, variables, context);
      },
      ...rest,
    });
  },

  useUploadMedia: (
    postId: string,
    options?: UseMutationOptions<PostMedia, Error, { file: File; media_type?: PostMedia["media_type"]; alt_text?: string }>
  ) => {
    const qc = useQueryClient();
    const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = options ?? {};
    return useMutation<PostMedia, Error, { file: File; media_type?: PostMedia["media_type"]; alt_text?: string }>({
      mutationFn: ({ file, ...payload }) => postsMediaService.upload(postId, file, payload),
      onSuccess: (data, variables, context) => {
        qc.invalidateQueries({ queryKey: postsKeys.detail(postId) });
        (userOnSuccess as unknown as undefined | ((d: typeof data, v: typeof variables, c: typeof context) => unknown))?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        (userOnError as unknown as undefined | ((e: typeof error, v: typeof variables, c: typeof context) => unknown))?.(error, variables, context);
      },
      ...rest,
    });
  },

  useDeleteMedia: (
    postId: string,
    options?: UseMutationOptions<void, Error, string>
  ) => {
    const qc = useQueryClient();
    const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = options ?? {};
    return useMutation<void, Error, string>({
      mutationFn: (mediaId) => postsMediaService.remove(postId, mediaId),
      onSuccess: (data, variables, context) => {
        qc.invalidateQueries({ queryKey: postsKeys.detail(postId) });
        (userOnSuccess as unknown as undefined | ((d: typeof data, v: typeof variables, c: typeof context) => unknown))?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        (userOnError as unknown as undefined | ((e: typeof error, v: typeof variables, c: typeof context) => unknown))?.(error, variables, context);
      },
      ...rest,
    });
  },
};
