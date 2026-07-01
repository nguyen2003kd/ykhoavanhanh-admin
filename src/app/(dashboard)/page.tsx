"use client";

import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/Spinner";
import { useDashboardStats, useTicketRatios } from "@/api/dashboardApi";
import {
  FiUsers,
  FiCalendar,
  FiStar,
  FiTrendingUp,
  FiActivity,
  FiAward,
  FiDollarSign,
  FiXCircle,
} from "react-icons/fi";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: ratios, isLoading: ratiosLoading } = useTicketRatios();

  // Calculate confirmation ratio from paid tickets
  const confirmationRatio = stats && stats.totalTickets > 0
    ? ((stats.paidTickets / stats.totalTickets) * 100).toFixed(1)
    : "0";

  const kpiCards = [
    {
      title: "Tong doanh thu",
      value: stats ? formatCurrency(stats.totalRevenue) : "—",
      icon: FiDollarSign,
      color: "bg-success",
    },
    {
      title: "Tong phieu kham",
      value: stats ? formatNumber(stats.totalTickets) : "—",
      icon: FiCalendar,
      color: "bg-primary-600",
    },
    {
      title: "Phieu da thanh toan",
      value: stats ? formatNumber(stats.paidTickets) : "—",
      icon: FiActivity,
      color: "bg-primary-500",
    },
    {
      title: "Phieu da huy",
      value: stats ? formatNumber(stats.cancelledTickets) : "—",
      icon: FiXCircle,
      color: "bg-error",
    },
    {
      title: "Tong bac si",
      value: stats ? formatNumber(stats.totalDoctors) : "—",
      icon: FiUsers,
      color: "bg-accent-600",
    },
    {
      title: "Tong noi dung",
      value: stats ? formatNumber(stats.totalContents) : "—",
      icon: FiAward,
      color: "bg-secondary-500",
    },
    {
      title: "Danh gia trung binh",
      value: stats ? `${stats.avgRating.toFixed(1)} ★` : "—",
      icon: FiStar,
      color: "bg-accent-500",
    },
    {
      title: "Ty le xac nhan",
      value: `${confirmationRatio}%`,
      icon: FiTrendingUp,
      color: "bg-success",
    },
  ];

  if (statsLoading || ratiosLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bang dieu khien</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Tong quan hoat dong he thong Benh Vien Van Hanh
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text="Dang tai thong ke..." />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bang dieu khien</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Tong quan hoat dong he thong Benh Vien Van Hanh
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
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
              </div>
            </Card>
          );
        })}
      </div>

      {/* Ticket Ratios */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">Ty le trang thai phieu kham</h2>
        <div className="space-y-3">
          {ratios && ratios.length > 0 ? (
            ratios.map((ratio) => (
              <div key={ratio.ticketStatus} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground text-sm">{ratio.ticketStatus}</p>
                  <p className="text-xs text-muted-foreground">{ratio.totalCount} phieu</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-600">
                  {ratio.ratioPercent}%
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">Khong co du lieu</p>
          )}
        </div>
      </Card>
    </div>
  );
}