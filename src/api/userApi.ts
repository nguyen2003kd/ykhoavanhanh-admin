import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/axios";
import { queryKeys, PaginationParams, User, ApiResponse } from "@/types/api-response";

// Types
interface UsersResponse extends ApiResponse<{
  count: number;
  rows: User[];
  totalPages: number;
  currentPage: number;
}> {}

interface UserResponse extends ApiResponse<User> {}

// User Service
export const userService = {
  // Get paginated list of users
  getUsers: async (params?: PaginationParams): Promise<{
    count: number;
    rows: User[];
    totalPages: number;
    currentPage: number;
  }> => {
    const response = await apiGet<{
      count: number;
      rows: User[];
      totalPages: number;
      currentPage: number;
    }>("/users", { params });
    
    if (response.data.status === "success" && response.data.responseData) {
      return response.data.responseData;
    }
    throw new Error(response.data.message || "Không thể lấy danh sách người dùng");
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await apiGet<User>(`/users/${id}`);
    if (response.data.status === "success" && response.data.responseData) {
      return response.data.responseData;
    }
    throw new Error(response.data.message || "Không thể lấy thông tin người dùng");
  },

  // Update user
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiPut<User>(`/users/${id}`, data);
    if (response.data.status === "success" && response.data.responseData) {
      return response.data.responseData;
    }
    throw new Error(response.data.message || "Cập nhật thất bại");
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    const response = await apiDelete(`/users/${id}`);
    if (response.data.status === "fail") {
      throw new Error(response.data.message || "Xóa người dùng thất bại");
    }
  },
};

// TanStack Query Hooks
export function useUsers(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => userService.getUsers(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useUser(userId: string | null) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId || ""),
    queryFn: () => userService.getUserById(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userService.updateUser(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate both list and detail cache
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
