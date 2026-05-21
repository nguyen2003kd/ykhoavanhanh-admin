"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

export default function NewUserPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", role: "cskh", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Thêm người dùng thành công!");
      router.push("/users");
    } catch {
      toast.error("Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thêm người dùng</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tạo tài khoản admin mới</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader><CardTitle>Thông tin tài khoản</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input label="Họ và tên *" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <Input label="Email *" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input label="Số điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <div className="col-span-2">
                <Select label="Vai trò *" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  options={[
                    { value: "super_admin", label: "Quản trị viên" },
                    { value: "admin_content", label: "Biên tập nội dung" },
                    { value: "admin_membership", label: "Quản lý Membership" },
                    { value: "cskh", label: "Chăm sóc khách hàng" },
                    { value: "doctor", label: "Bác sĩ" },
                  ]}
                />
              </div>
              <div className="col-span-2">
                <Input label="Mật khẩu tạm thời *" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="sticky top-6">
            <CardHeader><CardTitle>Tạo tài khoản</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-500">Người dùng sẽ nhận email và được yêu cầu đổi mật khẩu khi đăng nhập lần đầu.</p>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>{loading ? "Đang tạo..." : "Thêm người dùng"}</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => router.back()}>Hủy</Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
