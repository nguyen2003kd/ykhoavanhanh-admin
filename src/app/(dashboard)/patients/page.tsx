"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TablePagination } from "@/components/ui/TablePagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { LoadingSection } from "@/components/ui/Spinner";
import { useSearchPatients } from "@/api/patientApi";
import type { Patient } from "@/types/patient";
import { Plus, Search } from "lucide-react";

const PAGE_SIZE = 10;

function getFullName(p: Patient): string {
  return [p.patientfirstname, p.patientlastname].filter(Boolean).join(" ") || "—";
}

function getGender(p: Patient): string {
  if (!p.patientsex) return "—";
  return p.patientsex.toLowerCase() === "nam" ? "Nam" : p.patientsex.toLowerCase() === "nữ" || p.patientsex.toLowerCase() === "nu" ? "Nữ" : p.patientsex;
}

function getBirthday(p: Patient): string {
  return p.patientbirthday || p.patientbirthyear || "—";
}

export default function PatientsPage() {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [searchParams, setSearchParams] = useState<{ patientcode?: string; patientphonenumber?: string }>({});

  const { data: patients, isLoading } = useSearchPatients(searchParams);

  const filtered = patients ?? [];
  const total = filtered.length;
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch() {
    const trimmed = searchValue.trim();
    const isPhone = /^\d+$/.test(trimmed);
    setSearchParams(
      trimmed
        ? isPhone
          ? { patientphonenumber: trimmed }
          : { patientcode: trimmed }
        : {}
    );
    setPage(1);
  }

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
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-3 max-w-md">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm theo mã BN hoặc số điện thoại..."
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button variant="outline" onClick={handleSearch} className="shrink-0">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <LoadingSection text="Đang tải danh sách bệnh nhân..." />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã BN</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Ngày sinh</TableHead>
                  <TableHead>Giới tính</TableHead>
                  <TableHead>Điện thoại</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>BHYT</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                      Không tìm thấy bệnh nhân nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((p) => (
                    <TableRow key={p.patientid}>
                      <TableCell className="font-mono text-primary-600">{p.patientid}</TableCell>
                      <TableCell className="font-medium">{getFullName(p)}</TableCell>
                      <TableCell className="text-muted-foreground">{getBirthday(p)}</TableCell>
                      <TableCell className="text-muted-foreground">{getGender(p)}</TableCell>
                      <TableCell className="text-muted-foreground">{p.patientphonenumber ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">{p.addressfull ?? "—"}</TableCell>
                      <TableCell>{p.insurancenumber ?? "—"}</TableCell>
                      <TableCell>
                        <Link href={`/patients/${p.patientid}`}>
                          <Button variant="ghost" size="sm">Xem</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="p-4">
              <TablePagination
                currentPage={page}
                totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
                onPageChange={setPage}
                totalItems={total}
                pageSize={PAGE_SIZE}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
