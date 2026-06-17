import {
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { apiGet } from "@/lib/axios";

// ─── HIS Service Type (khớp schema API trả về) ───────────────────────────

export interface HisService {
  id: string;           // alias của serviceid
  serviceid: string;
  servicetype: string;
  servicename: string;
  price: string;
  fromdate: string;
  insurancetype: string;
  description: string | null;
  updatetime: string;
}

// ─── Query Keys ───────────────────────────────────────────────────────────

const baseKey = "his-services";

export const hisServicesKeys = {
  all: [baseKey] as const,
  list: (params?: { ip?: string; idbv?: string }) =>
    [baseKey, "list", params] as const,
};

// ─── Service Functions ──────────────────────────────────────────────────────

export const hisServicesService = {
  /** Lấy danh sách dịch vụ từ HIS */
  getList: async (params?: { ip?: string; idbv?: string }): Promise<HisService[]> => {
    const res = await apiGet<HisService[]>("/his-services", { params });
    if (res.data.status === "success" && res.data.responseData) {
      return res.data.responseData.map((item) => ({ ...item, id: item.serviceid }));
    }
    throw new Error(res.data.message || "Không thể lấy danh sách dịch vụ");
  },
};

// ─── TanStack Query Hooks ───────────────────────────────────────────────────

export const hisServicesHooks = {
  useList: (
    params?: { ip?: string; idbv?: string },
    options?: { enabled?: boolean; staleTime?: number }
  ): UseQueryResult<HisService[], Error> => {
    return useQuery<HisService[], Error>({
      queryKey: hisServicesKeys.list(params),
      queryFn: () => hisServicesService.getList(params),
      staleTime: 1000 * 60 * 2,
      enabled: options?.enabled ?? true,
      ...options,
    });
  },
};
