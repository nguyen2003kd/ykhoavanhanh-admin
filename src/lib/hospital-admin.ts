import {
  AccountStatus,
  AdminSpecialty,
  Clinic,
  Doctor,
  ExamArea,
  ExamService,
  ExamTicket,
  InsuranceMode,
  Schedule,
  ScheduleStatus,
  ScheduleShift,
  TicketStatus,
} from "@/types/hospital-admin";

export const accountStatusLabels: Record<AccountStatus, string> = {
  active: "Hoạt động",
  inactive: "Ngừng sử dụng",
  on_leave: "Nghỉ đột xuất",
};

export const scheduleStatusLabels: Record<ScheduleStatus, string> = {
  draft: "Nháp",
  active: "Đang mở",
  paused: "Tạm dừng",
  closed: "Đã khóa",
};

export const shiftLabels: Record<ScheduleShift, string> = {
  morning: "Buổi sáng",
  afternoon: "Buổi chiều",
  evening: "Buổi tối",
  custom: "Ca tùy chỉnh",
};

export const insuranceModeLabels: Record<InsuranceMode, string> = {
  bhyt_and_service: "BHYT và Dịch vụ",
  service_only: "Chỉ Dịch vụ",
};

export const ticketStatusLabels: Record<TicketStatus, string> = {
  booked: "Đã đặt",
  confirmed: "Đã xác nhận",
  checked_in: "Đã tiếp nhận",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn",
};

export const weekdayLabels = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

export function getAreaName(areas: ExamArea[], areaId: string) {
  return areas.find((item) => item.id === areaId)?.name ?? "Chưa gán khu";
}

export function getAreaDescription(areas: ExamArea[], areaId: string) {
  return areas.find((item) => item.id === areaId)?.description ?? "";
}

export function getClinicName(clinics: Clinic[], clinicId: string) {
  return clinics.find((item) => item.id === clinicId)?.name ?? "Chưa gán phòng";
}

export function getDoctorName(doctors: Doctor[], doctorId: string) {
  return doctors.find((item) => item.id === doctorId)?.name ?? "Chưa gán bác sĩ";
}

export function getServiceName(services: ExamService[], serviceId: string) {
  return services.find((item) => item.id === serviceId)?.name ?? "Chưa gán dịch vụ";
}

export function getSpecialtyName(specialties: AdminSpecialty[], specialtyId: string) {
  return specialties.find((item) => item.id === specialtyId)?.name ?? "Chưa gán chuyên khoa";
}

export function formatScheduleRecurrence(schedule: Schedule) {
  if (schedule.recurrence_type === "date") {
    return schedule.work_dates.join(", ") || "Chưa chọn ngày";
  }
  return schedule.weekdays.map((weekday) => weekdayLabels[weekday]).join(", ") || "Chưa chọn thứ";
}

export function getTicketStatusVariant(status: TicketStatus) {
  switch (status) {
    case "completed":
      return "success";
    case "cancelled":
      return "danger";
    case "refunded":
      return "warning";
    case "confirmed":
    case "checked_in":
      return "info";
    default:
      return "default";
  }
}

export function getScheduleStatusVariant(status: ScheduleStatus) {
  switch (status) {
    case "active":
      return "success";
    case "paused":
      return "warning";
    case "closed":
      return "danger";
    default:
      return "default";
  }
}

export function getAccountStatusVariant(status: AccountStatus) {
  switch (status) {
    case "active":
      return "success";
    case "on_leave":
      return "warning";
    default:
      return "default";
  }
}

export function getSyncVariant(ticket: ExamTicket) {
  switch (ticket.his_sync_status) {
    case "synced":
      return "success";
    case "failed":
      return "danger";
    default:
      return "warning";
  }
}
