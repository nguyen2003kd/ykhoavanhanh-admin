// Shared API types

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; message: string };

export interface LoginPayload {
  identifier: string; // email hoặc username
  password: string;
}

export interface FilterParams {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
