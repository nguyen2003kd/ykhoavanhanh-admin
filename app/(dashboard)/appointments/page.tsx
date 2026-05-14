"use client";

import { FieldSection, HospitalCrudPage } from "@/components/hospital-admin/HospitalCrudPage";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useHospitalAdminStore } from "@/hooks/useHospitalAdminStore";
import {
  getClinicName,
  getDoctorName,
  getServiceName,
  getSpecialtyName,
  scheduleStatusLabels,
  shiftLabels,
  weekdayLabels,
} from "@/lib/hospital-admin";
import { Schedule } from "@/types/hospital-admin";

type ScheduleForm = {
  specialty_id: string;
  clinic_id: string;
  service_id: string;
  doctor_id: string;
  shift: "morning" | "afternoon" | "evening" | "custom";
  ticket_limit: number;
  patient_flow: string;
  booking_group: string;
  source: string;
  status: "draft" | "active" | "paused" | "closed";
  recurrence_type: "date" | "weekday";
  work_dates: string[];
  weekdays: number[];
  start_time: string;
  slot_duration_minutes: number;
  insurance_mode: "bhyt_and_service" | "service_only";
};

const createInitialForm = (): ScheduleForm => ({
  specialty_id: "",
  clinic_id: "",
  service_id: "",
  doctor_id: "",
  shift: "morning",
  ticket_limit: 20,
  patient_flow: "",
  booking_group: "",
  source: "app",
  status: "draft",
  recurrence_type: "weekday",
  work_dates: [],
  weekdays: [1],
  start_time: "08:00",
  slot_duration_minutes: 15,
  insurance_mode: "bhyt_and_service",
});

function mapItemToForm(item: Schedule): ScheduleForm {
  return {
    specialty_id: item.specialty_id,
    clinic_id: item.clinic_id,
    service_id: item.service_id,
    doctor_id: item.doctor_id,
    shift: item.shift,
    ticket_limit: item.ticket_limit,
    patient_flow: item.patient_flow,
    booking_group: item.booking_group,
    source: item.source,
    status: item.status,
    recurrence_type: item.recurrence_type,
    work_dates: [...item.work_dates],
    weekdays: [...item.weekdays],
    start_time: item.start_time,
    slot_duration_minutes: item.slot_duration_minutes,
    insurance_mode: item.insurance_mode,
  };
}

