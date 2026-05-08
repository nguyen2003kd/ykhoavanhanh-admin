"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockVouchers } from "@/mock-data/membership";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function VouchersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Voucher</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý mã giảm giá</p>
        </div>
        <Link href="/membership/vouchers/new">
          <Button variant="primary"><Plus className="h-4 w-4 mr-2" />Tạo voucher</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {mockVouchers.map((v) => (
          <Card key={v.id}>
            <div className="p-4 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">{v.code}</span>
                  <Badge variant={v.isActive ? "success" : "default"}>{v.isActive ? "Đang hoạt động" : "Tắt"}</Badge>
                </div>
                <p className="font-medium text-gray-900">{v.name}</p>
                <div className="flex gap-4 text-sm text-gray-600 pt-1">
                  <span>Giảm: <strong>{v.discountType === "percent" ? `${v.discountValue}%` : formatCurrency(v.discountValue)}</strong></span>
                  {v.minOrderValue && <span>Đơn tối thiểu: <strong>{formatCurrency(v.minOrderValue)}</strong></span>}
                  {v.maxDiscount && <span>Giảm tối đa: <strong>{formatCurrency(v.maxDiscount)}</strong></span>}
                </div>
                <p className="text-xs text-gray-400">Hiệu lực: {formatDate(v.validFrom)} – {formatDate(v.validTo)} · Đã dùng: {v.usedCount}{v.usageLimit ? `/${v.usageLimit}` : ""}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
