"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TablePagination } from "@/components/ui/TablePagination";
import Link from "next/link";
import { mockReviews } from "@/mock-data/reviews";
import { formatDate } from "@/lib/utils";
import { Star, ExternalLink } from "lucide-react";

const PAGE_SIZE = 10;

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const total = mockReviews.length;
  const paged = mockReviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Đánh giá</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý đánh giá từ bệnh nhân</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Bệnh nhân</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Bác sĩ</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Đánh giá</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nhận xét</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">{r.patientName}</td>
                  <td className="px-4 py-3">{r.doctorName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-accent-400 fill-accent-400" />
                      <span className="font-semibold">{r.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate text-gray-600">{r.comment}</td>
                  <td className="px-4 py-3">
                    {!r.isVisible ? (
                      <Badge variant="default">Ẩn</Badge>
                    ) : r.isApproved ? (
                      <Badge variant="success">Hiển thị</Badge>
                    ) : (
                      <Badge variant="warning">Chờ duyệt</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(r.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/reviews/${r.id}`} className="text-primary-600 hover:text-primary-800 inline-flex items-center gap-1 text-xs font-medium">
                      <ExternalLink className="h-3.5 w-3.5" />Chi tiết
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
