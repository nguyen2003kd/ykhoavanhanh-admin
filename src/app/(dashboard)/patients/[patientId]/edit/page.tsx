"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { LoadingSection } from "@/components/ui/Spinner";
import { useGetPatientById, useUpdatePatient } from "@/api/patientApi";
import { toast } from "@/components/ui/Toast";
import type { CreatePatientPayload } from "@/types/patient";

export default function EditPatientPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = use(params);
  const router = useRouter();
  const { data: patient, isLoading } = useGetPatientById(patientId);

  const updateMutation = useUpdatePatient({
    onSuccess: () => {
      toast.success("Cập nhật bệnh nhân thành công");
      router.push(`/patients/${patientId}`);
    },
    onError: (err) => toast.error(err.message || "Cập nhật bệnh nhân thất bại"),
  });

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

  // Sync form when patient data loads
  useEffect(() => {
    if (patient) {
      setForm({
        patientfirstname: patient.patientfirstname ?? "",
        patientlastname: patient.patientlastname ?? "",
        patientbirthday: patient.patientbirthday ?? "",
        patientsex: patient.patientsex ?? "",
        patientphonenumber: patient.patientphonenumber ?? "",
        identifynumber: patient.identifynumber ?? "",
        insurancenumber: patient.insurancenumber ?? "",
        addressdetail: patient.addressdetail ?? "",
        addressstreet: patient.addressstreet ?? "",
        addressward: patient.addressward ?? "",
        addresscity: patient.addresscity ?? "",
        addressprovince: patient.addressprovince ?? "",
      });
    }
  }, [patient]);

  if (isLoading) {
    return <LoadingSection text="Đang tải thông tin bệnh nhân..." />;
  }

  if (!patient) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Không tìm thấy bệnh nhân.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Partial<CreatePatientPayload> = {
      patientid: patientId,
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
    updateMutation.mutate({ patientId, payload });
  }

  const loading = updateMutation.isPending;
  const fullName = [patient.patientfirstname, patient.patientlastname].filter(Boolean).join(" ");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa bệnh nhân</h1>
          <p className="text-sm text-gray-500 mt-0.5">{patient.patientid} – {fullName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Personal info */}
          <Card>
            <CardHeader><CardTitle>Thông tin cá nhân</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Input label="Họ, chữ lót *" required value={form.patientfirstname} onChange={(e) => setForm({ ...form, patientfirstname: e.target.value })} />
              <Input label="Tên *" required value={form.patientlastname} onChange={(e) => setForm({ ...form, patientlastname: e.target.value })} />
              <Input label="Ngày sinh" type="date" value={form.patientbirthday} onChange={(e) => setForm({ ...form, patientbirthday: e.target.value })} />
              <Select
                label="Giới tính"
                value={form.patientsex}
                onValueChange={(val) => setForm({ ...form, patientsex: val })}
                options={[
                  { value: "", label: "-- Chọn --" },
                  { value: "nam", label: "Nam" },
                  { value: "nữ", label: "Nữ" },
                ]}
              />
              <Input label="Số điện thoại" value={form.patientphonenumber} onChange={(e) => setForm({ ...form, patientphonenumber: e.target.value })} />
              <Input label="Số CCCD" value={form.identifynumber} onChange={(e) => setForm({ ...form, identifynumber: e.target.value })} />
              <Input label="Mã BHYT" value={form.insurancenumber} onChange={(e) => setForm({ ...form, insurancenumber: e.target.value })} />
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader><CardTitle>Địa chỉ</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Input label="Số nhà" value={form.addressdetail} onChange={(e) => setForm({ ...form, addressdetail: e.target.value })} />
              <Input label="Đường/Thôn" value={form.addressstreet} onChange={(e) => setForm({ ...form, addressstreet: e.target.value })} />
              <Input label="Mã Phường/Xã" value={form.addressward} onChange={(e) => setForm({ ...form, addressward: e.target.value })} />
              <Input label="Mã Quận/Huyện" value={form.addresscity} onChange={(e) => setForm({ ...form, addresscity: e.target.value })} />
              <Input label="Mã Tỉnh/Thành" value={form.addressprovince} onChange={(e) => setForm({ ...form, addressprovince: e.target.value })} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader><CardTitle>Lưu thay đổi</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-500">Kiểm tra lại thông tin trước khi lưu.</p>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? <><Spinner size="sm" className="mr-2" />Đang lưu...</> : "Lưu thay đổi"}
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
