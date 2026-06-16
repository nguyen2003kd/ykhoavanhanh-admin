"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TablePagination } from "@/components/ui/TablePagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { postsHooks } from "@/api/postsApi";
import { toast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import { Plus, Pencil, Trash2 } from "lucide-react";

const PAGE_SIZE = 10;

export default function NewsPage() {
  const [page, setPage] = useState(1);

  const { data } = postsHooks.useList({ page, pageSize: PAGE_SIZE });
  const rows = data?.rows ?? [];
  const total = data?.count ?? 0;

  const deleteMutation = postsHooks.useDelete({
    onSuccess: () => toast.success("Xóa tin tức thành công"),
    onError: (err) => toast.error(err.message || "Xóa tin tức thất bại"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tin tức</h1>
          <p className="text-sm text-muted-foreground mt-1">Thông báo và sự kiện bệnh viện</p>
        </div>
        <Link href="/content/news/new">
          <Button variant="primary">
            <Plus data-icon="inline-start" />
            Đăng tin mới
          </Button>
        </Link>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
            {rows.map((n) => (
              <TableRow key={n.id}>
                <TableCell className="font-medium max-w-sm truncate">{n.name}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">
                  {n.description ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {n.created_at ? formatDate(n.created_at) : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Link href={`/content/news/${n.id}`}>
                      <Button variant="ghost" size="sm">
                        <Pencil data-icon="inline-start" />
                        Sửa
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Bạn có chắc muốn xóa tin tức này?")) {
                          deleteMutation.mutate(n.id);
                        }
                      }}
                    >
                      <Trash2 data-icon="inline-start" />
                      Xóa
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-4">
          <TablePagination
            currentPage={page}
            totalPages={Math.ceil(total / PAGE_SIZE) || 1}
            onPageChange={setPage}
            totalItems={total}
            pageSize={PAGE_SIZE}
          />
        </div>
      </Card>
    </div>
  );
}
