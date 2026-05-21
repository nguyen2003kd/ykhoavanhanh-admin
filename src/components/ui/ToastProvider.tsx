"use client"

import React from "react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/Toast"
import type { ToastType } from "@/components/ui/Toast"

export { Toaster }

// ── Backward-compat useToast hook ────────────────────────────────────────────

export function useToast() {
  const showToast = (type: ToastType, title: string, description?: string) => {
    toast[type](title, { description })
  }

  return {
    showToast,
    success: (title: string, description?: string) => toast.success(title, { description }),
    error:   (title: string, description?: string) => toast.error(title, { description }),
    info:    (title: string, description?: string) => toast.info(title, { description }),
    warning: (title: string, description?: string) => toast.warning(title, { description }),
  }
}

// ── Backward-compat ToastProvider ────────────────────────────────────────────
// Giữ component này để layout cũ không bị break.
// Chỉ cần đặt <Toaster /> trong layout là đủ (không cần wrap provider nữa).

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  )
}
