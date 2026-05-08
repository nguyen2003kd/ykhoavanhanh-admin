"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { TablePagination } from "@/components/ui/TablePagination";
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
        <p className="text-sm text-gray-500 mt-1">Quản lý chương trình thành viên</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Thành viên</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Hạng</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Điểm hiện có</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tổng điểm</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày tham gia</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Hết hạn</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((m) => (
                <tr key={m.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={m.patientName} size="sm" />
                      <div>
                        <p className="font-medium">{m.patientName}</p>
                        <p className="text-xs text-gray-400">ID: {m.patientId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={tierVariant[m.tier]} className="capitalize">{m.tier}</Badge>
                  </td>
                  <td className="px-4 py-3 font-semibold text-primary-700">{m.points.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600">{m.totalPointsEarned.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(m.joinedAt)}</td>
                  <td className="px-4 py-3 text-gray-500">{m.pointsExpiryDate ? formatDate(m.pointsExpiryDate) : "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={m.isPrimaryMember ? "success" : "default"}>{m.isPrimaryMember ? "Chính" : "Phụ"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
