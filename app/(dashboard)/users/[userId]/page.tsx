"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { mockUsers } from "@/mock-data/users";
import { AdminRole } from "@/types/user";
import { formatDate } from "@/lib/utils";

const roleLabels: Record<AdminRole, string> = {
  super_admin: "Quản trị viên",
  admin_content: "Biên tập nội dung",
  admin_membership: "Quản lý Membership",
  cskh: "Chăm sóc khách hàng",
  doctor: "Bác sĩ",
};

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Không tìm thấy người dùng.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết người dùng</h1>
        </div>
        <Link href={`/users/${userId}/edit`}>
          <Button variant="outline" size="sm">Chỉnh sửa</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar src={user.avatar} name={user.fullName} size="lg" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
              <Badge variant="info" className="mt-1">{roleLabels[user.role]}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Email:</span> <span className="font-medium ml-2">{user.email}</span></div>
            <div><span className="text-gray-500">Điện thoại:</span> <span className="font-medium ml-2">{user.phone || "—"}</span></div>
            <div><span className="text-gray-500">Trạng thái:</span> <Badge variant={user.isActive ? "success" : "default"} className="ml-2">{user.isActive ? "Hoạt động" : "Tạm khóa"}</Badge></div>
            <div><span className="text-gray-500">Ngày tạo:</span> <span className="font-medium ml-2">{formatDate(user.createdAt)}</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
