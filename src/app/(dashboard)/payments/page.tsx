"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TablePagination } from "@/components/ui/TablePagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { mockPayments } from "@/mock-data/payments";
import { Payment } from "@/types/payment";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const statusLabels: Record<Payment["status"], string> = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  failed: "Thất bại",
  refunded: "Đã hoàn tiền",
  expired: "Hết hạn",
};

const statusVariant: Record<Payment["status"], "warning" | "success" | "danger" | "info" | "default"> = {
  pending: "warning",
  paid: "success",
  failed: "danger",
  refunded: "info",
  expired: "default",
};

const methodLabels: Record<Payment["method"], string> = {
  vcb_qr: "QR VCB",
  vcb_transfer: "Chuyển khoản VCB",
  vcb_card: "Thẻ VCB",
  cash: "Tiền mặt",
};

const PAGE_SIZE = 10;

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const total = mockPayments.length;
  const paged = mockPayments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Thanh toán</h1>
        <p className="text-sm text-muted-foreground mt-1">Quản lý lịch sử thanh toán</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Bệnh nhân</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Phương thức</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-primary-600">{p.code}</TableCell>
                <TableCell>{p.patientName}</TableCell>
                <TableCell className="max-w-xs truncate">{p.description}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(p.amount)}</TableCell>
                <TableCell className="text-muted-foreground">{methodLabels[p.method]}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[p.status]}>{statusLabels[p.status]}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDateTime(p.createdAt)}</TableCell>
                <TableCell>
                  <Link href={`/payments/${p.id}`} className="text-primary-600 hover:text-primary-800 inline-flex items-center gap-1 text-xs font-medium">
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
