"use client";

import { AlertTriangle, Trash2, Pencil, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import type { ConfirmVariant, ConfirmDialogProps } from "./types";

const variantConfig: Record<
  ConfirmVariant,
  {
    icon: React.ElementType;
    ringClass: string;
    bgClass: string;
    iconClass: string;
    confirmVariant: "primary" | "danger" | "outline" | "ghost";
    defaultTitle: string;
    defaultDescription: string;
    defaultConfirmLabel: string;
  }
> = {
  delete: {
    icon: Trash2,
    ringClass: "ring-red-100",
    bgClass: "bg-red-50",
    iconClass: "text-red-600",
    confirmVariant: "danger",
    defaultTitle: "Xác nhận xóa",
    defaultDescription: "Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa không?",
    defaultConfirmLabel: "Xóa",
  },
  edit: {
    icon: Pencil,
    ringClass: "ring-blue-100",
    bgClass: "bg-blue-50",
    iconClass: "text-blue-600",
    confirmVariant: "primary",
    defaultTitle: "Xác nhận chỉnh sửa",
    defaultDescription: "Bạn có chắc chắn muốn lưu các thay đổi này không?",
    defaultConfirmLabel: "Lưu thay đổi",
  },
  warning: {
    icon: AlertTriangle,
    ringClass: "ring-amber-100",
    bgClass: "bg-amber-50",
    iconClass: "text-amber-600",
    confirmVariant: "primary",
    defaultTitle: "Cảnh báo",
    defaultDescription: "Bạn có chắc chắn muốn tiếp tục không?",
    defaultConfirmLabel: "Tiếp tục",
  },
  info: {
    icon: Info,
    ringClass: "ring-slate-100",
    bgClass: "bg-slate-50",
    iconClass: "text-slate-600",
    confirmVariant: "primary",
    defaultTitle: "Xác nhận",
    defaultDescription: "Bạn có chắc chắn muốn thực hiện hành động này không?",
    defaultConfirmLabel: "Xác nhận",
  },
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Hủy",
  variant = "info",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const resolvedTitle = title ?? config.defaultTitle;
  const resolvedDescription = description ?? config.defaultDescription;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[22rem] rounded-2xl border border-slate-100 bg-white p-0 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
        {/* Accessibility cho Radix Dialog */}
        <DialogHeader className="sr-only">
          <DialogTitle>{resolvedTitle}</DialogTitle>
          <DialogDescription>{resolvedDescription}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 px-6 pb-6 pt-8 text-center">
          {/* Icon với ring + scale animation */}
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl ${config.bgClass} ring-4 ${config.ringClass} transition-transform duration-300 ease-out hover:scale-105`}
          >
            <Icon className={`h-8 w-8 ${config.iconClass}`} strokeWidth={1.8} />
          </div>

          {/* Nội dung */}
          <div className="flex flex-col gap-1.5">
            <p className="text-lg font-semibold tracking-tight text-slate-900">
              {resolvedTitle}
            </p>
            <p className="text-sm leading-relaxed text-slate-500 max-w-[16rem]">
              {resolvedDescription}
            </p>
          </div>

          {/* Actions */}
          <div className="flex w-full gap-3 pt-1">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
            </DialogClose>

            <Button
              variant={config.confirmVariant}
              className="flex-1 h-11 rounded-xl shadow-sm shadow-slate-900/5 transition-all active:scale-[0.97]"
              isLoading={isLoading}
              onClick={onConfirm}
            >
              {confirmLabel ?? config.defaultConfirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
