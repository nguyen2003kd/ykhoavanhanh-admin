"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TablePagination } from "@/components/ui/TablePagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { mockPatients } from "@/mock-data/patients";
import { Patient } from "./types";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

const statusVariant: Record<Patient["status"], "success" | "default" | "warning"> = {
  active: "success",
  inactive: "default",
  pending: "warning",
};
const statusLabels: Record<Patient["status"], string> = {
  active: "Hoạt động",
  inactive: "Không hoạt động",
  pending: "Chờ duyệt",
};

const PAGE_SIZE = 10;

export default function PatientsPage() {
  const [page, setPage] = useState(1);
  const total = mockPatients.length;
  const paged = mockPatients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bệnh nhân</h1>
          <p className="text-sm text-muted-foreground mt-1">Danh sách tất cả bệnh nhân trong hệ thống</p>
        </div>
        <Link href="/patients/new">
          <Button variant="primary">
            <Plus data-icon="inline-start" />
            Thêm bệnh nhân
          </Button>
        </Link>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã BN</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Nhóm máu</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-primary-600">{p.code}</TableCell>
                <TableCell className="font-medium">{p.fullName}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(p.dateOfBirth)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {p.gender === "male" ? "Nam" : p.gender === "female" ? "Nữ" : "Khác"}
                </TableCell>
                <TableCell className="text-muted-foreground">{p.phone}</TableCell>
                <TableCell>{p.bloodType || "—"}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[p.status]}>{statusLabels[p.status]}</Badge>
                </TableCell>
                <TableCell>
                  <Link href={`/patients/${p.id}`}>
                    <Button variant="ghost" size="sm">Xem</Button>
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
