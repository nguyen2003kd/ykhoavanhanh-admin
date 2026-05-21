"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { TablePagination } from "@/components/ui/TablePagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { mockUsers } from "@/mock-data/users";
import { AdminRole } from "@/types/user";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

const roleLabels: Record<AdminRole, string> = {
  super_admin: "Quản trị viên",
  admin_content: "Biên tập nội dung",
  admin_membership: "Quản lý Membership",
  cskh: "Chăm sóc khách hàng",
  doctor: "Bác sĩ",
};

const PAGE_SIZE = 10;

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const total = mockUsers.length;
  const paged = mockUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Người dùng admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Quản lý tài khoản nội bộ</p>
        </div>
        <Link href="/users/new">
          <Button variant="primary">
            <Plus data-icon="inline-start" />
            Thêm người dùng
          </Button>
        </Link>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar src={u.avatar} name={u.fullName} size="sm" />
                    <span className="font-medium">{u.fullName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Badge variant="info">{roleLabels[u.role]}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={u.isActive ? "success" : "default"}>{u.isActive ? "Hoạt động" : "Tạm khóa"}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
                <TableCell>
                  <Link href={`/users/${u.id}`}>
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
