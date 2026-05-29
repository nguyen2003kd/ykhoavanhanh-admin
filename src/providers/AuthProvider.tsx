"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { QueryProvider } from "@/providers";
import { useIsSignedIn, useAuthLoading } from "@/store/authStore";
import { useGetMyInfo as useFetchCurrentUser } from "@/api/authApi";

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthInitializer({ children }: AuthLayoutProps) {
  const router = useRouter();
  const isSignedIn = useIsSignedIn();
  const isLoading = useAuthLoading();
  // Fetch current user khi đã authenticated (dùng enabled option)
  const { isLoading: isLoadingUser } = useFetchCurrentUser(
    { enabled: isSignedIn }
  );

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      router.push("/auth/login");
    }
  }, [isSignedIn, isLoading, router]);

  if (isLoading || (isSignedIn && isLoadingUser)) {
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
  const isSignedIn = useIsSignedIn();
  const isLoading = useAuthLoading();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (!isLoading && isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, isLoading, router]);

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
