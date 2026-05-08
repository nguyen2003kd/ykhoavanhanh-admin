"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { mockDoctors } from "@/mock-data/doctors";
import { mockAppointments } from "@/mock-data/appointments";
import { Star, Mail, Phone, Calendar, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

const DAY_LABELS = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
const apptStatusVariant = { pending: "warning", confirmed: "info", completed: "success", cancelled: "default", no_show: "danger" } as const;
const apptStatusLabel = { pending: "Chờ xác nhận", confirmed: "Đã xác nhận", completed: "Đã khám", cancelled: "Đã hủy", no_show: "Vắng mặt" } as const;

export default function DoctorDetailPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const router = useRouter();
  const doctor = mockDoctors.find((d) => d.id === doctorId);
  const appointments = mockAppointments.filter((a) => a.doctorId === doctorId).slice(0, 8);

  if (!doctor) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Không tìm thấy bác sĩ.</p>
      <Button variant="outline" className="mt-4" onClick={() => router.back()}>Quay lại</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết bác sĩ</h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={doctor.isActive ? "success" : "default"}>{doctor.isActive ? "Đang làm việc" : "Ngừng làm việc"}</Badge>
          <Link href={`/doctors/${doctorId}/edit`}>
            <Button variant="outline" size="sm">Chỉnh sửa</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Thông tin chính */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <Avatar src={doctor.avatar} name={doctor.fullName} size="lg" className="flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{doctor.fullName}</h2>
                  <p className="text-gray-500 text-sm mt-1">{doctor.title}</p>
                  <Badge variant="info" className="mt-2">{doctor.specialtyName}</Badge>
                  <div className="flex items-center gap-1 mt-3">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`h-4 w-4 ${i <= Math.round(doctor.averageRating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
                    ))}
                    <span className="text-sm font-semibold ml-1">{doctor.averageRating}</span>
                    <span className="text-sm text-gray-500">({doctor.totalReviews} đánh giá)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-gray-600"><Mail className="h-4 w-4 text-gray-400" />{doctor.email}</div>
                <div className="flex items-center gap-2 text-gray-600"><Phone className="h-4 w-4 text-gray-400" />{doctor.phone}</div>
                <div className="flex items-center gap-2 text-gray-600"><Calendar className="h-4 w-4 text-gray-400" />{doctor.experience} năm kinh nghiệm</div>
                <div className="flex items-center gap-2 text-gray-600"><Users className="h-4 w-4 text-gray-400" />{doctor.totalReviews} bệnh nhân đánh giá</div>
              </div>

              {doctor.bio && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Giới thiệu</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{doctor.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lịch làm việc */}
          {doctor.schedule && doctor.schedule.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Lịch làm việc</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {doctor.schedule.map((s) => (
                    <div key={s.dayOfWeek} className="flex items-center gap-4 text-sm">
                      <span className="w-20 font-medium text-gray-700">{DAY_LABELS[s.dayOfWeek]}</span>
                      <div className="flex gap-2 flex-wrap">
                        {s.slots.map((slot, i) => (
                          <span key={i} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
                            {slot.startTime} – {slot.endTime} ({slot.maxPatients} BN)
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lịch hẹn gần đây */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lịch hẹn gần đây</CardTitle>
                <Link href={`/appointments/new?doctorId=${doctor.id}`}>
                  <Button variant="outline" size="sm">+ Đặt lịch</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {appointments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">Chưa có lịch hẹn nào.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Bệnh nhân</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày khám</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                    <th className="px-4 py-3"></th>
                  </tr></thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{a.patientName}</td>
                        <td className="px-4 py-3 text-gray-600">{formatDate(a.appointmentDate)} {a.appointmentTime}</td>
                        <td className="px-4 py-3"><Badge variant={apptStatusVariant[a.status]}>{apptStatusLabel[a.status]}</Badge></td>
                        <td className="px-4 py-3"><Link href={`/appointments/${a.id}`}><Button variant="ghost" size="sm">Xem</Button></Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Thống kê</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="flex justify-between"><span className="text-gray-500">Tổng lịch hẹn</span><span className="font-semibold">{mockAppointments.filter(a => a.doctorId === doctorId).length}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Đã khám</span><span className="font-semibold text-green-600">{mockAppointments.filter(a => a.doctorId === doctorId && a.status === "completed").length}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Đánh giá TB</span><span className="font-semibold">{doctor.averageRating}/5 ⭐</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Kinh nghiệm</span><span className="font-semibold">{doctor.experience} năm</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
