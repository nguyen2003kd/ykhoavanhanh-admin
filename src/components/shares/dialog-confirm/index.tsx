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
    iconClass: string;
    bgClass: string;
    confirmVariant: "primary" | "danger" | "outline" | "ghost";
    defaultTitle: string;
    defaultDescription: string;
    defaultConfirmLabel: string;
  }
> = {
  delete: {
    icon: Trash2,
    iconClass: "text-red-600",
    bgClass: "bg-red-50",
    confirmVariant: "danger",
    defaultTitle: "Xác nhận xóa",
    defaultDescription: "Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa không?",
    defaultConfirmLabel: "Xóa",
  },
  edit: {
    icon: Pencil,
    iconClass: "text-blue-600",
    bgClass: "bg-blue-50",
    confirmVariant: "primary",
    defaultTitle: "Xác nhận chỉnh sửa",
    defaultDescription: "Bạn có chắc chắn muốn lưu các thay đổi này không?",
    defaultConfirmLabel: "Lưu thay đổi",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-yellow-600",
    bgClass: "bg-yellow-50",
    confirmVariant: "primary",
    defaultTitle: "Cảnh báo",
    defaultDescription: "Bạn có chắc chắn muốn tiếp tục không?",
    defaultConfirmLabel: "Tiếp tục",
  },
  info: {
    icon: Info,
    iconClass: "text-gray-600",
    bgClass: "bg-gray-50",
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
      <DialogContent className="max-w-sm">
        {/* Accessibility cho Radix Dialog */}
        <DialogHeader className="sr-only">
          <DialogTitle>{resolvedTitle}</DialogTitle>
          <DialogDescription>{resolvedDescription}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2 text-center">
          {/* Icon */}
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full ${config.bgClass}`}
          >
            <Icon className={`h-7 w-7 ${config.iconClass}`} />
          </div>

          {/* Nội dung hiển thị */}
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold text-gray-900">{resolvedTitle}</p>
            <p className="text-sm text-gray-500">{resolvedDescription}</p>
          </div>

          {/* Actions */}
          <div className="flex w-full gap-3 pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1" disabled={isLoading}>
                {cancelLabel}
              </Button>
            </DialogClose>

            <Button
              variant={config.confirmVariant}
              className="flex-1"
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
