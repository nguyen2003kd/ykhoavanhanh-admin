"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TablePagination } from "@/components/ui/TablePagination";
import { mockPromotions } from "@/mock-data/promotions";
import { Promotion } from "@/types/promotion";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Plus, ExternalLink } from "lucide-react";

const typeLabels: Record<Promotion["type"], string> = {
  discount: "Giảm giá",
  package: "Gói dịch vụ",
  gift: "Tặng quà",
  points_bonus: "Thêm điểm",
};

const PAGE_SIZE = 10;

export default function PromotionsPage() {
  const [page, setPage] = useState(1);
  const total = mockPromotions.length;
  const paged = mockPromotions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Khuyến mãi</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý chương trình khuyến mãi</p>
        </div>
        <Link href="/promotions/new">
          <Button variant="primary"><Plus className="h-4 w-4 mr-2" />Tạo khuyến mãi</Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tên</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Loại</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ưu đãi</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Đối tượng</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Hiệu lực</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Đã dùng</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">{typeLabels[p.type]}</td>
                  <td className="px-4 py-3">
                    {p.discountPercent ? `${p.discountPercent}%` : p.discountAmount ? formatCurrency(p.discountAmount) : `+${p.bonusPoints} điểm`}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {p.targetAudience === "all" ? "Tất cả" : p.targetAudience === "members" ? "Thành viên" : `Hạng ${p.targetTier}`}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {formatDate(p.validFrom)} – {formatDate(p.validTo)}
                  </td>
                  <td className="px-4 py-3">
                    {p.usedCount}{p.usageLimit ? `/${p.usageLimit}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={p.isActive ? "success" : "default"}>{p.isActive ? "Hoạt động" : "Tắt"}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/promotions/${p.id}`} className="text-primary-600 hover:text-primary-800 inline-flex items-center gap-1 text-xs font-medium">
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
