"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { useUserById, useUpdateUser } from "@/api/userApi";
import { AdminRole } from "@/types/user";

const roleOptions: { value: AdminRole; label: string }[] = [
  { value: "super_admin", label: "Quản trị viên" },
  { value: "admin_content", label: "Biên tập nội dung" },
  { value: "admin_membership", label: "Quản lý Membership" },
  { value: "cskh", label: "Chăm sóc khách hàng" },
  { value: "doctor", label: "Bác sĩ" },
];

export default function EditUserPage() {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
  const router = useRouter();

  const { data: apiUser, isLoading } = useUserById(userId);
  const updateUser = useUpdateUser({
    onSuccess: () => {
      router.push(`/users/${userId}`);
    },
  });

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "cskh" as AdminRole,
    isActive: true,
  });

  // Sync form when API data loads
  if (apiUser && form.fullName === "" && !updateUser.isPending) {
    setForm({
      fullName: apiUser.full_name ?? "",
      email: apiUser.email ?? "",
      phone: apiUser.phone ?? "",
      role: (apiUser.role as AdminRole) ?? "cskh",
      isActive: apiUser.is_active ?? true,
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  if (!apiUser) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Không tìm thấy người dùng.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Quay lại
        </Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateUser.mutate({
      id: userId,
      payload: {
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        role: form.role,
        is_active: form.isActive,
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa người dùng</h1>
          <p className="text-sm text-gray-500 mt-0.5">{form.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input
                  label="Họ và tên *"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
              <Input
                label="Email *"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                label="Số điện thoại"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <div className="col-span-2">
                <Select
                  label="Vai trò"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}
                  options={roleOptions}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Lưu thay đổi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Kích hoạt tài khoản</span>
                <Toggle
                  checked={form.isActive}
                  onChange={(v) => setForm({ ...form, isActive: v })}
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={updateUser.isPending}
              >
                {updateUser.isPending ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => router.push(`/users/${userId}`)}
              >
                Hủy
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Đặt lại mật khẩu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-500">Gửi email để người dùng tự đặt lại mật khẩu.</p>
              <Button type="button" variant="outline" className="w-full">
                Gửi email đặt lại mật khẩu
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
