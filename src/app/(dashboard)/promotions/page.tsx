"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TablePagination } from "@/components/ui/TablePagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
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
          <p className="text-sm text-muted-foreground mt-1">Quản lý chương trình khuyến mãi</p>
        </div>
        <Link href="/promotions/new">
          <Button variant="primary">
            <Plus data-icon="inline-start" />
            Tạo khuyến mãi
          </Button>
        </Link>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Ưu đãi</TableHead>
              <TableHead>Đối tượng</TableHead>
              <TableHead>Hiệu lực</TableHead>
              <TableHead>Đã dùng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium max-w-xs truncate">{p.name}</TableCell>
                <TableCell className="text-muted-foreground">{typeLabels[p.type]}</TableCell>
                <TableCell>
                  {p.discountPercent
                    ? `${p.discountPercent}%`
                    : p.discountAmount
                    ? formatCurrency(p.discountAmount)
                    : `+${p.bonusPoints} điểm`}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {p.targetAudience === "all"
                    ? "Tất cả"
                    : p.targetAudience === "members"
                    ? "Thành viên"
                    : `Hạng ${p.targetTier}`}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                  {formatDate(p.validFrom)} – {formatDate(p.validTo)}
                </TableCell>
                <TableCell>
                  {p.usedCount}{p.usageLimit ? `/${p.usageLimit}` : ""}
                </TableCell>
                <TableCell>
                  <Badge variant={p.isActive ? "success" : "default"}>{p.isActive ? "Hoạt động" : "Tắt"}</Badge>
                </TableCell>
                <TableCell>
                  <Link href={`/promotions/${p.id}`} className="text-primary-600 hover:text-primary-800 inline-flex items-center gap-1 text-xs font-medium">
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
