"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TablePagination } from "@/components/ui/TablePagination";
import { mockDoctors } from "@/mock-data/doctors";
import { formatDate } from "@/lib/utils";
import { Plus, Star } from "lucide-react";

const PAGE_SIZE = 10;

export default function DoctorsPage() {
  const [page, setPage] = useState(1);
  const total = mockDoctors.length;
  const paged = mockDoctors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bác sĩ</h1>
          <p className="text-sm text-gray-500 mt-1">Danh sách bác sĩ tại bệnh viện</p>
        </div>
        <Link href="/doctors/new">
          <Button variant="primary"><Plus className="h-4 w-4 mr-2" />Thêm bác sĩ</Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Mã</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Họ tên</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Chức danh</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Khoa</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Đánh giá</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paged.map((d) => (
                <tr key={d.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-primary-600">{d.id}</td>
                  <td className="px-4 py-3 font-medium">{d.fullName}</td>
                  <td className="px-4 py-3 text-gray-600">{d.title}</td>
                  <td className="px-4 py-3 text-gray-600">{d.specialtyName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-accent-400 fill-accent-400" />
                      <span>{d.averageRating}</span>
                      <span className="text-gray-400">({d.totalReviews})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={d.isActive ? "success" : "default"}>{d.isActive ? "Hoạt động" : "Tạm ngưng"}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/doctors/${d.id}`}>
                      <Button variant="ghost" size="sm">Xem</Button>
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
