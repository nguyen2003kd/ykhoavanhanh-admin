"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

export default function NewPatientPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "", dateOfBirth: "", gender: "", phone: "",
    email: "", address: "", bloodType: "",
    allergies: "", medicalHistory: "",
    emergencyName: "", emergencyPhone: "", emergencyRelationship: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.dateOfBirth || !form.gender) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Đã thêm bệnh nhân thành công!");
    router.push("/patients");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thêm bệnh nhân mới</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tạo hồ sơ bệnh nhân mới trong hệ thống</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Thông tin cá nhân</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input label="Họ và tên *" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Nguyễn Thị Lan" required />
                </div>
                <Input label="Ngày sinh *" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required />
                <Select label="Giới tính *" name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="">-- Chọn --</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </Select>
                <Input label="Số điện thoại *" name="phone" value={form.phone} onChange={handleChange} placeholder="09xxxxxxxx" required />
                <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com" />
                <div className="col-span-2">
                  <Input label="Địa chỉ" name="address" value={form.address} onChange={handleChange} placeholder="Số nhà, đường, quận, thành phố" />
                </div>
                <Select label="Nhóm máu" name="bloodType" value={form.bloodType} onChange={handleChange}>
                  <option value="">-- Chưa xác định --</option>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b => <option key={b} value={b}>{b}</option>)}
                </Select>
                <Input label="Dị ứng" name="allergies" value={form.allergies} onChange={handleChange} placeholder="Penicillin, Aspirin... (ngăn cách bằng dấu phẩy)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiền sử bệnh</label>
                <textarea
                  name="medicalHistory" rows={3} value={form.medicalHistory} onChange={handleChange}
                  placeholder="Mô tả các bệnh lý, phẫu thuật, thuốc đang dùng..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Liên hệ khẩn cấp</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <Input label="Tên người liên hệ" name="emergencyName" value={form.emergencyName} onChange={handleChange} placeholder="Nguyễn Văn A" />
              <Input label="Số điện thoại" name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} placeholder="09xxxxxxxx" />
              <Input label="Quan hệ" name="emergencyRelationship" value={form.emergencyRelationship} onChange={handleChange} placeholder="Vợ / Chồng / Con..." />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader><CardTitle>Lưu hồ sơ</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-500">Kiểm tra lại thông tin trước khi lưu. Sau khi tạo, mã bệnh nhân sẽ được tạo tự động.</p>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? "Đang lưu..." : "Đăng ký bệnh nhân"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => router.back()}>Hủy</Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
