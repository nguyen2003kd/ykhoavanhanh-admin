"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TablePagination } from "@/components/ui/TablePagination";
import { mockAppointments } from "@/mock-data/appointments";
import { Appointment } from "./types";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

const statusLabels: Record<Appointment["status"], string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  no_show: "Vắng mặt",
};
const statusVariant: Record<Appointment["status"], "warning" | "info" | "success" | "danger" | "default"> = {
  pending: "warning",
  confirmed: "info",
  completed: "success",
  cancelled: "danger",
  no_show: "default",
};

const PAGE_SIZE = 10;

export default function AppointmentsPage() {
  const [page, setPage] = useState(1);
  const total = mockAppointments.length;
  const paged = mockAppointments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch hẹn</h1>
          <p className="text-sm text-gray-500 mt-1">Danh sách lịch hẹn khám của bệnh nhân</p>
        </div>
        <Link href="/appointments/new">
          <Button variant="primary"><Plus className="h-4 w-4 mr-2" />Đặt lịch hẹn</Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Mã</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Bệnh nhân</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Bác sĩ</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Khoa</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày hẹn</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Giờ</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paged.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-primary-600">{a.code}</td>
                  <td className="px-4 py-3 font-medium">{a.patientName}</td>
                  <td className="px-4 py-3 text-gray-600">{a.doctorName}</td>
                  <td className="px-4 py-3 text-gray-600">{a.specialtyName}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(a.appointmentDate)}</td>
                  <td className="px-4 py-3 text-gray-600">{a.appointmentTime}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[a.status]}>{statusLabels[a.status]}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/appointments/${a.id}`}>
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
