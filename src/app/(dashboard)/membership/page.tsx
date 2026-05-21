"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { TablePagination } from "@/components/ui/TablePagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { mockMembers } from "@/mock-data/membership";
import { MemberProfile } from "@/types/membership";
import { formatDate } from "@/lib/utils";

const tierVariant: Record<MemberProfile["tier"], "default" | "info" | "accent" | "warning"> = {
  silver: "info",
  gold: "accent",
  diamond: "warning",
};

const PAGE_SIZE = 10;

export default function MembershipPage() {
  const [page, setPage] = useState(1);
  const total = mockMembers.length;
  const paged = mockMembers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Thành viên</h1>
        <p className="text-sm text-muted-foreground mt-1">Quản lý chương trình thành viên</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thành viên</TableHead>
              <TableHead>Hạng</TableHead>
              <TableHead>Điểm hiện có</TableHead>
              <TableHead>Tổng điểm</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead>Hết hạn</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={m.patientName} size="sm" />
                    <div>
                      <p className="font-medium">{m.patientName}</p>
                      <p className="text-xs text-muted-foreground">ID: {m.patientId}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={tierVariant[m.tier]} className="capitalize">{m.tier}</Badge>
                </TableCell>
                <TableCell className="font-semibold text-primary-700">{m.points.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">{m.totalPointsEarned.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(m.joinedAt)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {m.pointsExpiryDate ? formatDate(m.pointsExpiryDate) : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={m.isPrimaryMember ? "success" : "default"}>
                    {m.isPrimaryMember ? "Chính" : "Phụ"}
                  </Badge>
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
