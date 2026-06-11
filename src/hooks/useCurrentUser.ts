"use client";

import { useGetMyInfo } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";

/**
 * Hook: auto-fetch current user từ API và gắn vào store.
 * - `user` = data từ API (ưu tiên), fallback về store cache
 * - `isLoading` = đang fetch
 * - `isError` = fetch thất bại
 * `getMyInfo` đã tự gọi `setUser()` bên trong
 */
export function useCurrentUserWithSync() {
  const storeUser = useAuthStore((state) => state.user);
  const { data, isLoading, isError } = useGetMyInfo();

  return {
    user: data ?? storeUser,
    isLoading,
    isError,
  };
}
