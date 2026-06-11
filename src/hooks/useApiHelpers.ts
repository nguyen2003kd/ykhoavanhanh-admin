// Custom hooks for API integration patterns

import { useState, useEffect, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/store/toastStore";

/**
 * Debounced value hook for search inputs
 * Prevents excessive API calls while typing
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Abort controller hook for request cancellation
 * Prevents memory leaks and race conditions
 */
export function useAbortController() {
  const controllerRef = useRef<AbortController | null>(null);

  const createController = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    return controllerRef.current;
  }, []);

  const abort = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  useEffect(() => {
    return () => abort();
  }, [abort]);

  return { controller: controllerRef.current, createController, abort };
}

/**
 * Pagination state hook
 * Manages pagination state for list queries
 */
export function usePagination(defaultPage = 1, defaultLimit = 10) {
  const [page, setPage] = useState(defaultPage);
  const [limit, setLimit] = useState(defaultLimit);

  const reset = useCallback(() => {
    setPage(defaultPage);
    setLimit(defaultLimit);
  }, [defaultPage, defaultLimit]);

  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);

  return { page, limit, setPage, setLimit, reset, nextPage, prevPage };
}

/**
 * Optimistic update hook
 * Provides instant UI feedback before server response
 */
export function useOptimisticUpdate() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const optimisticUpdate = useCallback(
    async <R>(
      queryKey: readonly unknown[],
      optimisticFn: () => R,
      mutationFn: () => Promise<R>,
      options?: {
        successMessage?: string;
        errorMessage?: string;
        onSuccess?: (data: R) => void;
        onError?: (error: Error) => void;
      }
    ) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update
      queryClient.setQueryData(queryKey, optimisticFn);

      try {
        const data = await mutationFn();

        // Show success toast
        if (options?.successMessage) {
          toast.success(options.successMessage);
        }

        options?.onSuccess?.(data);
        return data;
      } catch (error) {
        // Rollback on error
        queryClient.setQueryData(queryKey, previousData);

        // Show error toast
        if (options?.errorMessage) {
          toast.error(options.errorMessage);
        }

        options?.onError?.(error as Error);
        throw error;
      }
    },
    [queryClient, toast]
  );

  return { optimisticUpdate };
}

/**
 * Infinite scroll hook
 * Combines pagination with infinite loading
 */
export function useInfiniteScroll<T>(
  fetchFn: (page: number, limit: number) => Promise<T[]>,
  options?: {
    limit?: number;
    onSuccess?: (data: T[]) => void;
    onError?: (error: Error) => void;
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const limit = options?.limit ?? 10;

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newData = await fetchFn(page, limit);
      setData((prev) => [...prev, ...newData]);
      setHasMore(newData.length === limit);
      setPage((p) => p + 1);
      options?.onSuccess?.(newData);
    } catch (error) {
      options?.onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, page, limit, isLoading, hasMore, options]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
  }, []);

  return { data, hasMore, isLoading, loadMore, reset };
}

/**
 * Local search filter hook
 * Filters data client-side for instant feedback
 */
export function useLocalSearch<T>(
  data: T[],
  searchFields: (keyof T | string)[],
  searchQuery: string
): T[] {
  if (!searchQuery.trim()) return data;

  const query = searchQuery.toLowerCase();

  return data.filter((item) =>
    searchFields.some((field) => {
      const value = item[field as keyof T];
      if (typeof value === "string") {
        return value.toLowerCase().includes(query);
      }
      return false;
    })
  );
}

/**
 * Retry with exponential backoff
 * Retries failed requests with increasing delay
 */
export async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetchFn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors
      if (
        "response" in (error as object) &&
        typeof (error as { response?: { status?: number } }).response?.status ===
          "number"
      ) {
        const status = (error as { response?: { status?: number } }).response
          ?.status;
        if (status && status >= 400 && status < 500) {
          throw error;
        }
      }

      // Wait before retrying
      const delay = initialDelay * Math.pow(2, attempt) + Math.random() * 100;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
