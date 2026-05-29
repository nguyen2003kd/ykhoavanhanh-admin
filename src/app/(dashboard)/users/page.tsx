"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { TablePagination } from "@/components/ui/TablePagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Spinner, LoadingSpinner } from "@/components/ui/Spinner";
import { toast } from "@/components/ui/Toast";
import { useUsersList, useDeleteUser, mapApiUserToUser } from "@/api/userApi";
import type { User } from "@/types/api-response";
import { formatDate } from "@/lib/utils";
import { Plus, RefreshCw, Trash2, Eye } from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

// ─── Components ─────────────────────────────────────────────────────────────

interface DeleteConfirmationProps {
  userName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteConfirmation({
  userName,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmationProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Xác nhận xóa</CardTitle>
          <CardDescription>
            Bạn có chắc chắn muốn xóa người dùng <strong>{userName}</strong>? Hành động này không thể hoàn tác.
          </CardDescription>
        </CardHeader>
        <div className="flex justify-end gap-3 px-6 pb-6">
          <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            isLoading={isDeleting}
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-destructive/10">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">Đã xảy ra lỗi</h3>
        <p className="mb-4 text-sm text-muted-foreground">{error.message}</p>
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw data-icon="inline-start" className="size-4" />
          Thử lại
        </Button>
      </div>
    </Card>
  );
}

interface EmptyStateProps {
  onCreateUser: () => void;
}

function EmptyState({ onCreateUser }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-muted">
          <span className="text-2xl">👤</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">Chưa có người dùng</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Bắt đầu bằng cách thêm người dùng admin đầu tiên.
        </p>
        <Button variant="primary" onClick={onCreateUser}>
          <Plus data-icon="inline-start" className="size-4" />
          Thêm người dùng
        </Button>
      </div>
    </Card>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function UsersPage() {
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Query params
  const params = {
    currentPage,
    pageSize: PAGE_SIZE,
  };

  // Data fetching
  const { data, isLoading, isFetching, error, refetch } = useUsersList(params);

  // Mutations
  const deleteMutation = useDeleteUser({
    onSuccess: () => {
      toast.success("Xóa người dùng thành công");
      setDeleteTarget(null);
    },
    onError: (err) => {
      toast.error(err.message || "Xóa người dùng thất bại");
    },
  });

  // Handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleDeleteClick = useCallback((id: string, name: string) => {
    setDeleteTarget({ id, name });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  }, [deleteTarget, deleteMutation]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  const handleCreateUser = useCallback(() => {
    // Navigate to create page
    window.location.href = "/users/new";
  }, []);

  // Computed values
  const apiUsers = data?.rows ?? [];
  const users: User[] = apiUsers.map(mapApiUserToUser);
  const totalItems = data?.count ?? 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  // ─── Render States ───────────────────────────────────────────────────────

  // Loading state (initial load, no cached data)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner text="Đang tải danh sách người dùng..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Người dùng admin</h1>
            <p className="text-sm text-muted-foreground mt-1">Quản lý tài khoản nội bộ</p>
          </div>
        </div>
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  // ─── Main Content ────────────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Người dùng admin</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Quản lý tài khoản nội bộ
              {totalItems > 0 && ` • ${totalItems} người dùng`}
            </p>
          </div>
          <Button variant="primary" onClick={handleCreateUser}>
            <Plus data-icon="inline-start" className="size-4" />
            Thêm người dùng
          </Button>
        </div>

        {/* Table Card */}
        <Card>
          {/* Loading overlay for background refetch */}
          {isFetching && !isLoading && (
            <div className="absolute top-4 right-4">
              <Spinner size="sm" />
            </div>
          )}

          {users.length === 0 ? (
            <div className="p-6">
              <EmptyState onCreateUser={handleCreateUser} />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="w-[120px]">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={user.avatar}
                            name={user.full_name ?? "?"}
                            size="sm"
                          />
                          <span className="font-medium">{user.full_name || "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="info">{user.is_admin ? "Admin" : "Người dùng"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "success" : "default"}>
                          {user.is_active ? "Hoạt động" : "Tạm khóa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.createdAt ? formatDate(user.createdAt) : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/users/${user.id}`}>
                            <Button variant="ghost" size="icon-sm" title="Xem chi tiết">
                              <Eye data-icon="inline" className="size-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Xóa"
                            onClick={() => handleDeleteClick(user.id, user.full_name ?? "Người dùng")}
                          >
                            <Trash2 data-icon="inline" className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t">
                  <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={totalItems}
                    pageSize={PAGE_SIZE}
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteConfirmation
          userName={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </>
  );
}
