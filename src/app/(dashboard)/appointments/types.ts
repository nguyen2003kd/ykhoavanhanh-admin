export type AppointmentStatus =
  | "pending"     // Chờ xác nhận
  | "confirmed"   // Đã xác nhận
  | "completed"   // Đã khám
  | "cancelled"   // Đã hủy
  | "no_show";    // Vắng mặt

export interface Appointment {
  id: string;
  code: string; // Mã lịch hẹn
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  specialtyId: string;
  specialtyName: string;
  appointmentDate: string; // ISO date
  appointmentTime: string; // HH:mm
  status: AppointmentStatus;
  note?: string;
  isForSelf: boolean; // Đặt cho bản thân hay người thân
  familyMemberId?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentSlot {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  isAvailable: boolean;
  maxPatients: number;
  currentPatients: number;
}
