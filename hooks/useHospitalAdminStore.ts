"use client";

import { create } from "zustand";
import {
  AdminSpecialty,
  Clinic,
  Doctor,
  ExamArea,
  ExamService,
  ExamTicket,
  NightSyncJob,
  Schedule,
} from "@/types/hospital-admin";
import {
  mockAdminSpecialties,
  mockClinics,
  mockDoctorsAdmin,
  mockExamAreas,
  mockExamServices,
  mockExamTickets,
  mockNightSyncJobs,
  mockSchedules,
} from "@/mock-data/hospital-admin";

type HospitalAdminState = {
  specialties: AdminSpecialty[];
  areas: ExamArea[];
  clinics: Clinic[];
  doctors: Doctor[];
  services: ExamService[];
  schedules: Schedule[];
  tickets: ExamTicket[];
  syncJobs: NightSyncJob[];
  addSpecialty: (item: Omit<AdminSpecialty, "id" | "created_at" | "created_by" | "updated_at" | "updated_by">) => void;
  updateSpecialty: (id: string, item: Partial<AdminSpecialty>) => void;
  deleteSpecialty: (id: string) => void;
  addArea: (item: Omit<ExamArea, "id" | "created_at" | "created_by" | "updated_at" | "updated_by">) => void;
  updateArea: (id: string, item: Partial<ExamArea>) => void;
  deleteArea: (id: string) => void;
  addClinic: (item: Omit<Clinic, "id" | "created_at" | "created_by" | "updated_at" | "updated_by">) => void;
  updateClinic: (id: string, item: Partial<Clinic>) => void;
  deleteClinic: (id: string) => void;
  addDoctor: (item: Omit<Doctor, "id" | "created_at" | "created_by" | "updated_at" | "updated_by">) => void;
  updateDoctor: (id: string, item: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  addService: (item: Omit<ExamService, "id" | "created_at" | "created_by" | "updated_at" | "updated_by">) => void;
  updateService: (id: string, item: Partial<ExamService>) => void;
  deleteService: (id: string) => void;
  addSchedule: (item: Omit<Schedule, "id" | "created_at" | "created_by" | "updated_at" | "updated_by">) => void;
  updateSchedule: (id: string, item: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  syncTicketPatientCode: (ticketId: string, patientCode: string) => void;
  reassignTicket: (ticketId: string, clinicId: string, doctorId: string) => void;
  refundTicket: (ticketId: string, reason: string) => { ok: boolean; message: string };
  cancelTicket: (ticketId: string, reason: string) => { ok: boolean; message: string };
  runNightSyncNow: () => void;
};

const currentUser = "super_admin";

function createAudit() {
  const now = new Date().toISOString();
  return {
    created_at: now,
    created_by: currentUser,
    updated_at: now,
    updated_by: currentUser,
  };
}

function createUpdateAudit<T extends { updated_at: string; updated_by: string }>(item: T): T {
  return {
    ...item,
    updated_at: new Date().toISOString(),
    updated_by: currentUser,
  };
}

function nextId(prefix: string, size: number) {
  return `${prefix}-${String(size + 1).padStart(2, "0")}`;
}

export const useHospitalAdminStore = create<HospitalAdminState>((set) => ({
  specialties: mockAdminSpecialties,
  areas: mockExamAreas,
  clinics: mockClinics,
  doctors: mockDoctorsAdmin,
  services: mockExamServices,
  schedules: mockSchedules,
  tickets: mockExamTickets,
  syncJobs: mockNightSyncJobs,

  addSpecialty: (item) =>
    set((state) => ({
      specialties: [
        ...state.specialties,
        { id: nextId("sp", state.specialties.length), ...item, ...createAudit() },
      ],
    })),
  updateSpecialty: (id, item) =>
    set((state) => ({
      specialties: state.specialties.map((entry) =>
        entry.id === id ? createUpdateAudit({ ...entry, ...item }) : entry
      ),
    })),
  deleteSpecialty: (id) =>
    set((state) => ({
      specialties: state.specialties.filter((entry) => entry.id !== id),
    })),

  addArea: (item) =>
    set((state) => ({
      areas: [...state.areas, { id: nextId("area", state.areas.length), ...item, ...createAudit() }],
    })),
  updateArea: (id, item) =>
    set((state) => ({
      areas: state.areas.map((entry) =>
        entry.id === id ? createUpdateAudit({ ...entry, ...item }) : entry
      ),
    })),
  deleteArea: (id) =>
    set((state) => ({
      areas: state.areas.filter((entry) => entry.id !== id),
    })),

  addClinic: (item) =>
    set((state) => ({
      clinics: [...state.clinics, { id: nextId("clinic", state.clinics.length), ...item, ...createAudit() }],
    })),
  updateClinic: (id, item) =>
    set((state) => ({
      clinics: state.clinics.map((entry) =>
        entry.id === id ? createUpdateAudit({ ...entry, ...item }) : entry
      ),
    })),
  deleteClinic: (id) =>
    set((state) => ({
      clinics: state.clinics.filter((entry) => entry.id !== id),
    })),

  addDoctor: (item) =>
    set((state) => ({
      doctors: [...state.doctors, { id: nextId("doc", state.doctors.length), ...item, ...createAudit() }],
    })),
  updateDoctor: (id, item) =>
    set((state) => ({
      doctors: state.doctors.map((entry) =>
        entry.id === id ? createUpdateAudit({ ...entry, ...item }) : entry
      ),
    })),
  deleteDoctor: (id) =>
    set((state) => ({
      doctors: state.doctors.filter((entry) => entry.id !== id),
    })),

  addService: (item) =>
    set((state) => ({
      services: [...state.services, { id: nextId("svc", state.services.length), ...item, ...createAudit() }],
    })),
  updateService: (id, item) =>
    set((state) => ({
      services: state.services.map((entry) =>
        entry.id === id ? createUpdateAudit({ ...entry, ...item }) : entry
      ),
    })),
  deleteService: (id) =>
    set((state) => ({
      services: state.services.filter((entry) => entry.id !== id),
    })),

  addSchedule: (item) =>
    set((state) => ({
      schedules: [...state.schedules, { id: nextId("sch", state.schedules.length), ...item, ...createAudit() }],
    })),
  updateSchedule: (id, item) =>
    set((state) => ({
      schedules: state.schedules.map((entry) =>
        entry.id === id ? createUpdateAudit({ ...entry, ...item }) : entry
      ),
    })),
  deleteSchedule: (id) =>
    set((state) => ({
      schedules: state.schedules.filter((entry) => entry.id !== id),
    })),

  syncTicketPatientCode: (ticketId, patientCode) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? createUpdateAudit({
              ...ticket,
              patient_code: patientCode,
              his_sync_status: "synced",
              note: `Đã đồng bộ mã BN từ App sang HIS: ${patientCode}`,
            })
          : ticket
      ),
    })),

  reassignTicket: (ticketId, clinicId, doctorId) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? createUpdateAudit({
              ...ticket,
              clinic_id: clinicId,
              doctor_id: doctorId,
              note: "Đã cập nhật lại phòng khám/bác sĩ theo điều phối admin.",
            })
          : ticket
      ),
    })),

  refundTicket: (ticketId, reason) => {
    let result = { ok: false, message: "Không tìm thấy phiếu khám." };
    set((state) => {
      const target = state.tickets.find((ticket) => ticket.id === ticketId);
      if (!target) return state;
      if (target.booked_clinic_ids.length > 1 && target.primary_clinic_id === target.clinic_id) {
        result = {
          ok: false,
          message:
            "Không thể hoàn/hủy phòng khám đầu khi bệnh nhân đã đăng ký 2 phòng khám. Cần xử lý phòng khám sau trước để tránh giữ khuyến mãi 50%.",
        };
        return state;
      }
      result = { ok: true, message: "Đã hoàn phiếu và ghi nhận vào báo cáo hoàn/hủy." };
      return {
        ...state,
        tickets: state.tickets.map((ticket) =>
          ticket.id === ticketId
            ? createUpdateAudit({
                ...ticket,
                status: "refunded",
                refund_reason: reason,
                note: `Admin hoàn phiếu: ${reason}`,
              })
            : ticket
        ),
      };
    });
    return result;
  },

  cancelTicket: (ticketId, reason) => {
    let result = { ok: false, message: "Không tìm thấy phiếu khám." };
    set((state) => {
      const target = state.tickets.find((ticket) => ticket.id === ticketId);
      if (!target) return state;
      if (target.booked_clinic_ids.length > 1 && target.primary_clinic_id === target.clinic_id) {
        result = {
          ok: false,
          message:
            "Không thể hủy phòng khám đầu khi còn phòng khám thứ hai. Cần chặn để không sai logic khuyến mãi giảm 50%.",
        };
        return state;
      }
      result = { ok: true, message: "Đã hủy phiếu khám." };
      return {
        ...state,
        tickets: state.tickets.map((ticket) =>
          ticket.id === ticketId
            ? createUpdateAudit({
                ...ticket,
                status: "cancelled",
                cancel_reason: reason,
                note: `Admin hủy phiếu: ${reason}`,
              })
            : ticket
        ),
      };
    });
    return result;
  },

  runNightSyncNow: () =>
    set((state) => ({
      syncJobs: state.syncJobs.map((job) =>
        job.id === "sync-23h"
          ? {
              ...job,
              last_run_at: new Date().toISOString(),
              next_run_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            }
          : job
      ),
      tickets: state.tickets.map((ticket) =>
        ticket.his_sync_status === "pending"
          ? createUpdateAudit({
              ...ticket,
              his_sync_status: "synced",
              note: "Đã đồng bộ tự động vào 23h cho ngày hôm sau.",
            })
          : ticket
      ),
    })),
}));
