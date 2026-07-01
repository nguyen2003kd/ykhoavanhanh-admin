"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { LoadingSection } from "@/components/ui/Spinner";
import { useUserById } from "@/api/userApi";
import { useUserRolesList } from "@/api/userRolesApi";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Shield, Pencil } from "lucide-react";

export default function InternalAccountDetailPage() {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
  const router = useRouter();

  const { data: apiUser, isLoading } = useUserById(userId);
  const { data: userRolesData } = useUserRolesList({ user_id: userId, pageSize: 100 });

  const userRoles = userRolesData?.rows?.map((ur) => ur.role) || [];

  if (isLoading) {
    return <LoadingSection text="Đang tải thông tin..." />;
  }

  if (!apiUser) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Không tìm thấy tài khoản.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="size-4 mr-2" />
          Quay lại
        </Button>
        <Link href={`/internal-accounts/${userId}/edit`}>
          <Button variant="outline">
            <Pencil className="size-4 mr-2" />
            Chỉnh sửa
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar src={apiUser.avatar} name={apiUser.full_name ?? "?"} size="lg" />
                <div>
                  <h2 className="text-xl font-bold">{apiUser.full_name || "—"}</h2>
                  <p className="text-sm text-gray-500">{apiUser.email || "—"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{apiUser.email || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-medium">{apiUser.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <Badge variant={apiUser.is_active ? "success" : "default"}>
                    {apiUser.is_active ? "Hoạt động" : "Tạm khóa"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quyền Admin</p>
                  <Badge variant={apiUser.is_admin ? "info" : "default"}>
                    {apiUser.is_admin ? "Có" : "Không"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày tạo</p>
                  <p className="font-medium">{apiUser.created_at ? formatDate(apiUser.created_at) : "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cập nhật cuối</p>
                  <p className="font-medium">{apiUser.updated_at ? formatDate(apiUser.updated_at) : "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5" />
                Vai trò
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userRoles.length > 0 ? (
                <div className="space-y-2">
                  {userRoles.map((role) => (
                    <Badge key={role.id} variant="info" className="block w-full text-center py-2">
                      {role.description || role.role_name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center">Chưa có vai trò nào</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
