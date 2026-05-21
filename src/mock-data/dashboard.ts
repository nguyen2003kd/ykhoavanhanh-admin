import { DashboardKpi, AppointmentStat, RevenueData } from "@/types/report";

export const mockKpis: DashboardKpi[] = [
  { label: "Tổng bệnh nhân", value: "4,520", change: "+120 tháng này", changeType: "up" },
  { label: "Lịch hẹn hôm nay", value: 42, change: "+8 so với hôm qua", changeType: "up" },
  { label: "Đánh giá trung bình", value: "4.8/5", change: "Ổn định", changeType: "neutral" },
  { label: "Tỉ lệ xác nhận", value: "92%", change: "+2% tuần này", changeType: "up" },
  { label: "Thành viên đang hoạt động", value: 1240, change: "+45 tháng này", changeType: "up" },
  { label: "Doanh thu tháng", value: "₫ 348,500,000", change: "+15% tháng trước", changeType: "up" },
];

export const mockAppointmentStats: AppointmentStat[] = [
  { date: "2024-07-01", confirmed: 30, pending: 5, cancelled: 2, completed: 28 },
  { date: "2024-07-02", confirmed: 35, pending: 3, cancelled: 1, completed: 34 },
  { date: "2024-07-03", confirmed: 28, pending: 7, cancelled: 3, completed: 26 },
  { date: "2024-07-04", confirmed: 40, pending: 4, cancelled: 2, completed: 38 },
  { date: "2024-07-05", confirmed: 38, pending: 6, cancelled: 1, completed: 36 },
  { date: "2024-07-08", confirmed: 42, pending: 5, cancelled: 3, completed: 40 },
  { date: "2024-07-09", confirmed: 36, pending: 8, cancelled: 2, completed: 34 },
];

export const mockRevenueData: RevenueData[] = [
  { month: "01/2024", amount: 280000000 },
  { month: "02/2024", amount: 245000000 },
  { month: "03/2024", amount: 310000000 },
  { month: "04/2024", amount: 295000000 },
  { month: "05/2024", amount: 325000000 },
  { month: "06/2024", amount: 302000000 },
  { month: "07/2024", amount: 348500000 },
];
