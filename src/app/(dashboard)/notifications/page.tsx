"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TablePagination } from "@/components/ui/TablePagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
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
          <p className="text-sm text-muted-foreground mt-1">Quản lý thông báo đẩy đến bệnh nhân</p>
        </div>
        <Link href="/notifications/new">
          <Button variant="primary">
            <Plus data-icon="inline-start" />
            Tạo thông báo
          </Button>
        </Link>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Kênh</TableHead>
              <TableHead>Đối tượng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((n) => (
              <TableRow key={n.id}>
                <TableCell className="font-medium">{n.title}</TableCell>
                <TableCell className="text-muted-foreground capitalize">{n.type}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {n.channels.map((c) => (
                      <Badge key={c} variant="info">{c.toUpperCase()}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {n.targetAudience === "all" ? "Tất cả" : n.targetAudience === "members" ? "Thành viên" : "Cụ thể"}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[n.status]}>{statusLabels[n.status]}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDateTime(n.createdAt)}</TableCell>
                <TableCell>
                  <Link href={`/notifications/${n.id}`} className="text-primary-600 hover:text-primary-800 inline-flex items-center gap-1 text-xs font-medium">
                    <ExternalLink className="size-3.5" />Chi tiết
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
