"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useCreatePatient } from "@/api/patientApi";
import { useNations, useProfessions, useProvinces, useDistricts, useWards } from "@/api/addressesApi";
import { toast } from "@/components/ui/Toast";
import type { CreatePatientPayload } from "@/types/patient";

export default function NewPatientPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    patientfirstname: "",
    patientlastname: "",
    patientbirthday: "",
    patientsex: "nam",
    patientphonenumber: "",
    patientethnic: "",
    identifynumber: "",
    insurancenumber: "",
    addressdetail: "",
    addressstreet: "",
    addressprovince: "",
    addresscity: "",
    addressward: "",
    addresscountry: "",
    professionid: "",
  });

  // Fetch address data
  const { data: nations } = useNations();
  const { data: professions } = useProfessions();
  const { data: provinces } = useProvinces();
  const { data: districts } = useDistricts(form.addressprovince || null);
  const { data: wards } = useWards(form.addresscity || null);

  const createMutation = useCreatePatient({
    onSuccess: (data) => {
      toast.success(`Da them benh nhan thanh cong! Ma BN: ${data.his_patient_id ?? data.id}`);
      router.push("/patients");
    },
    onError: (err) => toast.error(err.message || "Tao benh nhan that bai"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const newForm = { ...prev, [name]: value };
      // Reset district when province changes
      if (name === "addressprovince") {
        newForm.addresscity = "";
        newForm.addressward = "";
      }
      // Reset ward when district changes
      if (name === "addresscity") {
        newForm.addressward = "";
      }
      return newForm;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientfirstname || !form.patientlastname) {
      toast.error("Vui long nhap ho va ten benh nhan.");
      return;
    }
    const payload: CreatePatientPayload = {
      patientid: "",
      patientfirstname: form.patientfirstname,
      patientlastname: form.patientlastname,
      patientbirthday: form.patientbirthday || undefined,
      patientsex: form.patientsex || undefined,
      patientphonenumber: form.patientphonenumber || undefined,
      patientethnic: form.patientethnic || undefined,
      identifynumber: form.identifynumber || undefined,
      insurancenumber: form.insurancenumber || undefined,
      addressdetail: form.addressdetail || undefined,
      addressstreet: form.addressstreet || undefined,
      addressprovince: form.addressprovince || undefined,
      addresscity: form.addresscity || undefined,
      addressward: form.addressward || undefined,
      addresscountry: form.addresscountry || undefined,
      professionid: form.professionid || undefined,
    };
    createMutation.mutate({ payload });
  };

  const loading = createMutation.isPending;
  const isLoadingAddress = !provinces;

  // Options for selects
  const nationOptions = nations?.map((n) => ({ value: n.nationid, label: n.nationname })) || [];
  const professionOptions = professions?.map((p) => ({ value: p.professionid, label: p.professionname })) || [];
  const provinceOptions = provinces?.map((p) => ({ value: p.city, label: p.cityname })) || [];
  const districtOptions = districts?.map((d) => ({ value: d.districtcode, label: d.districtname || d.districtcode })) || [];
  const wardOptions = wards?.map((w) => ({ value: w.wardcode, label: w.wardname || w.wardcode })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>← Quay lai</Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Them benh nhan moi</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tao ho so benh nhan moi tren HIS</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Thong tin ca nhan</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Ho, chu lot *" name="patientfirstname" value={form.patientfirstname} onChange={handleChange} placeholder="Nguyen Thi" required />
                <Input label="Ten *" name="patientlastname" value={form.patientlastname} onChange={handleChange} placeholder="Lan" required />
                <Input label="Ngay sinh" name="patientbirthday" type="date" value={form.patientbirthday} onChange={handleChange} placeholder="yyyy/mm/dd" />
                <Select
                  label="Gioi tinh"
                  value={form.patientsex}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, patientsex: val }))}
                  options={[
                    { value: "nam", label: "Nam" },
                    { value: "nu", label: "Nu" },
                  ]}
                />
                <Input label="So dien thoai" name="patientphonenumber" value={form.patientphonenumber} onChange={handleChange} placeholder="09xxxxxxxx" />
                <Select
                  label="Dan toc"
                  name="patientethnic"
                  value={form.patientethnic}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, patientethnic: val }))}
                  options={nationOptions}
                  placeholder="Chon dan toc"
                />
                <Select
                  label="Nghe nghiep"
                  name="professionid"
                  value={form.professionid}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, professionid: val }))}
                  options={professionOptions}
                  placeholder="Chon nghe nghiep"
                />
                <Input label="So CCCD" name="identifynumber" value={form.identifynumber} onChange={handleChange} placeholder="So can cuoc cong dan" />
                <Input label="Ma BHYT" name="insurancenumber" value={form.insurancenumber} onChange={handleChange} placeholder="So bao hiem y te" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Dia chi</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input label="So nha" name="addressdetail" value={form.addressdetail} onChange={handleChange} placeholder="12A" />
              <Input label="Duong/Thon" name="addressstreet" value={form.addressstreet} onChange={handleChange} placeholder="Nguyen Van Cu" />
              <div className="grid grid-cols-3 gap-4">
                <Select
                  label="Tinh/Thanh"
                  name="addressprovince"
                  value={form.addressprovince}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, addressprovince: val, addresscity: "", addressward: "" }))}
                  options={provinceOptions}
                  placeholder={isLoadingAddress ? "Dang tai..." : "Chon tinh/thanh"}
                  disabled={isLoadingAddress}
                />
                <Select
                  label="Quan/Huyen"
                  name="addresscity"
                  value={form.addresscity}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, addresscity: val, addressward: "" }))}
                  options={districtOptions}
                  placeholder={!form.addressprovince ? "Chon tinh truoc" : districtOptions.length ? "Chon quan/huyen" : "Khong co du lieu"}
                  disabled={!form.addressprovince}
                />
                <Select
                  label="Phuong/Xa"
                  name="addressward"
                  value={form.addressward}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, addressward: val }))}
                  options={wardOptions}
                  placeholder={!form.addresscity ? "Chon quan truoc" : wardOptions.length ? "Chon phuong/xa" : "Khong co du lieu"}
                  disabled={!form.addresscity}
                />
              </div>
              <Select
                label="Quoc gia"
                name="addresscountry"
                value={form.addresscountry}
                onValueChange={(val) => setForm((prev) => ({ ...prev, addresscountry: val }))}
                options={[
                  { value: "VN", label: "Viet Nam" },
                  { value: "其他", label: "Quoc gia khac" },
                ]}
                placeholder="Chon quoc gia"
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader><CardTitle>Luu ho so</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-500">Kiem tra lai thong tin truoc khi luu. Sau khi tao, ma benh nhân se duoc HIS tu dong cap.</p>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? <><Spinner size="sm" className="mr-2" />Dang luu...</> : "Dang ky benh nhan"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => router.back()}>Huy</Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}