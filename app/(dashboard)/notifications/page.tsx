"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TablePagination } from "@/components/ui/TablePagination";
import { mockNotifications } from "@/mock-data/notifications";
import { AdminNotification } from "@/types/notification";
import { formatDateTime } from "@/lib/utils";
import { Plus, ExternalLink } from "lucide-react";

const statusVariant: Record<AdminNotification["status"], "default" | "warning" | "success" | "danger"> = {
  draft: "default",
  scheduled: "warning",
  sent: "success",
  failed: "danger",
};
const statusLabels: Record<AdminNotification["status"], string> = {
  draft: "Bản nháp",
  scheduled: "Đã lên lịch",
  sent: "Đã gửi",
  failed: "Thất bại",
};

const PAGE_SIZE = 10;

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const total = mockNotifications.length;
  const paged = mockNotifications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý thông báo đẩy đến bệnh nhân</p>
        </div>
        <Link href="/notifications/new">
          <Button variant="primary" size="md">
            <Plus className="h-4 w-4 mr-2" /> Tạo thông báo
          </Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tiêu đề</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Loại</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Kênh</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Đối tượng</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày tạo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((n) => (
                <tr key={n.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium">{n.title}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{n.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {n.channels.map((c) => (
                        <Badge key={c} variant="info">{c.toUpperCase()}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {n.targetAudience === "all" ? "Tất cả" : n.targetAudience === "members" ? "Thành viên" : "Cụ thể"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[n.status]}>{statusLabels[n.status]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDateTime(n.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/notifications/${n.id}`} className="text-primary-600 hover:text-primary-800 inline-flex items-center gap-1 text-xs font-medium">
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
