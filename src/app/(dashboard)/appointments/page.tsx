"use client";

import { FieldSection, HospitalCrudPage } from "@/components/hospital-admin/HospitalCrudPage";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  doctorWorkSchedulesHooks,
  type DoctorWorkSchedule,
  type CreateDoctorWorkSchedulePayload,
} from "@/api/doctorWorkSchedulesApi";
import { examAreasHooks } from "@/api/examAreasApi";
import { doctorsHooks } from "@/api/doctorsApi";
import { toast } from "@/components/ui/Toast";

type ScheduleForm = {
  doctor_id: string;
  exam_area_id: string;
  specialty_id: string;
  room_id: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
  shift_code: string;
  max_appointments: number;
  exam_fee: number;
  allow_booking: boolean;
  status: "ACTIVE" | "INACTIVE";
  note: string;
};

const createInitialForm = (): ScheduleForm => ({
  doctor_id: "",
  exam_area_id: "",
  specialty_id: "",
  room_id: "",
  schedule_date: "",
  start_time: "07:30",
  end_time: "11:30",
  shift_code: "MORNING",
  max_appointments: 20,
  exam_fee: 150000,
  allow_booking: true,
  status: "ACTIVE",
  note: "",
});

function mapItemToForm(item: DoctorWorkSchedule): ScheduleForm {
  return {
    doctor_id: item.doctor_id,
    exam_area_id: item.exam_area_id,
    specialty_id: item.specialty_id ?? "",
    room_id: item.room_id ?? "",
    schedule_date: item.schedule_date,
    start_time: item.start_time.slice(0, 5),
    end_time: item.end_time.slice(0, 5),
    shift_code: item.shift_code ?? "MORNING",
    max_appointments: item.max_appointments ?? 20,
    exam_fee: item.exam_fee ? Number(item.exam_fee) : 0,
    allow_booking: item.allow_booking,
    status: item.status,
    note: item.note ?? "",
  };
}

function formToPayload(form: ScheduleForm): CreateDoctorWorkSchedulePayload {
  return {
    doctor_id: form.doctor_id,
    exam_area_id: form.exam_area_id,
    specialty_id: form.specialty_id || undefined,
    room_id: form.room_id || undefined,
    schedule_date: form.schedule_date,
    start_time: `${form.start_time}:00`,
    end_time: `${form.end_time}:00`,
    shift_code: form.shift_code,
    max_appointments: form.max_appointments,
    exam_fee: String(form.exam_fee),
    allow_booking: form.allow_booking,
    status: form.status,
    note: form.note || undefined,
  };
}

