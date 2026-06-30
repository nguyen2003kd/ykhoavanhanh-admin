"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TablePagination } from "@/components/ui/TablePagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { LoadingSection } from "@/components/ui/Spinner";
import { appointmentReviewsHooks } from "@/api/appointmentReviewsApi";
import { formatDate } from "@/lib/utils";
import { Star, ExternalLink } from "lucide-react";

const PAGE_SIZE = 10;

export default function ReviewsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = appointmentReviewsHooks.useList({
    page,
    pageSize: PAGE_SIZE,
    sortField: "created_at",
    sortOrder: "DESC",
  });

  const rows = data?.rows ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalItems = data?.count ?? 0;

  if (isLoading) {
    return <LoadingSection text="Đang tải đánh giá..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Đánh giá</h1>
        <p className="text-sm text-muted-foreground mt-1">Quản lý đánh giá lịch khám từ bệnh nhân</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bệnh nhân</TableHead>
              <TableHead>Bác sĩ</TableHead>
              <TableHead>Khu khám</TableHead>
              <TableHead>Đánh giá</TableHead>
              <TableHead>Nhận xét</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  {r.is_anonymous ? (
                    <span className="text-muted-foreground italic">Ẩn danh</span>
                  ) : (
                    r.patient_id ?? "—"
                  )}
                </TableCell>
                <TableCell>{r.doctor?.doctor_name ?? "—"}</TableCell>
                <TableCell>{r.exam_area?.name ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="size-4 text-accent-400 fill-accent-400" />
                    <span className="font-semibold">{r.overall_rating}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">{r.comment ?? "—"}</TableCell>
                <TableCell>
                  {r.status === "PENDING" ? (
                    <Badge variant="warning">Chờ duyệt</Badge>
                  ) : r.status === "APPROVED" ? (
                    <Badge variant="success">Hiển thị</Badge>
                  ) : (
                    <Badge variant="danger">Từ chối</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(r.created_at)}</TableCell>
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
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
          />
        </div>
      </Card>
    </div>
  );
}
