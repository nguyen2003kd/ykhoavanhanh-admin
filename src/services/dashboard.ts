import { apiClient } from "@/lib/api-client";
import { DashboardKpi, AppointmentStat, DoctorPerformance, RevenueData } from "@/types/report";

export interface DashboardSummary {
  kpis: DashboardKpi[];
  appointmentStats: AppointmentStat[];
  doctorPerformance: DoctorPerformance[];
  revenueData: RevenueData[];
}

export const dashboardService = {
  getSummary: () => apiClient.get<DashboardSummary>("/api/v1/dashboard/summary"),
  getKpis: () => apiClient.get<DashboardKpi[]>("/api/v1/dashboard/kpis"),
  getAppointmentStats: (period: "week" | "month" | "year" = "month") =>
    apiClient.get<AppointmentStat[]>(`/api/v1/dashboard/appointment-stats?period=${period}`),
};
