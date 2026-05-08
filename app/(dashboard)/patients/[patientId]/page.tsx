"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { mockPatients } from "@/mock-data/patients";
import { mockAppointments } from "@/mock-data/appointments";
import { mockMedicalRecords } from "@/mock-data/medical-records";
import { formatDate } from "@/lib/utils";

const statusVariant = { active: "success", inactive: "default", pending: "warning" } as const;
const statusLabel = { active: "Hoạt động", inactive: "Không hoạt động", pending: "Chờ duyệt" } as const;
const tierVariant = { silver: "info", gold: "accent", diamond: "warning" } as const;
const tierLabel = { silver: "Bạc", gold: "Vàng", diamond: "Kim cương" } as const;
const apptStatusVariant = { pending: "warning", confirmed: "info", completed: "success", cancelled: "default", no_show: "danger" } as const;
const apptStatusLabel = { pending: "Chờ xác nhận", confirmed: "Đã xác nhận", completed: "Đã khám", cancelled: "Đã hủy", no_show: "Vắng mặt" } as const;

export default function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const router = useRouter();
  const patient = mockPatients.find((p) => p.id === patientId);
  const appointments = mockAppointments.filter((a) => a.patientId === patientId);
  const records = mockMedicalRecords.filter((r) => r.patientId === patientId);

  if (!patient) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Không tìm thấy bệnh nhân.</p>
      <Button variant="outline" className="mt-4" onClick={() => router.back()}>Quay lại</Button>
    </div>
  );

  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient.fullName}</h1>
            <p className="text-sm text-gray-500">{patient.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusVariant[patient.status]}>{statusLabel[patient.status]}</Badge>
          <Link href={`/patients/${patientId}/edit`}>
            <Button variant="outline" size="sm">Chỉnh sửa</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Thông tin cơ bản */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Thông tin cá nhân</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Họ tên:</span> <span className="font-medium ml-2">{patient.fullName}</span></div>
              <div><span className="text-gray-500">Ngày sinh:</span> <span className="font-medium ml-2">{formatDate(patient.dateOfBirth)} ({age} tuổi)</span></div>
              <div><span className="text-gray-500">Giới tính:</span> <span className="font-medium ml-2">{patient.gender === "male" ? "Nam" : patient.gender === "female" ? "Nữ" : "Khác"}</span></div>
              <div><span className="text-gray-500">Nhóm máu:</span> <span className="font-medium ml-2">{patient.bloodType || "—"}</span></div>
              <div><span className="text-gray-500">Điện thoại:</span> <span className="font-medium ml-2">{patient.phone}</span></div>
              <div><span className="text-gray-500">Email:</span> <span className="font-medium ml-2">{patient.email || "—"}</span></div>
              <div className="col-span-2"><span className="text-gray-500">Địa chỉ:</span> <span className="font-medium ml-2">{patient.address}</span></div>
              {patient.allergies && patient.allergies.length > 0 && (
                <div className="col-span-2">
                  <span className="text-gray-500">Dị ứng:</span>
                  <div className="inline-flex gap-2 ml-2 flex-wrap">
                    {patient.allergies.map((a) => <Badge key={a} variant="danger">{a}</Badge>)}
                  </div>
                </div>
              )}
              {patient.medicalHistory && (
                <div className="col-span-2">
                  <p className="text-gray-500 mb-1">Tiền sử bệnh:</p>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm leading-relaxed">{patient.medicalHistory}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lịch sử lịch hẹn */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lịch hẹn</CardTitle>
                <Link href={`/appointments/new?patientId=${patient.id}`}>
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
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày khám</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Bác sĩ</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Chuyên khoa</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                    <th className="px-4 py-3"></th>
                  </tr></thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{formatDate(a.appointmentDate)} {a.appointmentTime}</td>
                        <td className="px-4 py-3 font-medium">{a.doctorName}</td>
                        <td className="px-4 py-3 text-gray-600">{a.specialtyName}</td>
                        <td className="px-4 py-3"><Badge variant={apptStatusVariant[a.status]}>{apptStatusLabel[a.status]}</Badge></td>
                        <td className="px-4 py-3"><Link href={`/appointments/${a.id}`}><Button variant="ghost" size="sm">Xem</Button></Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>

          {/* Hồ sơ bệnh án */}
          <Card>
            <CardHeader><CardTitle>Hồ sơ bệnh án ({records.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              {records.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">Chưa có hồ sơ bệnh án.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày khám</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Chẩn đoán</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Bác sĩ</th>
                    <th className="px-4 py-3"></th>
                  </tr></thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{formatDate(r.visitDate)}</td>
                        <td className="px-4 py-3 font-medium text-primary-700">{r.diagnosis}</td>
                        <td className="px-4 py-3 text-gray-600">{r.doctorName}</td>
                        <td className="px-4 py-3"><Link href={`/medical-records/${r.id}`}><Button variant="ghost" size="sm">Xem</Button></Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <Avatar name={patient.fullName} size="lg" className="mx-auto mb-3" />
              <p className="font-semibold text-gray-900">{patient.fullName}</p>
              <p className="text-sm text-gray-500 font-mono">{patient.code}</p>
              {patient.membershipTier && (
                <Badge variant={tierVariant[patient.membershipTier]} className="mt-2">
                  {tierLabel[patient.membershipTier]}
                </Badge>
              )}
            </CardContent>
          </Card>

          {patient.emergencyContact && (
            <Card>
              <CardHeader><CardTitle className="text-base">Liên hệ khẩn cấp</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <div><span className="text-gray-500">Tên:</span> <span className="font-medium ml-1">{patient.emergencyContact.name}</span></div>
                <div><span className="text-gray-500">SĐT:</span> <span className="font-medium ml-1">{patient.emergencyContact.phone}</span></div>
                <div><span className="text-gray-500">Quan hệ:</span> <span className="font-medium ml-1">{patient.emergencyContact.relationship}</span></div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="text-base">Thống kê</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="flex justify-between"><span className="text-gray-500">Tổng lịch hẹn</span><span className="font-semibold">{appointments.length}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Đã khám</span><span className="font-semibold text-green-600">{appointments.filter(a => a.status === "completed").length}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Hồ sơ bệnh án</span><span className="font-semibold">{records.length}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Ngày tạo</span><span className="font-medium">{formatDate(patient.createdAt)}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
