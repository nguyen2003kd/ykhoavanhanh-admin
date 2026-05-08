"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TablePagination } from "@/components/ui/TablePagination";
import { mockPatients } from "@/mock-data/patients";
import { Patient } from "./types";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

const statusVariant: Record<Patient["status"], "success" | "default" | "warning"> = {
  active: "success",
  inactive: "default",
  pending: "warning",
};
const statusLabels: Record<Patient["status"], string> = {
  active: "Hoạt động",
  inactive: "Không hoạt động",
  pending: "Chờ duyệt",
};

const PAGE_SIZE = 10;

export default function PatientsPage() {
  const [page, setPage] = useState(1);
  const total = mockPatients.length;
  const paged = mockPatients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bệnh nhân</h1>
          <p className="text-sm text-gray-500 mt-1">Danh sách tất cả bệnh nhân trong hệ thống</p>
        </div>
        <Link href="/patients/new">
          <Button variant="primary"><Plus className="h-4 w-4 mr-2" />Thêm bệnh nhân</Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Mã BN</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Họ tên</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày sinh</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Giới tính</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Điện thoại</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nhóm máu</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-primary-600">{p.code}</td>
                  <td className="px-4 py-3 font-medium">{p.fullName}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(p.dateOfBirth)}</td>
                  <td className="px-4 py-3 text-gray-600">{p.gender === "male" ? "Nam" : p.gender === "female" ? "Nữ" : "Khác"}</td>
                  <td className="px-4 py-3 text-gray-600">{p.phone}</td>
                  <td className="px-4 py-3">{p.bloodType || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[p.status]}>{statusLabels[p.status]}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/patients/${p.id}`}>
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
