"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Toast, ToastType } from "./Toast";

interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, description?: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastType, title: string, description?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((title: string, desc?: string) => showToast("success", title, desc), [showToast]);
  const error = useCallback((title: string, desc?: string) => showToast("error", title, desc), [showToast]);
  const info = useCallback((title: string, desc?: string) => showToast("info", title, desc), [showToast]);
  const warning = useCallback((title: string, desc?: string) => showToast("warning", title, desc), [showToast]);

  const value = useMemo(() => ({ showToast, success, error, info, warning }), [showToast, success, error, info, warning]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pr-4">
        {toasts.map((t) => (
          <Toast key={t.id} type={t.type} title={t.title} description={t.description} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