export default function AppointmentsPage() {
  const { data, isLoading } = doctorWorkSchedulesHooks.useList();
  const schedules = data?.rows ?? [];

  const { data: areasData } = examAreasHooks.useList();
  const examAreas = areasData?.rows ?? [];

  const { data: doctors } = doctorsHooks.useList();
  const doctorList = doctors ?? [];

  const createMutation = doctorWorkSchedulesHooks.useCreate({
    onSuccess: () => toast.success("Tạo lịch làm việc thành công"),
    onError: (err) => toast.error(err.message || "Tạo lịch làm việc thất bại"),
  });

  const updateMutation = doctorWorkSchedulesHooks.useUpdate({
    onSuccess: () => toast.success("Cập nhật lịch làm việc thành công"),
    onError: (err) => toast.error(err.message || "Cập nhật lịch làm việc thất bại"),
  });

  const deleteMutation = doctorWorkSchedulesHooks.useDelete({
    onSuccess: () => toast.success("Xóa lịch làm việc thành công"),
    onError: (err) => toast.error(err.message || "Xóa lịch làm việc thất bại"),
  });

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <HospitalCrudPage
      title="Quản lý lịch khám"
      description="Lịch làm việc bác sĩ theo ngày, ca khám, số slot và phí khám."
      itemName="lịch khám"
      compact
      isLoading={isLoading}
      isMutating={isMutating}
      items={schedules}
      createInitialForm={createInitialForm}
      mapItemToForm={mapItemToForm}
      onCreate={(form) => createMutation.mutate(formToPayload(form))}
      onUpdate={(id, form) => updateMutation.mutate({ id, data: formToPayload(form) })}
      onDelete={(id) => deleteMutation.mutate(id)}
      getSearchText={(item) =>
        [
          item.id,
          item.doctor?.doctor_name ?? "",
          item.exam_area?.name ?? "",
          item.schedule_date,
          item.shift_code ?? "",
          item.status,
        ].join(" ")
      }
      columns={[
        {
          title: "Bác sĩ",
          render: (item) => item.doctor?.doctor_name ?? "—",
        },
        {
          title: "Khu khám",
          render: (item) => item.exam_area?.name ?? "—",
        },
        {
          title: "Ngày khám",
          render: (item) => item.schedule_date,
        },
        {
          title: "Giờ",
          render: (item) => `${item.start_time.slice(0, 5)} - ${item.end_time.slice(0, 5)}`,
        },
        {
          title: "Ca",
          render: (item) => {
            const map: Record<string, string> = {
              MORNING: "Sáng",
              AFTERNOON: "Chiều",
              EVENING: "Tối",
              NIGHT: "Đêm",
            };
            return map[item.shift_code ?? ""] ?? (item.shift_code ?? "—");
          },
        },
        {
          title: "Slot tối đa",
          render: (item) => item.max_appointments ?? "—",
        },
        {
          title: "Đã đặt",
          render: (item) => item.booked_count,
        },
        {
          title: "Phí khám",
          render: (item) =>
            item.exam_fee
              ? `${Number(item.exam_fee).toLocaleString("vi-VN")} đ`
              : "—",
        },
        {
          title: "Trạng thái",
          render: (item) => (item.status === "ACTIVE" ? "Hoạt động" : "Ngưng"),
        },
      ]}
      renderForm={(form, setForm) => (
        <div className="space-y-5">
          <FieldSection
            title="Thông tin lịch khám"
            description="Chọn bác sĩ, khu khám và ngày giờ làm việc."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Bác sĩ *"
                value={form.doctor_id}
                onChange={(event) => setForm((prev) => ({ ...prev, doctor_id: event.target.value }))}
                options={[
                  { value: "", label: "-- Chọn bác sĩ --" },
                  ...doctorList.map((d) => ({ value: d.id, label: d.doctorname })),
                ]}
              />
              <Select
                label="Khu khám *"
                value={form.exam_area_id}
                onChange={(event) => setForm((prev) => ({ ...prev, exam_area_id: event.target.value }))}
                options={[
                  { value: "", label: "-- Chọn khu khám --" },
                  ...examAreas.map((a) => ({ value: a.id, label: a.name })),
                ]}
              />
              <Input
                label="Ngày khám *"
                type="date"
                value={form.schedule_date}
                onChange={(event) => setForm((prev) => ({ ...prev, schedule_date: event.target.value }))}
              />
              <Input
                label="Giờ bắt đầu *"
                type="time"
                value={form.start_time}
                onChange={(event) => setForm((prev) => ({ ...prev, start_time: event.target.value }))}
              />
              <Input
                label="Giờ kết thúc *"
                type="time"
                value={form.end_time}
                onChange={(event) => setForm((prev) => ({ ...prev, end_time: event.target.value }))}
              />
              <Select
                label="Ca khám"
                value={form.shift_code}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, shift_code: event.target.value }))
                }
                options={[
                  { value: "MORNING", label: "Sáng" },
                  { value: "AFTERNOON", label: "Chiều" },
                  { value: "EVENING", label: "Tối" },
                  { value: "NIGHT", label: "Đêm" },
                ]}
              />
            </div>
          </FieldSection>

          <FieldSection
            title="Cấu hình slot và phí"
            description="Thiết lập số lượng bệnh nhân tối đa, phí khám và trạng thái cho phép đặt lịch."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Số slot tối đa"
                type="number"
                value={String(form.max_appointments)}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    max_appointments: Number(event.target.value) || 0,
                  }))
                }
              />
              <Input
                label="Phí khám (VND)"
                type="number"
                value={String(form.exam_fee)}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    exam_fee: Number(event.target.value) || 0,
                  }))
                }
              />
              <Select
                label="Cho phép đặt lịch"
                value={String(form.allow_booking)}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    allow_booking: event.target.value === "true",
                  }))
                }
                options={[
                  { value: "true", label: "Có" },
                  { value: "false", label: "Không" },
                ]}
              />
              <Select
                label="Trạng thái"
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value as ScheduleForm["status"],
                  }))
                }
                options={[
                  { value: "ACTIVE", label: "Hoạt động" },
                  { value: "INACTIVE", label: "Ngưng" },
                ]}
              />
              <div className="col-span-2">
                <Input
                  label="Ghi chú"
                  value={form.note}
                  onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
                  placeholder="VD: Ca sáng thứ Tư"
                />
              </div>
            </div>
          </FieldSection>
        </div>
      )}
    />
  );
}
