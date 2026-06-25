/**
 * Exam Areas API — Khu vực khám
 * Resource: /exam-areas (DB nội bộ, có phân trang)
 */

import { createApi, type PaginatedResult } from "@/api/createApi";
import { api } from "@/lib/axios";
import type { PaginationParams } from "@/types/api-response";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ExamArea {
  id: string;
  code: string;
  name: string;
  short_name: string | null;
  address: string | null;
  phone: string | null;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  updated_at: string;
}

export type CreateExamAreaPayload = {
  code: string;
  name: string;
  short_name?: string;
  address?: string;
  phone?: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
};

export type UpdateExamAreaPayload = Partial<CreateExamAreaPayload>;

// ─── Create API via factory ────────────────────────────────────────────────

const { service, keys, hooks } = createApi<ExamArea>("exam-areas");

export const examAreasKeys = keys;
export const examAreasService = service;
export const examAreasHooks = hooks;

// ─── Export Excel ──────────────────────────────────────────────────────────

export async function exportExamAreas(params?: PaginationParams): Promise<Blob> {
  const res = await api.get<Blob>("/exam-areas/export", {
    params,
    responseType: "blob",
  });
  return res.data;
}

// Re-export PaginatedResult for convenience
export type { PaginatedResult };
