"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TablePagination } from "@/components/ui/TablePagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { mockNews } from "@/mock-data/content";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

const PAGE_SIZE = 10;

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const total = mockNews.length;
  const paged = mockNews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tin tức</h1>
          <p className="text-sm text-muted-foreground mt-1">Thông báo và sự kiện bệnh viện</p>
        </div>
        <Link href="/content/news/new">
          <Button variant="primary">
            <Plus data-icon="inline-start" />
            Đăng tin mới
          </Button>
        </Link>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày đăng</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((n) => (
              <TableRow key={n.id}>
                <TableCell className="font-medium max-w-sm truncate">{n.title}</TableCell>
                <TableCell>
                  <Badge variant={n.status === "published" ? "success" : "default"}>
                    {n.status === "published" ? "Đã đăng" : "Bản nháp"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {n.publishedAt ? formatDate(n.publishedAt) : "—"}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Sửa</Button>
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
