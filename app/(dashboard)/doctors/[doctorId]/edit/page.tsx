"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { mockDoctors } from "@/mock-data/doctors";
import { mockSpecialties } from "@/mock-data/specialties";
import { Toggle } from "@/components/ui/Toggle";

export default function EditDoctorPage({ params }: { params: Promise<{ doctorId: string }> }) {
  const { doctorId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const doctor = mockDoctors.find((d) => d.id === doctorId);

  const [form, setForm] = useState({
    fullName: doctor?.fullName ?? "",
    title: doctor?.title ?? "",
    specialtyId: doctor?.specialtyId ?? "",
    email: doctor?.email ?? "",
    phone: doctor?.phone ?? "",
    experienceYears: String(doctor?.experience ?? ""),
    bio: doctor?.bio ?? "",
    isActive: doctor?.isActive ?? true,
  });

  if (!doctor) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Không tìm thấy bác sĩ.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    router.push(`/doctors/${doctorId}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa bác sĩ</h1>
          <p className="text-sm text-gray-500 mt-0.5">{doctor.fullName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Thông tin cá nhân</CardTitle></CardHeader>
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
                label="Chức danh"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Tiến sĩ, Bác sĩ CKI..."
              />
              <Select
                label="Khoa *"
                required
                value={form.specialtyId}
                onChange={(e) => setForm({ ...form, specialtyId: e.target.value })}
                options={mockSpecialties.map((s) => ({ value: s.id, label: s.name }))}
                placeholder="Chọn khoa..."
              />
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
              <Input
                label="Số năm kinh nghiệm"
                type="number"
                value={form.experienceYears}
                onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Giới thiệu</CardTitle></CardHeader>
            <CardContent>
              <textarea
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Mô tả kinh nghiệm và chuyên môn..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader><CardTitle>Lưu thay đổi</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Trạng thái hoạt động</span>
                <Toggle
                  checked={form.isActive}
                  onChange={(v) => setForm({ ...form, isActive: v })}
                />
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => router.push(`/doctors/${doctorId}`)}>
                Hủy
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
