"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 5 minutes
            staleTime: 1000 * 60 * 5,
            // Keep unused data in cache for 10 minutes
            gcTime: 1000 * 60 * 10,
            // Don't refetch on window focus if data is fresh
            refetchOnWindowFocus: false,
            // Retry failed requests 3 times
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors
              if (typeof error === "object" && error !== null && "response" in error) {
                const response = (error as { response?: { status?: number } }).response;
                if (response?.status && response.status >= 400 && response.status < 500) {
                  return false;
                }
              }
              return failureCount < 3;
            },
            // Exponential backoff for retries
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // Don't retry mutations by default
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export { QueryClient };