export default function AppointmentsPage() {
  const schedules = useHospitalAdminStore((state) => state.schedules);
  const specialties = useHospitalAdminStore((state) => state.specialties);
  const clinics = useHospitalAdminStore((state) => state.clinics);
  const services = useHospitalAdminStore((state) => state.services);
  const doctors = useHospitalAdminStore((state) => state.doctors);
  const addSchedule = useHospitalAdminStore((state) => state.addSchedule);
  const updateSchedule = useHospitalAdminStore((state) => state.updateSchedule);
  const deleteSchedule = useHospitalAdminStore((state) => state.deleteSchedule);

  return (
    <HospitalCrudPage
      title="Quản lý lịch khám"
      description="Tùy chỉnh lịch khám theo buổi, theo thứ hoặc theo ngày trong tháng; thay đổi giờ bắt đầu, thời gian mỗi slot và chế độ BHYT/Dịch vụ theo từng ngày làm việc."
      itemName="lịch khám"
      compact
      items={schedules}
      createInitialForm={createInitialForm}
      mapItemToForm={mapItemToForm}
      onCreate={addSchedule}
      onUpdate={updateSchedule}
      onDelete={deleteSchedule}
      getSearchText={(item) =>
        [
          item.id,
          getSpecialtyName(specialties, item.specialty_id),
          getClinicName(clinics, item.clinic_id),
          getDoctorName(doctors, item.doctor_id),
          getServiceName(services, item.service_id),
          item.booking_group,
          item.source,
          item.patient_flow,
        ].join(" ")
      }
      columns={[
        {
          title: "Chuyên khoa",
          render: (item) => getSpecialtyName(specialties, item.specialty_id),
        },
        {
          title: "Phòng khám",
          render: (item) => getClinicName(clinics, item.clinic_id),
        },
        {
          title: "Dịch vụ",
          render: (item) => getServiceName(services, item.service_id),
        },
        {
          title: "Bác sĩ",
          render: (item) => getDoctorName(doctors, item.doctor_id),
        },
        {
          title: "Ca làm việc",
          render: (item) => shiftLabels[item.shift],
        },
        {
          title: "Số phiếu khám",
          render: (item) => item.ticket_limit,
        },
        {
          title: "Luồng khám",
          render: (item) => item.patient_flow,
        },
        {
          title: "Nhóm đặt khám",
          render: (item) => item.booking_group,
        },
        {
          title: "Nguồn",
          render: (item) => item.source,
        },
        {
          title: "Trạng thái",
          render: (item) => scheduleStatusLabels[item.status],
        },
      ]}
      renderForm={(form, setForm) => (
        <div className="space-y-5">
          <FieldSection
            title="Liên kết lịch khám"
            description="Một bác sĩ có thể ngồi nhiều phòng khám khác nhau theo lịch; một phòng cũng có thể có nhiều bác sĩ khác nhau."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Chuyên khoa"
                value={form.specialty_id}
                onChange={(event) => setForm((prev) => ({ ...prev, specialty_id: event.target.value }))}
                options={specialties.map((specialty) => ({ value: specialty.id, label: specialty.name }))}
                placeholder="Chọn chuyên khoa"
              />
              <Select
                label="Phòng khám"
                value={form.clinic_id}
                onChange={(event) => setForm((prev) => ({ ...prev, clinic_id: event.target.value }))}
                options={clinics.map((clinic) => ({ value: clinic.id, label: clinic.name }))}
                placeholder="Chọn phòng khám"
              />
              <Select
                label="Dịch vụ"
                value={form.service_id}
                onChange={(event) => setForm((prev) => ({ ...prev, service_id: event.target.value }))}
                options={services.map((service) => ({ value: service.id, label: service.name }))}
                placeholder="Chọn dịch vụ"
              />
              <Select
                label="Bác sĩ"
                value={form.doctor_id}
                onChange={(event) => setForm((prev) => ({ ...prev, doctor_id: event.target.value }))}
                options={doctors.map((doctor) => ({ value: doctor.id, label: doctor.name }))}
                placeholder="Chọn bác sĩ"
              />
            </div>
          </FieldSection>

          <FieldSection
            title="Thiết lập ca khám"
            description="Cho phép đổi ca làm việc, giờ bắt đầu khám, thời gian mỗi slot và số phiếu khám."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Ca làm việc"
                value={form.shift}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    shift: event.target.value as ScheduleForm["shift"],
                  }))
                }
                options={[
                  { value: "morning", label: "Buổi sáng" },
                  { value: "afternoon", label: "Buổi chiều" },
                  { value: "evening", label: "Buổi tối" },
                  { value: "custom", label: "Ca tùy chỉnh" },
                ]}
              />
              <Input
                label="Giờ bắt đầu khám"
                type="time"
                value={form.start_time}
                onChange={(event) => setForm((prev) => ({ ...prev, start_time: event.target.value }))}
              />
              <Input
                label="Thời gian mỗi slot (phút)"
                type="number"
                value={String(form.slot_duration_minutes)}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    slot_duration_minutes: Number(event.target.value) || 0,
                  }))
                }
              />
              <Input
                label="Số phiếu khám"
                type="number"
                value={String(form.ticket_limit)}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, ticket_limit: Number(event.target.value) || 0 }))
                }
              />
              <Input
                label="Luồng khám"
                value={form.patient_flow}
                onChange={(event) => setForm((prev) => ({ ...prev, patient_flow: event.target.value }))}
                placeholder="VD: Khám theo hẹn"
              />
              <Input
                label="Nhóm đặt khám"
                value={form.booking_group}
                onChange={(event) => setForm((prev) => ({ ...prev, booking_group: event.target.value }))}
              />
              <Input
                label="Nguồn"
                value={form.source}
                onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value }))}
                placeholder="VD: app / counter / partner"
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
                  { value: "draft", label: "Nháp" },
                  { value: "active", label: "Đang mở" },
                  { value: "paused", label: "Tạm dừng" },
                  { value: "closed", label: "Đã khóa" },
                ]}
              />
              <Select
                label="Chế độ khám"
                value={form.insurance_mode}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    insurance_mode: event.target.value as ScheduleForm["insurance_mode"],
                  }))
                }
                options={[
                  { value: "bhyt_and_service", label: "BHYT và Dịch vụ" },
                  { value: "service_only", label: "Chỉ Dịch vụ" },
                ]}
              />
            </div>
          </FieldSection>

          <FieldSection
            title="Ngày làm việc trong tháng"
            description="Có thể cấu hình theo thứ cố định hoặc chọn ngày cụ thể theo tháng."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Kiểu lặp lịch"
                value={form.recurrence_type}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    recurrence_type: event.target.value as ScheduleForm["recurrence_type"],
                  }))
                }
                options={[
                  { value: "weekday", label: "Theo thứ trong tuần" },
                  { value: "date", label: "Theo ngày cụ thể" },
                ]}
              />
            </div>

            {form.recurrence_type === "weekday" ? (
              <div className="grid gap-2 md:grid-cols-4">
                {weekdayLabels.map((label, index) => (
                  <label key={label} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
                    <input
                      type="checkbox"
                      checked={form.weekdays.includes(index)}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          weekdays: event.target.checked
                            ? [...prev.weekdays, index].sort((a, b) => a - b)
                            : prev.weekdays.filter((weekday) => weekday !== index),
                        }))
                      }
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {(form.work_dates.length === 0 ? [""] : form.work_dates).map((date, index) => (
                  <div key={`${date}-${index}`} className="grid gap-3 md:grid-cols-[1fr_auto]">
                    <Input
                      label={`Ngày làm việc ${index + 1}`}
                      type="date"
                      value={date}
                      onChange={(event) =>
                        setForm((prev) => {
                          const nextDates = [...prev.work_dates];
                          nextDates[index] = event.target.value;
                          return { ...prev, work_dates: nextDates };
                        })
                      }
                    />
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            work_dates: prev.work_dates.filter((_, dateIndex) => dateIndex !== index),
                          }))
                        }
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Xóa ngày
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      work_dates: [...prev.work_dates, ""],
                    }))
                  }
                  className="rounded-lg border border-dashed border-primary-300 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50"
                >
                  Thêm ngày làm việc
                </button>
              </div>
            )}
          </FieldSection>
        </div>
      )}
    />
  );
}
