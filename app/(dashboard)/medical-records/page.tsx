"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TablePagination } from "@/components/ui/TablePagination";
import { mockMedicalRecords } from "@/mock-data/medical-records";
import { formatDate, formatCurrency } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function MedicalRecordsPage() {
  const [page, setPage] = useState(1);
  const total = mockMedicalRecords.length;
  const paged = mockMedicalRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hồ sơ bệnh án</h1>
        <p className="text-sm text-gray-500 mt-1">Lịch sử khám bệnh của bệnh nhân</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Bệnh nhân</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Bác sĩ</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày khám</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Chẩn đoán</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Chi phí</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paged.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium">{r.patientName}</td>
                  <td className="px-4 py-3 text-gray-600">{r.doctorName}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(r.visitDate)}</td>
                  <td className="px-4 py-3 max-w-xs truncate text-gray-600">{r.diagnosis}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(r.totalCost ?? 0)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/medical-records/${r.id}`}>
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
