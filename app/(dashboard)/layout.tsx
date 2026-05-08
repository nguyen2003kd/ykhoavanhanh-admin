"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { LoadingPage } from "@/components/ui/Spinner";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { hasAuthSession } from "@/lib/auth-session";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!hasAuthSession()) {
      router.replace("/auth/login");
      return;
    }
    setIsCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  if (isCheckingAuth) {
    return <LoadingPage />;
  }

  return (
    <ToastProvider>
      {/* Block access on screens smaller than lg */}
      <div className="flex lg:hidden h-dvh items-center justify-center bg-gradient-to-br from-primary-950 to-primary-900 p-8">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 shadow-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Yêu cầu màn hình lớn hơn</h2>
          <p className="mt-2 text-white/70 text-sm leading-relaxed">
            Hệ thống quản lý Y Khoa Vạn Hạnh yêu cầu màn hình máy tính hoặc laptop để sử dụng.
          </p>
        </div>
      </div>

      {/* Main layout for lg+ */}
      <div className="hidden lg:flex h-dvh overflow-hidden bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header onToggleSidebar={handleToggleSidebar} isSidebarOpen={isSidebarOpen} />
          <main className="flex-1 overflow-y-auto">
            <div className="px-8 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
