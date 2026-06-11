"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { TablePagination } from "@/components/ui/TablePagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { mockMembers, mockPointTransactions } from "@/mock-data/membership";
import { MemberProfile, PointTransaction } from "@/types/membership";
import { formatDate } from "@/lib/utils";
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from "lucide-react";

const tierVariant: Record<MemberProfile["tier"], "default" | "info" | "accent" | "warning"> = {
  silver: "info",
  gold: "accent",
  diamond: "warning",
};
const tierLabel: Record<MemberProfile["tier"], string> = {
  silver: "Bạc",
  gold: "Vàng",
  diamond: "Kim cương",
};

const txTypeConfig: Record<PointTransaction["type"], { label: string; color: string; icon: React.ElementType }> = {
  earn:   { label: "Tích điểm",   color: "text-green-600", icon: TrendingUp },
  redeem: { label: "Đổi điểm",   color: "text-red-500",   icon: TrendingDown },
  expire: { label: "Hết hạn",    color: "text-gray-500",  icon: AlertCircle },
  adjust: { label: "Điều chỉnh", color: "text-blue-500",  icon: RefreshCw },
};

const PAGE_SIZE = 10;

export default function MemberPointsPage() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const transactions = selectedMember
    ? mockPointTransactions.filter((t) => t.memberId === selectedMember)
    : mockPointTransactions;

  const paged = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalEarned = mockPointTransactions.filter(t => t.type === "earn").reduce((s, t) => s + t.points, 0);
  const totalRedeemed = Math.abs(mockPointTransactions.filter(t => t.type === "redeem").reduce((s, t) => s + t.points, 0));
  const totalInCirculation = mockMembers.reduce((s, m) => s + m.points, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý điểm</h1>
        <p className="text-sm text-muted-foreground mt-1">Lịch sử giao dịch điểm thành viên</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-5">
          <p className="text-sm text-muted-foreground">Tổng điểm đã tích</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{totalEarned.toLocaleString()}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-sm text-muted-foreground">Tổng điểm đã đổi</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{totalRedeemed.toLocaleString()}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-sm text-muted-foreground">Điểm đang lưu hành</p>
          <p className="text-2xl font-bold text-primary-600 mt-1">{totalInCirculation.toLocaleString()}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-sm text-muted-foreground">Tổng thành viên</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{mockMembers.length}</p>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Danh sách thành viên */}
        <Card>
          <CardHeader><CardTitle className="text-base">Thành viên</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors border-b ${!selectedMember ? "bg-primary-50" : ""}`}
              onClick={() => { setSelectedMember(null); setPage(1); }}
            >
              <div className="flex-1 text-sm font-medium">Tất cả</div>
              <span className="text-xs text-muted-foreground">{mockPointTransactions.length} GD</span>
            </div>
            {mockMembers.map((m) => {
              const txCount = mockPointTransactions.filter(t => t.memberId === m.id).length;
              return (
                <div
                  key={m.id}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors border-b ${selectedMember === m.id ? "bg-primary-50" : ""}`}
                  onClick={() => { setSelectedMember(m.id); setPage(1); }}
                >
                  <Avatar name={m.patientName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.patientName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Badge variant={tierVariant[m.tier]} className="text-xs py-0">{tierLabel[m.tier]}</Badge>
                      <span className="text-xs text-muted-foreground">{m.points.toLocaleString()} điểm</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{txCount} GD</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Lịch sử giao dịch — shadcn Table */}
        <div className="col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle>Lịch sử giao dịch</CardTitle></CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loại</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Thành viên</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead className="text-right">Điểm</TableHead>
                  <TableHead className="text-right">Số dư</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                      Không có giao dịch nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((tx) => {
                    const config = txTypeConfig[tx.type];
                    const Icon = config.icon;
                    const member = mockMembers.find(m => m.id === tx.memberId);
                    return (
                      <TableRow key={tx.id}>
                        <TableCell>
                          <div className={`flex items-center gap-2 ${config.color}`}>
                            <Icon className="size-4 shrink-0" />
                            <Badge variant="default">{config.label}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{tx.description}</TableCell>
                        <TableCell className="text-muted-foreground">{member?.patientName}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(tx.createdAt)}</TableCell>
                        <TableCell className={`text-right font-bold ${tx.points > 0 ? "text-green-600" : "text-red-500"}`}>
                          {tx.points > 0 ? "+" : ""}{tx.points.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">{tx.balance.toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
          <TablePagination
            currentPage={page}
            totalPages={Math.ceil(transactions.length / PAGE_SIZE)}
            onPageChange={setPage}
            totalItems={transactions.length}
            pageSize={PAGE_SIZE}
          />
        </div>
      </div>
    </div>
  );
}
