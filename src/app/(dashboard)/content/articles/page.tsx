"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TablePagination } from "@/components/ui/TablePagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { mockArticles } from "@/mock-data/content";
import { Article } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

const statusVariant: Record<Article["status"], "default" | "warning" | "success"> = {
  draft: "default",
  pending: "warning",
  published: "success",
  archived: "default",
};
const statusLabels: Record<Article["status"], string> = {
  draft: "Bản nháp",
  pending: "Chờ duyệt",
  published: "Đã đăng",
  archived: "Lưu trữ",
};

const PAGE_SIZE = 10;

export default function ArticlesPage() {
  const [page, setPage] = useState(1);
  const total = mockArticles.length;
  const paged = mockArticles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bài viết sức khỏe</h1>
          <p className="text-sm text-muted-foreground mt-1">Nội dung y tế hữu ích cho bệnh nhân</p>
        </div>
        <Link href="/content/articles/new">
          <Button variant="primary">
            <Plus data-icon="inline-start" />
            Viết bài mới
          </Button>
        </Link>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Tác giả</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Lượt xem</TableHead>
              <TableHead>Ngày đăng</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium max-w-xs truncate">{a.title}</TableCell>
                <TableCell className="text-muted-foreground">{a.categoryName}</TableCell>
                <TableCell className="text-muted-foreground">{a.authorName}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[a.status]}>{statusLabels[a.status]}</Badge>
                </TableCell>
                <TableCell>{a.viewCount?.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">
                  {a.publishedAt ? formatDate(a.publishedAt) : "—"}
                </TableCell>
                <TableCell>
                  <Link href={`/content/articles/${a.id}`}>
                    <Button variant="ghost" size="sm">Sửa</Button>
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
