export type AuditFields = {
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
};

export type Gender = "male" | "female" | "other";
export type AccountStatus = "active" | "inactive" | "on_leave";
export type ScheduleShift = "morning" | "afternoon" | "evening" | "custom";
export type ScheduleStatus = "draft" | "active" | "paused" | "closed";
export type ScheduleRecurrenceType = "date" | "weekday";
export type InsuranceMode = "bhyt_and_service" | "service_only";
export type TicketStatus =
  | "booked"
  | "confirmed"
  | "checked_in"
  | "completed"
  | "cancelled"
  | "refunded";
export type SyncStatus = "synced" | "pending" | "failed";

export interface AdminSpecialty extends AuditFields {
  id: string;
  name: string;
  guide_room: string;
  booking_note: string;
  internal_id: string;
  booking_group: string;
  display_priority: number;
  hide_search: boolean;
}

export interface ExamArea extends AuditFields {
  id: string;
  name: string;
  description: string;
  address: string;
  internal_id: string;
}

export interface ClinicSpecialtyFee {
  specialty_id: string;
  fee: number;
}

export interface Clinic extends AuditFields {
  id: string;
  name: string;
  clinic_type: string;
  guide_room: string;
  booking_note: string;
  area_id: string;
  internal_id: string;
  specialty_fees: ClinicSpecialtyFee[];
}

export interface Doctor extends AuditFields {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  gender: Gender;
  date_of_birth: string;
  booking_note: string;
  internal_id: string;
  account_status: AccountStatus;
  booking_group: string;
  display_group: string;
  show_price: boolean;
  display_priority: number;
}

export interface ExamService extends AuditFields {
  id: string;
  name: string;
  service_type: string;
  service_group: string;
  insurance_visit_type: string;
  service_price: number;
  base_price: number;
  deposit: number;
  booking_note: string;
  detail: string;
  guide_room: string;
  internal_id: string;
  booking_group: string;
  display_group: string;
  show_price: boolean;
  display_priority: number;
}

export interface Schedule extends AuditFields {
  id: string;
  specialty_id: string;
  clinic_id: string;
  service_id: string;
  doctor_id: string;
  shift: ScheduleShift;
  ticket_limit: number;
  patient_flow: string;
  booking_group: string;
  source: string;
  status: ScheduleStatus;
  recurrence_type: ScheduleRecurrenceType;
  work_dates: string[];
  weekdays: number[];
  start_time: string;
  slot_duration_minutes: number;
  insurance_mode: InsuranceMode;
}

export interface ExamTicket extends AuditFields {
  id: string;
  ticket_number: string;
  patient_name: string;
  patient_code: string;
  app_patient_code: string;
  specialty_id: string;
  clinic_id: string;
  doctor_id: string;
  service_id: string;
  schedule_id: string;
  exam_date: string;
  booking_group: string;
  source: string;
  status: TicketStatus;
  his_sync_status: SyncStatus;
  booked_clinic_ids: string[];
  primary_clinic_id: string;
  note: string;
  refund_reason?: string;
  cancel_reason?: string;
}

export interface NightSyncJob {
  id: string;
  name: string;
  run_time: string;
  enabled: boolean;
  last_run_at?: string;
  next_run_at: string;
}
