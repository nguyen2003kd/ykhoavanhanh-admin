"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TablePagination } from "@/components/ui/TablePagination";
import { mockArticles } from "@/mock-data/content";
import { Article } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

const statusVariant: Record<Article["status"], "default" | "warning" | "success"> = {
  draft: "default",
  pending: "warning",
  published: "success",
  archived: "default",
};
const statusLabels: Record<Article["status"], string> = {
  draft: "Bản nháp",
  pending: "Chờ duyệt",
  published: "Đã đăng",
  archived: "Lưu trữ",
};

const PAGE_SIZE = 10;

export default function ArticlesPage() {
  const [page, setPage] = useState(1);
  const total = mockArticles.length;
  const paged = mockArticles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bài viết sức khỏe</h1>
          <p className="text-sm text-gray-500 mt-1">Nội dung y tế hữu ích cho bệnh nhân</p>
        </div>
        <Link href="/content/articles/new">
          <Button variant="primary"><Plus className="h-4 w-4 mr-2" />Viết bài mới</Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tiêu đề</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Danh mục</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tác giả</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Lượt xem</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày đăng</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paged.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{a.title}</td>
                  <td className="px-4 py-3 text-gray-600">{a.categoryName}</td>
                  <td className="px-4 py-3 text-gray-600">{a.authorName}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[a.status]}>{statusLabels[a.status]}</Badge>
                  </td>
                  <td className="px-4 py-3">{a.viewCount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{a.publishedAt ? formatDate(a.publishedAt) : "—"}</td>
                  <td className="px-4 py-3">
                    <Link href={`/content/articles/${a.id}`}>
                      <Button variant="ghost" size="sm">Sửa</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4">
          <TablePagination
            currentPage={page}
            totalPages={Math.ceil(total / PAGE_SIZE)}
            onPageChange={setPage}
            totalItems={total}
            pageSize={PAGE_SIZE}
          />
        </div>
      </Card>
    </div>
  );
}
