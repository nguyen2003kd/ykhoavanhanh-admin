"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TablePagination } from "@/components/ui/TablePagination";
import { mockNews } from "@/mock-data/content";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

const PAGE_SIZE = 10;

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const total = mockNews.length;
  const paged = mockNews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tin tức</h1>
          <p className="text-sm text-gray-500 mt-1">Thông báo và sự kiện bệnh viện</p>
        </div>
        <Link href="/content/news/new">
          <Button variant="primary"><Plus className="h-4 w-4 mr-2" />Đăng tin mới</Button>
        </Link>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tiêu đề</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày đăng</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paged.map((n) => (
                <tr key={n.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-sm truncate">{n.title}</td>
                  <td className="px-4 py-3">
                    <Badge variant={n.status === "published" ? "success" : "default"}>{n.status === "published" ? "Đã đăng" : "Bản nháp"}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{n.publishedAt ? formatDate(n.publishedAt) : "—"}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm">Sửa</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4">
          <TablePagination currentPage={page} totalPages={Math.ceil(total / PAGE_SIZE)} onPageChange={setPage} totalItems={total} pageSize={PAGE_SIZE} />
        </div>
      </Card>
    </div>
  );
}
