"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TablePagination } from "@/components/ui/TablePagination";
import Link from "next/link";
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
        <p className="text-sm text-gray-500 mt-1">Quản lý lịch sử thanh toán</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Mã</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Bệnh nhân</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Mô tả</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Số tiền</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Phương thức</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày tạo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-primary-600">{p.code}</td>
                  <td className="px-4 py-3">{p.patientName}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{p.description}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3 text-gray-600">{methodLabels[p.method]}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[p.status]}>{statusLabels[p.status]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDateTime(p.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/payments/${p.id}`} className="text-primary-600 hover:text-primary-800 inline-flex items-center gap-1 text-xs font-medium">
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
