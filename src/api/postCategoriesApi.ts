import { createApi } from "./createApi";

// ─── Types (theo api.md) ────────────────────────────────────────────────

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  created_by?: string | null;
  updated_at: string;
  updated_by?: string | null;
  deleted_at: string | null;
}

export interface PaginatedPostCategories {
  count: number;
  rows: PostCategory[];
  totalPages: number;
  currentPage: number;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  description?: string;
  parent_id?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {
  is_active?: boolean;
  updated_by?: string;
}

// ─── API Factory ────────────────────────────────────────────────────────

export const postCategoriesApi = createApi<PostCategory>("post-categories");

export const postCategoriesService = postCategoriesApi.service;
export const postCategoriesKeys = postCategoriesApi.keys;
export const postCategoriesHooks = postCategoriesApi.hooks;
