import {
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { apiGet } from "@/lib/axios";

// ─── HIS Room Type (khớp schema API trả về) ───────────────────────────

export interface HisRoom {
  id: string;           // alias của roomid
  roomid: string;
  roomname: string;
  description: string | null;
  updatetime: string;
  mavp: string;
}

// ─── Query Keys ───────────────────────────────────────────────────────────

const baseKey = "rooms";

export const roomsKeys = {
  all: [baseKey] as const,
  list: (params?: { ip?: string; idbv?: string }) =>
    [baseKey, "list", params] as const,
};

// ─── Service Functions ──────────────────────────────────────────────────────

export const roomsService = {
  /** Lấy danh sách phòng khám từ HIS */
  getList: async (params?: { ip?: string; idbv?: string }): Promise<HisRoom[]> => {
    const res = await apiGet<HisRoom[]>("/rooms", { params });
    if (res.data.status === "success" && res.data.responseData) {
      return res.data.responseData.map((item) => ({ ...item, id: item.roomid }));
    }
    throw new Error(res.data.message || "Không thể lấy danh sách phòng khám");
  },
};

// ─── TanStack Query Hooks ───────────────────────────────────────────────────

export const roomsHooks = {
  useList: (
    params?: { ip?: string; idbv?: string },
    options?: { enabled?: boolean; staleTime?: number }
  ): UseQueryResult<HisRoom[], Error> => {
    return useQuery<HisRoom[], Error>({
      queryKey: roomsKeys.list(params),
      queryFn: () => roomsService.getList(params),
      staleTime: 1000 * 60 * 2,
      enabled: options?.enabled ?? true,
      ...options,
    });
  },
};
