/**
 * Patient API - Patient Management
 */

import { apiGet, apiPost } from "@/lib/axios";
import type { Patient, SearchPatientParams, CreatePatientPayload } from "@/types/patient";
import { useQuery, useMutation } from "@tanstack/react-query";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface HisApiParams {
  ip?: string;
  idbv?: string;
}

export const patientKeys = {
  all: ["patients"] as const,
  lists: () => [...patientKeys.all, "list"] as const,
  list: (params: SearchPatientParams) => [...patientKeys.lists(), params] as const,
  details: () => [...patientKeys.all, "detail"] as const,
  detail: (patientId: string) => [...patientKeys.details(), patientId] as const,
  byCode: (code: string) => [...patientKeys.all, "byCode", code] as const,
  byPhone: (phone: string) => [...patientKeys.all, "byPhone", phone] as const,
};

// ─── Service Functions ─────────────────────────────────────────────────────

async function searchPatients(params: SearchPatientParams): Promise<Patient[]> {
  const res = await apiGet<Patient[]>("/patient", { params });
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Không thể tìm kiếm bệnh nhân");
}

async function getAllPatients(): Promise<Patient[]> {
  const res = await apiGet<Patient[]>("/patients");
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Không thể lấy danh sách bệnh nhân");
}

async function getPatientById(patientId: string): Promise<Patient> {
  const res = await apiGet<Patient>(`/patient/${patientId}`);
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Không thể lấy thông tin bệnh nhân");
}

async function createPatient(args: { payload: CreatePatientPayload; options?: HisApiParams }): Promise<Patient> {
  const { payload, options = {} } = args;
  const res = await apiPost<Patient>("/patient", payload, {
    params: {
      ip: options.ip ?? "",
      idbv: options.idbv ?? "",
    },
  });
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Tạo bệnh nhân thất bại");
}

// ─── Hooks ─────────────────────────────────────────────────────────────────

export function useSearchPatients(
  params: SearchPatientParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => searchPatients(params),
    staleTime: 1000 * 60 * 2,
    retry: 1,
    enabled: options?.enabled ?? true,
  });
}

export function useGetAllPatients() {
  return useQuery({
    queryKey: patientKeys.lists(),
    queryFn: getAllPatients,
    staleTime: 1000 * 60 * 2,
    retry: false,
  });
}

export function useGetPatientById(patientId: string | null | undefined) {
  return useQuery({
    queryKey: patientKeys.detail(patientId ?? ""),
    queryFn: () => getPatientById(patientId!),
    enabled: Boolean(patientId),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useCreatePatient(options?: {
  onSuccess?: (data: Patient) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: createPatient,
    onSuccess: (data) => options?.onSuccess?.(data),
    onError: (error) => options?.onError?.(error),
  });
}
