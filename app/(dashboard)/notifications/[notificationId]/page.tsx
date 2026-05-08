"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockNotifications } from "@/mock-data/notifications";
import { AdminNotification } from "@/types/notification";
import { formatDateTime } from "@/lib/utils";
import { ArrowLeft, Bell, Users, Send, CheckCircle, Clock, FileText } from "lucide-react";

const typeLabels: Record<AdminNotification["type"], string> = {
  appointment: "Lịch hẹn",
  marketing: "Marketing",
  content: "Nội dung mới",
  membership: "Membership",
  system: "Hệ thống",
};
const typeVariant: Record<AdminNotification["type"], "info" | "warning" | "success" | "accent" | "default"> = {
  appointment: "info",
  marketing: "warning",
  content: "success",
  membership: "accent",
  system: "default",
};
const channelLabels: Record<string, string> = {
  app: "App",
  zalo: "Zalo OA",
  sms: "SMS",
  email: "Email",
};
const statusVariant: Record<AdminNotification["status"], "success" | "warning" | "default" | "danger"> = {
  sent: "success",
  draft: "default",
  scheduled: "warning",
  failed: "danger",
};
const statusLabels: Record<AdminNotification["status"], string> = {
  sent: "Đã gửi",
  draft: "Bản nháp",
  scheduled: "Đã lên lịch",
  failed: "Gửi thất bại",
};
const audienceLabels: Record<AdminNotification["targetAudience"], string> = {
  all: "Tất cả bệnh nhân",
  members: "Thành viên",
  specific: "Bệnh nhân cụ thể",
};

export default function NotificationDetailPage({ params }: { params: Promise<{ notificationId: string }> }) {
  const { notificationId } = use(params);
  const router = useRouter();

  const notif = mockNotifications.find((n) => n.id === notificationId);

  if (!notif) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Không tìm thấy thông báo.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  const successRate = notif.sentCount && notif.sentCount + (notif.failedCount ?? 0) > 0
    ? Math.round((notif.sentCount / (notif.sentCount + (notif.failedCount ?? 0))) * 100)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Quay lại
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{notif.title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Chi tiết thông báo</p>
        </div>
        <Badge variant={statusVariant[notif.status]}>{statusLabels[notif.status]}</Badge>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Stats - only show for sent */}
          {notif.status === "sent" && notif.sentCount !== undefined && (
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{notif.sentCount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">Gửi thành công</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-red-500">{notif.failedCount ?? 0}</p>
                  <p className="text-sm text-gray-500 mt-1">Thất bại</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary-600">{successRate}%</p>
                  <p className="text-sm text-gray-500 mt-1">Tỉ lệ thành công</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Content */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary-600" />Nội dung thông báo</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tiêu đề</p>
                <p className="font-semibold text-gray-900 text-lg">{notif.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Nội dung</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                  {notif.body}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Targeting */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary-600" />Cài đặt gửi</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Loại thông báo</dt>
                  <dd className="mt-1"><Badge variant={typeVariant[notif.type]}>{typeLabels[notif.type]}</Badge></dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Đối tượng</dt>
                  <dd className="font-medium mt-1">{audienceLabels[notif.targetAudience]}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Kênh gửi</dt>
                  <dd className="flex flex-wrap gap-1 mt-1">
                    {notif.channels.map((ch) => (
                      <Badge key={ch} variant="default">{channelLabels[ch] ?? ch}</Badge>
                    ))}
                  </dd>
                </div>
                {notif.scheduledAt && (
                  <div>
                    <dt className="text-sm text-gray-500">Lên lịch gửi</dt>
                    <dd className="font-medium mt-1">{formatDateTime(notif.scheduledAt)}</dd>
                  </div>
                )}
              </dl>
              {notif.targetPatientIds && notif.targetPatientIds.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Bệnh nhân cụ thể ({notif.targetPatientIds.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {notif.targetPatientIds.map((id) => (
                      <Badge key={id} variant="default">{id}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Thao tác</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {notif.status === "draft" && (
                <Button variant="primary" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Gửi ngay
                </Button>
              )}
              {notif.status === "draft" && (
                <Button variant="outline" className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Lên lịch gửi
                </Button>
              )}
              {notif.status === "sent" && (
                <div className="flex items-center gap-2 text-green-600 text-sm py-2">
                  <CheckCircle className="h-4 w-4" />
                  Đã gửi lúc {notif.sentAt ? formatDateTime(notif.sentAt) : "—"}
                </div>
              )}
              <Button variant="ghost" className="w-full" onClick={() => router.back()}>
                Quay lại danh sách
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Thông tin</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-gray-500">Người tạo</p>
                <p className="font-medium">{notif.createdBy}</p>
              </div>
              <div>
                <p className="text-gray-500">Ngày tạo</p>
                <p>{formatDateTime(notif.createdAt)}</p>
              </div>
              {notif.sentAt && (
                <div>
                  <p className="text-gray-500">Ngày gửi</p>
                  <p>{formatDateTime(notif.sentAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
