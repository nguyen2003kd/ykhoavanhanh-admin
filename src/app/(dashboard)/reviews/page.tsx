"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TablePagination } from "@/components/ui/TablePagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { mockReviews } from "@/mock-data/reviews";
import { formatDate } from "@/lib/utils";
import { Star, ExternalLink } from "lucide-react";

const PAGE_SIZE = 10;

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const total = mockReviews.length;
  const paged = mockReviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Đánh giá</h1>
        <p className="text-sm text-muted-foreground mt-1">Quản lý đánh giá từ bệnh nhân</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bệnh nhân</TableHead>
              <TableHead>Bác sĩ</TableHead>
              <TableHead>Đánh giá</TableHead>
              <TableHead>Nhận xét</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.patientName}</TableCell>
                <TableCell>{r.doctorName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="size-4 text-accent-400 fill-accent-400" />
                    <span className="font-semibold">{r.rating}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">{r.comment}</TableCell>
                <TableCell>
                  {!r.isVisible ? (
                    <Badge variant="default">Ẩn</Badge>
                  ) : r.isApproved ? (
                    <Badge variant="success">Hiển thị</Badge>
                  ) : (
                    <Badge variant="warning">Chờ duyệt</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                <TableCell>
                  <Link href={`/reviews/${r.id}`} className="text-primary-600 hover:text-primary-800 inline-flex items-center gap-1 text-xs font-medium">
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
