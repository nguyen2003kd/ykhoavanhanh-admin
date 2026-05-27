"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { QueryProvider } from "@/providers";
import { useAuthStore, useIsAuthenticated, useAuthLoading } from "@/store/authStore";
import { useCurrentUser as useFetchCurrentUser } from "@/api/authApi";

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthInitializer({ children }: AuthLayoutProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const queryClient = useQueryClient();

  // Fetch current user when authenticated
  const { data: user, isLoading: isLoadingUser } = useFetchCurrentUser();

  useEffect(() => {
    // If we have tokens but no user data, skip - userService will handle it
    // If we're not authenticated and not loading, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking auth
  if (isLoading || (isAuthenticated && isLoadingUser)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}

export function AuthenticatedLayout({ children }: AuthLayoutProps) {
  return (
    <QueryProvider>
      <AuthInitializer>{children}</AuthInitializer>
    </QueryProvider>
  );
}

// Public layout wrapper (for login, register pages)
export function PublicLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}

// Main layout with QueryProvider
export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}
