"use client";

import { cn } from "@/lib/utils";
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiXCircle, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  type: ToastType;
  title: string;
  description?: string;
  onClose: () => void;
}

export function Toast({ type, title, description, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => { setTimeout(() => setIsVisible(true), 10); }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const config = {
    success: { icon: <FiCheckCircle className="w-5 h-5" />, bg: "bg-green-50", border: "border-green-200", icon_: "text-green-600", title_: "text-green-900", desc_: "text-green-700" },
    error: { icon: <FiXCircle className="w-5 h-5" />, bg: "bg-red-50", border: "border-red-200", icon_: "text-red-600", title_: "text-red-900", desc_: "text-red-700" },
    warning: { icon: <FiAlertTriangle className="w-5 h-5" />, bg: "bg-yellow-50", border: "border-yellow-200", icon_: "text-yellow-600", title_: "text-yellow-900", desc_: "text-yellow-700" },
    info: { icon: <FiInfo className="w-5 h-5" />, bg: "bg-primary-50", border: "border-primary-200", icon_: "text-primary-600", title_: "text-primary-900", desc_: "text-primary-700" },
  };
  const c = config[type];

  return (
    <div className={cn("w-full rounded-lg border shadow-lg p-4 transition-all duration-300 transform", c.bg, c.border, isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0")}>
      <div className="flex items-start gap-3">
        <div className={cn("flex-shrink-0", c.icon_)}>{c.icon}</div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-semibold", c.title_)}>{title}</p>
          {description && <p className={cn("text-sm mt-1", c.desc_)}>{description}</p>}
        </div>
        <button onClick={handleClose} className={cn("flex-shrink-0 rounded-md p-1 hover:bg-black hover:bg-opacity-10 transition-colors", c.icon_)}>
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
