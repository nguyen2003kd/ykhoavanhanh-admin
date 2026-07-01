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
  return p.patient_full_name || "—";
}

function getGender(p: Patient): string {
  if (!p.sex) return "—";
  return p.sex.toLowerCase() === "nam" ? "Nam" : p.sex.toLowerCase() === "nữ" || p.sex.toLowerCase() === "nu" ? "Nữ" : p.sex;
}

function getBirthday(p: Patient): string {
  return p.birthday || p.birth_year || "—";
}

export default function PatientsPage() {
  const [, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [searchParams, setSearchParams] = useState<{ patientcode?: string; patientphonenumber?: string }>({});

  const { data: patientsData, isLoading } = useSearchPatients(searchParams);

  // API trả về { count, rows, totalPages, currentPage }
  const patients = patientsData?.rows ?? [];
  const total = patientsData?.count ?? 0;
  const totalPages = patientsData?.totalPages ?? 1;
  const currentPage = patientsData?.currentPage ?? 1;

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
        <div className="flex gap-2">
          <Link href="/patients/merge">
            <Button variant="outline">
              Gộp bệnh nhân
            </Button>
          </Link>
          <Link href="/patients/new">
            <Button variant="primary">
              <Plus data-icon="inline-start" />
              Thêm bệnh nhân
            </Button>
          </Link>
        </div>
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
                {patients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                      Khong tim thay benh nao.
                    </TableCell>
                  </TableRow>
                ) : (
                  patients.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-primary-600">{p.his_patient_id}</TableCell>
                      <TableCell className="font-medium">{getFullName(p)}</TableCell>
                      <TableCell className="text-muted-foreground">{getBirthday(p)}</TableCell>
                      <TableCell className="text-muted-foreground">{getGender(p)}</TableCell>
                      <TableCell className="text-muted-foreground">{p.phone_number ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">{p.address_full ?? "—"}</TableCell>
                      <TableCell>{p.insurance_number ?? "—"}</TableCell>
                      <TableCell>
                        <Link href={`/patients/${p.his_patient_id}`}>
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
                currentPage={currentPage}
                totalPages={totalPages}
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
