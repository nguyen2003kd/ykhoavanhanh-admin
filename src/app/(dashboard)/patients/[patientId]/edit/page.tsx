"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { mockPatients } from "@/mock-data/patients";
import type { Gender, BloodType, PatientStatus } from "../../types";

export default function EditPatientPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const patient = mockPatients.find((p) => p.id === patientId);

  const [form, setForm] = useState({
    fullName: patient?.fullName ?? "",
    phone: patient?.phone ?? "",
    email: patient?.email ?? "",
    dateOfBirth: patient?.dateOfBirth ?? "",
    gender: patient?.gender ?? "male",
    address: patient?.address ?? "",
    bloodType: patient?.bloodType ?? "",
    allergies: patient?.allergies?.join(", ") ?? "",
    medicalHistory: patient?.medicalHistory ?? "",
    emergencyContactName: patient?.emergencyContact?.name ?? "",
    emergencyContactPhone: patient?.emergencyContact?.phone ?? "",
    emergencyContactRelationship: patient?.emergencyContact?.relationship ?? "",
    status: patient?.status ?? "active",
  });

  if (!patient) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Không tìm thấy bệnh nhân.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    router.push(`/patients/${patientId}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa bệnh nhân</h1>
          <p className="text-sm text-gray-500 mt-0.5">{patient.code} – {patient.fullName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Personal info */}
          <Card>
            <CardHeader><CardTitle>Thông tin cá nhân</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input label="Họ và tên *" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <Input label="Số điện thoại *" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input label="Ngày sinh *" type="date" required value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
              <Select
                label="Giới tính"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
                options={[
                  { value: "male", label: "Nam" },
                  { value: "female", label: "Nữ" },
                  { value: "other", label: "Khác" },
                ]}
              />
              <div className="col-span-2">
                <Input label="Địa chỉ" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <Select
                label="Nhóm máu"
                value={form.bloodType}
                onChange={(e) => setForm({ ...form, bloodType: e.target.value as BloodType })}
                options={[
                  { value: "", label: "Chưa biết" },
                  ...["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bt) => ({ value: bt, label: bt })),
                ]}
              />
              <Select
                label="Trạng thái"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as PatientStatus })}
                options={[
                  { value: "active", label: "Đang hoạt động" },
                  { value: "inactive", label: "Không hoạt động" },
                  { value: "pending", label: "Chờ xác minh" },
                ]}
              />
            </CardContent>
          </Card>

          {/* Medical info */}
          <Card>
            <CardHeader><CardTitle>Thông tin y tế</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dị ứng (cách nhau bởi dấu phẩy)</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Penicillin, Aspirin..."
                  value={form.allergies}
                  onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiền sử bệnh</label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={form.medicalHistory}
                  onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency contact */}
          <Card>
            <CardHeader><CardTitle>Người liên hệ khẩn cấp</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Input label="Họ tên" value={form.emergencyContactName} onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })} />
              <Input label="Số điện thoại" value={form.emergencyContactPhone} onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })} />
              <div className="col-span-2">
                <Input label="Quan hệ" value={form.emergencyContactRelationship} onChange={(e) => setForm({ ...form, emergencyContactRelationship: e.target.value })} placeholder="Vợ, Chồng, Con..." />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader><CardTitle>Lưu thay đổi</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-500">Kiểm tra lại thông tin trước khi lưu.</p>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => router.push(`/patients/${patientId}`)}>
                Hủy
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
