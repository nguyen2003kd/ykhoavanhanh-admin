"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TablePagination } from "@/components/ui/TablePagination";
import { mockSpecialties } from "@/mock-data/specialties";
import { Plus } from "lucide-react";

const PAGE_SIZE = 10;

export default function SpecialtiesPage() {
  const [page, setPage] = useState(1);
  const total = mockSpecialties.length;
  const paged = mockSpecialties.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chuyên khoa</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý các chuyên khoa</p>
        </div>
        <Link href="/specialties/new">
          <Button variant="primary"><Plus className="h-4 w-4 mr-2" />Thêm chuyên khoa</Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tên chuyên khoa</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Mô tả</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Số bác sĩ</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paged.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{s.description}</td>
                  <td className="px-4 py-3">{s.doctorCount} bác sĩ</td>
                  <td className="px-4 py-3">
                    <Badge variant={s.isActive ? "success" : "default"}>{s.isActive ? "Hoạt động" : "Tạm ngưng"}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/specialties/${s.id}`}>
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
