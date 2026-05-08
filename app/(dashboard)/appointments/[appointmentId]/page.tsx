"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockAppointments } from "@/mock-data/appointments";
import { formatDate } from "@/lib/utils";

const statusVariant = { pending: "warning", confirmed: "info", completed: "success", cancelled: "default", no_show: "danger" } as const;
const statusLabel = { pending: "Chờ xác nhận", confirmed: "Đã xác nhận", completed: "Đã khám", cancelled: "Đã hủy", no_show: "Vắng mặt" } as const;

export default function AppointmentDetailPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const router = useRouter();
  const appt = mockAppointments.find((a) => a.id === appointmentId);

  if (!appt) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Không tìm thấy lịch hẹn.</p>
      <Button variant="outline" className="mt-4" onClick={() => router.back()}>Quay lại</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết lịch hẹn</h1>
            <p className="text-sm text-gray-500 font-mono">{appt.code}</p>
          </div>
        </div>
        <Badge variant={statusVariant[appt.status]}>{statusLabel[appt.status]}</Badge>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Thông tin lịch hẹn</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Ngày khám:</span> <span className="font-semibold ml-2">{formatDate(appt.appointmentDate)}</span></div>
              <div><span className="text-gray-500">Giờ khám:</span> <span className="font-semibold ml-2">{appt.appointmentTime}</span></div>
              <div><span className="text-gray-500">Chuyên khoa:</span> <span className="font-medium ml-2">{appt.specialtyName}</span></div>
              <div><span className="text-gray-500">Khám cho:</span> <span className="font-medium ml-2">{appt.isForSelf ? "Bản thân" : "Người thân"}</span></div>
              <div><span className="text-gray-500">Gửi nhắc nhở:</span> <span className="font-medium ml-2">{appt.reminderSent ? "Đã gửi" : "Chưa gửi"}</span></div>
              <div><span className="text-gray-500">Ngày tạo:</span> <span className="font-medium ml-2">{formatDate(appt.createdAt)}</span></div>
              {appt.note && (
                <div className="col-span-2">
                  <p className="text-gray-500 mb-1">Ghi chú:</p>
                  <p className="bg-gray-50 rounded-lg p-3 text-gray-700 leading-relaxed">{appt.note}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Thao tác</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {appt.status === "pending" && (
                <>
                  <Button variant="primary">Xác nhận lịch hẹn</Button>
                  <Button variant="danger">Hủy lịch hẹn</Button>
                </>
              )}
              {appt.status === "confirmed" && (
                <>
                  <Button variant="primary">Đánh dấu đã khám</Button>
                  <Button variant="outline">Đánh dấu vắng mặt</Button>
                  <Button variant="danger">Hủy lịch hẹn</Button>
                </>
              )}
              {(appt.status === "completed" || appt.status === "cancelled" || appt.status === "no_show") && (
                <p className="text-sm text-gray-500 italic">Lịch hẹn đã kết thúc, không thể thao tác.</p>
              )}
              {!appt.reminderSent && appt.status !== "cancelled" && (
                <Button variant="outline">Gửi nhắc nhở SMS</Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Bệnh nhân</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <Link href={`/patients/${appt.patientId}`} className="font-semibold text-primary-600 hover:underline block text-base">{appt.patientName}</Link>
              <div className="text-gray-600">{appt.patientPhone}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Bác sĩ phụ trách</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <Link href={`/doctors/${appt.doctorId}`} className="font-semibold text-primary-600 hover:underline block text-base">{appt.doctorName}</Link>
              <div className="text-gray-600">{appt.specialtyName}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
