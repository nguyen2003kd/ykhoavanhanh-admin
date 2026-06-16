import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { apiGet, apiPost, apiDelete } from "@/lib/axios";
// ─── HIS Doctor Type (khớp schema API trả về) ───────────────────────────

export interface HisDoctor {
  id: string;         // alias của doctorid (để khớp HospitalCrudPage constraint)
  doctorid: string;
  doctorname: string;
  description: string | null;
  updatetime: string;
}

// ─── Query Keys ───────────────────────────────────────────────────────────

const baseKey = "doctors";

export const doctorsKeys = {
  all: [baseKey] as const,
  list: (params?: { ip?: string; idbv?: string }) =>
    [baseKey, "list", params] as const,
  detail: (id: string) => [baseKey, "detail", id] as const,
};

// ─── Service Functions ──────────────────────────────────────────────────────

export const doctorsService = {
  /** Lấy danh sách bác sĩ từ HIS (không phân trang) */
  getList: async (params?: { ip?: string; idbv?: string }): Promise<HisDoctor[]> => {
    const res = await apiGet<HisDoctor[]>("/doctors", { params });
    if (res.data.status === "success" && res.data.responseData) {
      return res.data.responseData.map((item) => ({ ...item, id: item.doctorid }));
    }
    throw new Error(res.data.message || "Không thể lấy danh sách bác sĩ");
  },

  /** Lấy chi tiết một bác sĩ */
  getById: async (id: string): Promise<HisDoctor> => {
    const res = await apiGet<HisDoctor>(`/doctors/${id}`);
    if (res.data.status === "success" && res.data.responseData) {
      const item = res.data.responseData;
      return { ...item, id: item.doctorid };
    }
    throw new Error(res.data.message || "Không thể lấy thông tin bác sĩ");
  },

  /** Tạo bác sĩ mới (forward sang HIS) */
  create: async (data: Partial<HisDoctor>): Promise<HisDoctor> => {
    const res = await apiPost<HisDoctor>("/doctors", data as Record<string, unknown>);
    if (res.data.status === "success" && res.data.responseData) {
      const item = res.data.responseData;
      return { ...item, id: item.doctorid };
    }
    throw new Error(res.data.message || "Tạo bác sĩ thất bại");
  },

  /** Xóa bác sĩ */
  remove: async (id: string): Promise<void> => {
    const res = await apiDelete(`/doctors/${id}`);
    if (res.data.status === "fail") {
      throw new Error(res.data.message || "Xóa bác sĩ thất bại");
    }
  },
};

// ─── TanStack Query Hooks ───────────────────────────────────────────────────

export const doctorsHooks = {
  useList: (
    params?: { ip?: string; idbv?: string },
    options?: { enabled?: boolean; staleTime?: number }
  ): UseQueryResult<HisDoctor[], Error> => {
    return useQuery<HisDoctor[], Error>({
      queryKey: doctorsKeys.list(params),
      queryFn: () => doctorsService.getList(params),
      staleTime: 1000 * 60 * 2,
      enabled: options?.enabled ?? true,
      ...options,
    });
  },

  useDetail: (
    id: string | null | undefined,
    options?: { enabled?: boolean; staleTime?: number }
  ): UseQueryResult<HisDoctor, Error> => {
    return useQuery<HisDoctor, Error>({
      queryKey: doctorsKeys.detail(id ?? ""),
      queryFn: () => doctorsService.getById(id!),
      enabled: Boolean(id),
      staleTime: 1000 * 60 * 5,
      ...options,
    });
  },

  useCreate: (
    options?: UseMutationOptions<HisDoctor, Error, Partial<HisDoctor>>
  ) => {
    const qc = useQueryClient();
    return useMutation<HisDoctor, Error, Partial<HisDoctor>>({
      mutationFn: (data) => doctorsService.create(data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: doctorsKeys.all });
      },
      ...options,
    });
  },

  useDelete: (
    options?: UseMutationOptions<void, Error, string>
  ) => {
    const qc = useQueryClient();
    return useMutation<void, Error, string>({
      mutationFn: (id) => doctorsService.remove(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: doctorsKeys.all });
      },
      ...options,
    });
  },
};
