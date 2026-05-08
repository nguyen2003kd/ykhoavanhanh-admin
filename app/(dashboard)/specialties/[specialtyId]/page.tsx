"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { mockSpecialties } from "@/mock-data/specialties";
import { mockDoctors } from "@/mock-data/doctors";
import { Star, CheckCircle } from "lucide-react";

export default function SpecialtyDetailPage() {
  const { specialtyId } = useParams<{ specialtyId: string }>();
  const router = useRouter();
  const specialty = mockSpecialties.find((s) => s.id === specialtyId);
  const doctors = mockDoctors.filter((d) => d.specialtyId === specialtyId && d.isActive);

  if (!specialty) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Không tìm thấy chuyên khoa.</p>
      <Button variant="outline" className="mt-4" onClick={() => router.back()}>Quay lại</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{specialty.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Chi tiết chuyên khoa</p>
        </div>
        <Badge variant={specialty.isActive ? "success" : "default"} className="ml-2">
          {specialty.isActive ? "Hoạt động" : "Tạm ngưng"}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Giới thiệu</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 leading-relaxed">{specialty.longDescription || specialty.description}</p>
              {specialty.services && specialty.services.length > 0 && (
                <div>
                  <p className="font-semibold text-gray-700 mb-3">Dịch vụ cung cấp</p>
                  <div className="grid grid-cols-2 gap-2">
                    {specialty.services.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Danh sách bác sĩ */}
          <Card>
            <CardHeader><CardTitle>Đội ngũ bác sĩ ({doctors.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              {doctors.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">Chưa có bác sĩ nào trong chuyên khoa này.</p>
              ) : (
                <div className="divide-y">
                  {doctors.map((d) => (
                    <div key={d.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                      <Avatar src={d.avatar} name={d.fullName} size="md" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{d.fullName}</p>
                        <p className="text-sm text-gray-500">{d.title} • {d.experience} năm KN</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-medium text-gray-600">{d.averageRating}</span>
                          <span className="text-xs text-gray-400">({d.totalReviews} đánh giá)</span>
                        </div>
                      </div>
                      <Link href={`/doctors/${d.id}`}>
                        <Button variant="outline" size="sm">Xem</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Thống kê</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="flex justify-between"><span className="text-gray-500">Số bác sĩ</span><span className="font-semibold">{specialty.doctorCount}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Đang hoạt động</span><span className="font-semibold text-green-600">{doctors.length}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Dịch vụ</span><span className="font-semibold">{specialty.services?.length || 0}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Trạng thái</span>
                <Badge variant={specialty.isActive ? "success" : "default"} className="text-xs">{specialty.isActive ? "Hoạt động" : "Tạm ngưng"}</Badge>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-2">
            <Link href={`/appointments/new?specialtyId=${specialty.id}`}>
              <Button variant="primary" className="w-full">Đặt lịch hẹn</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
