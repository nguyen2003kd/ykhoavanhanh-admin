"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useCreatePatient } from "@/api/patientApi";
import { toast } from "@/components/ui/Toast";
import type { CreatePatientPayload } from "@/types/patient";

export default function NewPatientPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    patientfirstname: "",
    patientlastname: "",
    patientbirthday: "",
    patientsex: "",
    patientphonenumber: "",
    identifynumber: "",
    insurancenumber: "",
    addressdetail: "",
    addressstreet: "",
    addressward: "",
    addresscity: "",
    addressprovince: "",
  });

  const createMutation = useCreatePatient({
    onSuccess: (data) => {
      toast.success(`Đã thêm bệnh nhân thành công! Mã BN: ${data.patientid}`);
      router.push("/patients");
    },
    onError: (err) => toast.error(err.message || "Tạo bệnh nhân thất bại"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.patientfirstname || !form.patientlastname) {
      toast.error("Vui lòng nhập họ và tên bệnh nhân.");
      return;
    }
    const payload: CreatePatientPayload = {
      patientid: "",
      patientfirstname: form.patientfirstname,
      patientlastname: form.patientlastname,
      patientbirthday: form.patientbirthday || undefined,
      patientsex: form.patientsex || undefined,
      patientphonenumber: form.patientphonenumber || undefined,
      addressdetail: form.addressdetail || undefined,
      addressstreet: form.addressstreet || undefined,
      addressward: form.addressward || undefined,
      addresscity: form.addresscity || undefined,
      addressprovince: form.addressprovince || undefined,
    };
    createMutation.mutate({ payload });
  }

  const loading = createMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thêm bệnh nhân mới</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tạo hồ sơ bệnh nhân mới trên HIS</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Thông tin cá nhân</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Họ, chữ lót *" name="patientfirstname" value={form.patientfirstname} onChange={handleChange} placeholder="Nguyễn Thị" required />
                <Input label="Tên *" name="patientlastname" value={form.patientlastname} onChange={handleChange} placeholder="Lan" required />
                <Input label="Ngày sinh" name="patientbirthday" type="date" value={form.patientbirthday} onChange={handleChange} placeholder="yyyy/mm/dd" />
                <Select
                  label="Giới tính"
                  value={form.patientsex}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, patientsex: val }))}
                  options={[
                    { value: "", label: "-- Chọn --" },
                    { value: "nam", label: "Nam" },
                    { value: "nữ", label: "Nữ" },
                  ]}
                />
                <Input label="Số điện thoại" name="patientphonenumber" value={form.patientphonenumber} onChange={handleChange} placeholder="09xxxxxxxx" />
                <Input label="Số CCCD" name="identifynumber" value={form.identifynumber} onChange={handleChange} placeholder="Số căn cước công dân" />
                <Input label="Mã BHYT" name="insurancenumber" value={form.insurancenumber} onChange={handleChange} placeholder="Số bảo hiểm y tế" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Địa chỉ</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Input label="Số nhà" name="addressdetail" value={form.addressdetail} onChange={handleChange} placeholder="12A" />
              <Input label="Đường/Thôn" name="addressstreet" value={form.addressstreet} onChange={handleChange} placeholder="Nguyễn Văn Cừ" />
              <Input label="Mã Phường/Xã" name="addressward" value={form.addressward} onChange={handleChange} placeholder="VD: 00001" />
              <Input label="Mã Quận/Huyện" name="addresscity" value={form.addresscity} onChange={handleChange} placeholder="VD: 760" />
              <Input label="Mã Tỉnh/Thành" name="addressprovince" value={form.addressprovince} onChange={handleChange} placeholder="VD: 79" />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader><CardTitle>Lưu hồ sơ</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-500">Kiểm tra lại thông tin trước khi lưu. Sau khi tạo, mã bệnh nhân sẽ được HIS tự động cấp.</p>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? <><Spinner size="sm" className="mr-2" />Đang lưu...</> : "Đăng ký bệnh nhân"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => router.back()}>Hủy</Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
