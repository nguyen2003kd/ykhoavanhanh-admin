/**
 * HIS API - Hospital Information System
 */

import { apiGet } from "@/lib/axios";
import { createApi } from "./createApi";
import { useQuery } from "@tanstack/react-query";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface Doctor {
  id: string;
  name?: string;
  full_name?: string;
  specialty?: string;
  room?: string;
  avatar?: string;
}

export interface Room {
  id: string;
  name?: string;
  code?: string;
  specialty?: string;
  floor?: string;
}

export interface HisService {
  id: string;
  name?: string;
  code?: string;
  price?: number;
  description?: string;
}

// ─── Query Keys ────────────────────────────────────────────────────────────────

const hisServiceBase = ["his-services"] as const;

export const hisServiceKeys = {
  all: hisServiceBase,
  list: () => [...hisServiceBase, "list"] as const,
};

// ─── API Factories ──────────────────────────────────────────────────────────

export const doctorApi = createApi<Doctor>("doctors");
export const roomApi = createApi<Room>("rooms");

// Custom HIS Service (non-paginated)
async function fetchHisServices(): Promise<HisService[]> {
  const res = await apiGet<HisService[]>("/his-services");
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Không thể lấy danh sách dịch vụ");
}

export function useHisServices() {
  return useQuery({
    queryKey: hisServiceKeys.list(),
    queryFn: fetchHisServices,
    staleTime: 1000 * 60 * 10,
  });
}

// ─── Convenience Exports ──────────────────────────────────────────────────

export const useDoctors = doctorApi.hooks.useList;
export const useDoctor = doctorApi.hooks.useDetail;
export const useCreateDoctor = doctorApi.hooks.useCreate;
export const useUpdateDoctor = doctorApi.hooks.useUpdate;
export const useDeleteDoctor = doctorApi.hooks.useDelete;

export const useRooms = roomApi.hooks.useList;
export const useRoom = roomApi.hooks.useDetail;
export const useCreateRoom = roomApi.hooks.useCreate;
export const useUpdateRoom = roomApi.hooks.useUpdate;
export const useDeleteRoom = roomApi.hooks.useDelete;
