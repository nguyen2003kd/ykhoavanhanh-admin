"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TablePagination } from "@/components/ui/TablePagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { mockMedicalRecords } from "@/mock-data/medical-records";
import { formatDate, formatCurrency } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function MedicalRecordsPage() {
  const [page, setPage] = useState(1);
  const total = mockMedicalRecords.length;
  const paged = mockMedicalRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hồ sơ bệnh án</h1>
        <p className="text-sm text-muted-foreground mt-1">Lịch sử khám bệnh của bệnh nhân</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bệnh nhân</TableHead>
              <TableHead>Bác sĩ</TableHead>
              <TableHead>Ngày khám</TableHead>
              <TableHead>Chẩn đoán</TableHead>
              <TableHead>Chi phí</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.patientName}</TableCell>
                <TableCell className="text-muted-foreground">{r.doctorName}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(r.visitDate)}</TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">{r.diagnosis}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(r.totalCost ?? 0)}</TableCell>
                <TableCell>
                  <Link href={`/medical-records/${r.id}`}>
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
