import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiDelete } from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────

export interface FileListResponse {
  images: string[];
  videos: string[];
  files: string[];
}

export interface UploadFileResponse {
  fileName: string;
  contentType: string;
  original: string;
}

// ─── Service Functions ──────────────────────────────────────────────────

const FILES_KEY = "files";

export const filesService = {
  getList: async (): Promise<FileListResponse> => {
    const res = await apiGet<FileListResponse>("/files");
    if (res.data.status === "success" && res.data.responseData) {
      return res.data.responseData;
    }
    throw new Error(res.data.message || "Không thể lấy danh sách file");
  },

  upload: async (file: File): Promise<UploadFileResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiPost<UploadFileResponse>("/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.status === "success" && res.data.responseData) {
      return res.data.responseData;
    }
    throw new Error(res.data.message || "Upload file thất bại");
  },

  remove: async (filePath: string): Promise<void> => {
    const res = await apiDelete<void>(`/files?path=${encodeURIComponent(filePath)}`);
    if (res.data.status === "fail") {
      throw new Error(res.data.message || "Xóa file thất bại");
    }
  },
};

// ─── Hooks ────────────────────────────────────────────────────────────────

export const filesKeys = {
  all: [FILES_KEY] as const,
  list: () => [FILES_KEY, "list"] as const,
};

export const filesHooks = {
  useList: (options?: { enabled?: boolean; staleTime?: number }) => {
    return useQuery<FileListResponse, Error>({
      queryKey: filesKeys.list(),
      queryFn: () => filesService.getList(),
      staleTime: 1000 * 60 * 2,
      enabled: options?.enabled ?? true,
      ...options,
    });
  },

  useUpload: (
    options?: {
      onSuccess?: (data: UploadFileResponse) => void;
      onError?: (err: Error) => void;
    }
  ) => {
    const qc = useQueryClient();
    return useMutation<UploadFileResponse, Error, File>({
      mutationFn: (file) => filesService.upload(file),
      onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: filesKeys.all });
        options?.onSuccess?.(data);
      },
      onError: (err) => {
        options?.onError?.(err);
      },
    });
  },

  useDelete: (
    options?: {
      onSuccess?: () => void;
      onError?: (err: Error) => void;
    }
  ) => {
    const qc = useQueryClient();
    return useMutation<void, Error, string>({
      mutationFn: (filePath) => filesService.remove(filePath),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: filesKeys.all });
        options?.onSuccess?.();
      },
      onError: (err) => {
        options?.onError?.(err);
      },
    });
  },
};
