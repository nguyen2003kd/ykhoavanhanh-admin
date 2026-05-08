"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { mockPatients } from "@/mock-data/patients";
import { mockDoctors } from "@/mock-data/doctors";
import { mockSpecialties } from "@/mock-data/specialties";
import { useToast } from "@/components/ui/ToastProvider";

const TIME_SLOTS = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

export default function NewAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [form, setForm] = useState({
    patientId: searchParams.get("patientId") || "",
    specialtyId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    isForSelf: "true",
    note: "",
  });
  const [loading, setLoading] = useState(false);

  const filteredDoctors = form.specialtyId
    ? mockDoctors.filter((d) => d.specialtyId === form.specialtyId && d.isActive)
    : mockDoctors.filter((d) => d.isActive);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "specialtyId" ? { doctorId: "" } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientId || !form.doctorId || !form.appointmentDate || !form.appointmentTime) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Đặt lịch hẹn thành công!");
    router.push("/appointments");
  };

  const selectedPatient = mockPatients.find((p) => p.id === form.patientId);
  const selectedDoctor = mockDoctors.find((d) => d.id === form.doctorId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Đặt lịch hẹn mới</h1>
        <p className="text-sm text-gray-500 mt-0.5">Chọn bệnh nhân, bác sĩ, chuyên khoa và khung giờ khám</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Bệnh nhân */}
            <Card>
              <CardHeader><CardTitle>1. Chọn bệnh nhân</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Bệnh nhân *"
                  name="patientId"
                  value={form.patientId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn bệnh nhân --</option>
                  {mockPatients.filter(p => p.status === "active").map((p) => (
                    <option key={p.id} value={p.id}>{p.fullName} — {p.code} ({p.phone})</option>
                  ))}
                </Select>
                <Select
                  label="Đặt cho"
                  name="isForSelf"
                  value={form.isForSelf}
                  onChange={handleChange}
                >
                  <option value="true">Bản thân</option>
                  <option value="false">Người thân</option>
                </Select>
              </CardContent>
            </Card>

            {/* Chuyên khoa & bác sĩ */}
            <Card>
              <CardHeader><CardTitle>2. Chuyên khoa & Bác sĩ</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Chuyên khoa *"
                  name="specialtyId"
                  value={form.specialtyId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn chuyên khoa --</option>
                  {mockSpecialties.filter(s => s.isActive).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Select>
                <Select
                  label="Bác sĩ *"
                  name="doctorId"
                  value={form.doctorId}
                  onChange={handleChange}
                  required
                  disabled={!form.specialtyId}
                >
                  <option value="">-- Chọn bác sĩ --</option>
                  {filteredDoctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.fullName} — {d.title}</option>
                  ))}
                </Select>
              </CardContent>
            </Card>

            {/* Ngày giờ */}
            <Card>
              <CardHeader><CardTitle>3. Ngày & Giờ khám</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Ngày khám *"
                  name="appointmentDate"
                  type="date"
                  value={form.appointmentDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giờ khám *</label>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, appointmentTime: t }))}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                          form.appointmentTime === t
                            ? "bg-primary-600 text-white border-primary-600"
                            : "border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                  <textarea
                    name="note"
                    rows={3}
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Triệu chứng, yêu cầu đặc biệt..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tóm tắt */}
          <div>
            <Card className="sticky top-6">
              <CardHeader><CardTitle>Tóm tắt lịch hẹn</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-3">
                <div>
                  <p className="text-gray-500 text-xs">Bệnh nhân</p>
                  <p className="font-medium">{selectedPatient?.fullName || "—"}</p>
                  {selectedPatient && <p className="text-gray-500">{selectedPatient.phone}</p>}
                </div>
                <div className="border-t pt-3">
                  <p className="text-gray-500 text-xs">Bác sĩ</p>
                  <p className="font-medium">{selectedDoctor?.fullName || "—"}</p>
                  {selectedDoctor && <p className="text-gray-500">{selectedDoctor.specialtyName}</p>}
                </div>
                <div className="border-t pt-3">
                  <p className="text-gray-500 text-xs">Thời gian</p>
                  <p className="font-medium">{form.appointmentDate ? `${form.appointmentDate}` : "—"}</p>
                  <p className="font-medium">{form.appointmentTime || "Chưa chọn giờ"}</p>
                </div>
                <div className="border-t pt-4">
                  <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                    {loading ? "Đang xử lý..." : "Xác nhận đặt lịch"}
                  </Button>
                  <Button type="button" variant="ghost" className="w-full mt-2" onClick={() => router.back()}>
                    Hủy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
