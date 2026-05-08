export interface DashboardKpi {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
}

export interface AppointmentStat {
  date: string;
  confirmed: number;
  pending: number;
  cancelled: number;
  completed: number;
}

export interface DoctorPerformance {
  doctorId: string;
  doctorName: string;
  specialtyName: string;
  totalAppointments: number;
  completedAppointments: number;
  averageRating: number;
}

export interface RevenueData {
  month: string;
  amount: number;
}
