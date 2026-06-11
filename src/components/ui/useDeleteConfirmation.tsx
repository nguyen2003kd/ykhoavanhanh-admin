"use client";

import { useState, useCallback } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface UseDeleteConfirmationOptions {
  title?: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
}

export function useDeleteConfirmation({ title = "Xác nhận xóa", description = "Bạn có chắc muốn xóa mục này? Hành động này không thể hoàn tác.", confirmLabel = "Xóa", onConfirm }: UseDeleteConfirmationOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const ConfirmDialog = (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={close} disabled={isDeleting}>Hủy</Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? "Đang xóa..." : confirmLabel}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-gray-600">{description}</p>
    </Modal>
  );

  return { open, close, ConfirmDialog };
}
