"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

export default function SettingsPage() {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    hospitalName: "Bệnh Viện Vạn Hạnh",
    supportEmail: "support@vanhanh.vn",
    supportPhone: "028 3832 1234",
    defaultTimezone: "Asia/Ho_Chi_Minh",
    allowOnlineBooking: true,
    requirePaymentUpfront: false,
    enableZaloNotification: true,
    enableSmsNotification: true,
    appointmentReminderHours: "24",
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success("Đã lưu cài đặt thành công!");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
        <p className="text-sm text-gray-500 mt-1">Cấu hình thông tin và hoạt động của bệnh viện</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Thông tin bệnh viện</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input label="Tên bệnh viện" value={settings.hospitalName} onChange={(e) => setSettings({ ...settings, hospitalName: e.target.value })} />
          <Input label="Email hỗ trợ" type="email" value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} />
          <Input label="Điện thoại hỗ trợ" value={settings.supportPhone} onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Đặt lịch hẹn</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Cho phép đặt lịch trực tuyến</p>
              <p className="text-xs text-gray-500">Bệnh nhân có thể tự đặt qua app</p>
            </div>
            <Toggle checked={settings.allowOnlineBooking} onChange={(v) => setSettings({ ...settings, allowOnlineBooking: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Yêu cầu thanh toán trước</p>
              <p className="text-xs text-gray-500">Bệnh nhân phải thanh toán khi đặt lịch</p>
            </div>
            <Toggle checked={settings.requirePaymentUpfront} onChange={(v) => setSettings({ ...settings, requirePaymentUpfront: v })} />
          </div>
          <Input label="Nhắc nhở trước (giờ)" type="number" value={settings.appointmentReminderHours} onChange={(e) => setSettings({ ...settings, appointmentReminderHours: e.target.value })} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Thông báo</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Thông báo qua Zalo OA</p>
            <Toggle checked={settings.enableZaloNotification} onChange={(v) => setSettings({ ...settings, enableZaloNotification: v })} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Thông báo qua SMS</p>
            <Toggle checked={settings.enableSmsNotification} onChange={(v) => setSettings({ ...settings, enableSmsNotification: v })} />
          </div>
        </CardContent>
      </Card>

      <Button variant="primary" onClick={handleSave} disabled={saving}>
        {saving ? "Đang lưu..." : "Lưu cài đặt"}
      </Button>
    </div>
  );
}
