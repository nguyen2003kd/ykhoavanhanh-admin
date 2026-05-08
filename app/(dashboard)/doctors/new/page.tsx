"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import { mockSpecialties } from "@/mock-data/specialties";

export default function NewDoctorPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: "", title: "", specialtyId: "", phone: "", email: "", experienceYears: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Thêm bác sĩ thành công!");
      router.push("/doctors");
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
        <h1 className="text-2xl font-bold text-gray-900">Thêm bác sĩ mới</h1>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Thông tin bác sĩ</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input label="Họ và tên *" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="BS. Nguyễn Văn A" />
              </div>
              <Input label="Chức danh" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Tiến sĩ, Bác sĩ CKI..." />
              <Select label="Khoa *" required value={form.specialtyId} onChange={(e) => setForm({ ...form, specialtyId: e.target.value })}
                options={mockSpecialties.map((s) => ({ value: s.id, label: s.name }))}
                placeholder="Chọn khoa..."
              />
              <Input label="Email *" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input label="Số điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="09xxxxxxxx" />
              <Input label="Số năm kinh nghiệm" type="number" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="sticky top-6">
            <CardHeader><CardTitle>Lưu thông tin</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-500">Kiểm tra lại thông tin trước khi thêm bác sĩ vào hệ thống.</p>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>{loading ? "Đang lưu..." : "Thêm bác sĩ"}</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => router.back()}>Hủy</Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
