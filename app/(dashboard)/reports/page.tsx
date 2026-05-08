"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockKpis, mockAppointmentStats, mockRevenueData } from "@/mock-data/dashboard";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

export default function ReportsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
        <p className="text-sm text-gray-500 mt-1">Tổng quan hiệu suất hoạt động bệnh viện</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockKpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
              {kpi.change && (
                <p className={`text-xs mt-1 ${kpi.changeType === "up" ? "text-green-600" : kpi.changeType === "down" ? "text-red-500" : "text-gray-400"}`}>
                  {kpi.change}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Lịch hẹn theo ngày (7 ngày qua)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockAppointmentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="confirmed" name="Đã xác nhận" fill="#0B5CAD" />
                <Bar dataKey="completed" name="Hoàn thành" fill="#00A6A6" />
                <Bar dataKey="cancelled" name="Hủy" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Doanh thu theo tháng</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}tr`} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Line type="monotone" dataKey="amount" name="Doanh thu" stroke="#0B5CAD" strokeWidth={2} dot={{ fill: "#0B5CAD" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
