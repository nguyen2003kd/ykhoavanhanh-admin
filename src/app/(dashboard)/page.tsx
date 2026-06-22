"use client";

import { Card } from "@/components/ui/Card";
import {
  FiUsers,
  FiCalendar,
  FiStar,
  FiTrendingUp,
  FiActivity,
  FiAward,
} from "react-icons/fi";

const kpiCards = [
  {
    title: "Tổng bệnh nhân",
    value: "2,847",
    change: "+12%",
    changeType: "up" as const,
    icon: FiUsers,
    color: "bg-primary-600",
  },
  {
    title: "Lịch hẹn hôm nay",
    value: "134",
    change: "+5%",
    changeType: "up" as const,
    icon: FiCalendar,
    color: "bg-primary-500",
  },
  {
    title: "Đánh giá trung bình",
    value: "4.8 ★",
    change: "+0.2",
    changeType: "up" as const,
    icon: FiStar,
    color: "bg-accent-500",
  },
  {
    title: "Tỷ lệ xác nhận",
    value: "94.2%",
    change: "+1.3%",
    changeType: "up" as const,
    icon: FiTrendingUp,
    color: "bg-success",
  },
  {
    title: "Thành viên tích cực",
    value: "1,203",
    change: "+8%",
    changeType: "up" as const,
    icon: FiAward,
    color: "bg-accent-600",
  },
  {
    title: "Lịch hẹn tháng này",
    value: "3,512",
    change: "+18%",
    changeType: "up" as const,
    icon: FiActivity,
    color: "bg-secondary-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bảng điều khiển</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Tổng quan hoạt động hệ thống Bệnh Viện Vạn Hạnh
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="flex items-center gap-4 p-5">
              <div className={`flex-shrink-0 h-12 w-12 rounded-xl ${card.color} flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-success font-medium">{card.change} so với tháng trước</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent appointments placeholder */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">Lịch hẹn gần đây</h2>
        <div className="space-y-3">
          {[
            { patient: "Nguyễn Văn An", doctor: "BS. Trần Thị Bình", time: "08:00", status: "Đã xác nhận", statusColor: "bg-success-light text-success" },
            { patient: "Lê Thị Cúc", doctor: "BS. Phạm Văn Dũng", time: "09:30", status: "Chờ xác nhận", statusColor: "bg-warning-light text-warning" },
            { patient: "Hoàng Minh Đức", doctor: "BS. Nguyễn Thị Em", time: "10:00", status: "Đã khám", statusColor: "bg-primary-100 text-primary-600" },
            { patient: "Võ Thị Phương", doctor: "BS. Lê Văn Giang", time: "11:00", status: "Đã hủy", statusColor: "bg-error-light text-error" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="font-medium text-foreground text-sm">{item.patient}</p>
                <p className="text-xs text-muted-foreground">{item.doctor} — {item.time}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.statusColor}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
