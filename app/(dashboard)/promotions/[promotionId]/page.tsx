"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockPromotions } from "@/mock-data/promotions";
import { Promotion } from "@/types/promotion";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Tag, Users, Calendar, BarChart2, Power, Trash2 } from "lucide-react";

const typeLabels: Record<Promotion["type"], string> = {
  discount: "Giảm giá %",
  package: "Gói dịch vụ",
  gift: "Tặng quà",
  points_bonus: "Thưởng điểm",
};
const audienceLabels: Record<Promotion["targetAudience"], string> = {
  all: "Tất cả bệnh nhân",
  new_patients: "Bệnh nhân mới",
  members: "Thành viên",
  specific_tier: "Hạng thành viên cụ thể",
};
const tierLabels: Record<string, string> = {
  silver: "Bạc",
  gold: "Vàng",
  diamond: "Kim cương",
};

export default function PromotionDetailPage({ params }: { params: Promise<{ promotionId: string }> }) {
  const { promotionId } = use(params);
  const router = useRouter();

  const promo = mockPromotions.find((p) => p.id === promotionId);
  const [isActive, setIsActive] = useState(promo?.isActive ?? false);

  if (!promo) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Không tìm thấy khuyến mãi.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  const usagePercent = promo.usageLimit ? Math.round((promo.usedCount / promo.usageLimit) * 100) : null;
  const now = new Date();
  const validFrom = new Date(promo.validFrom);
  const validTo = new Date(promo.validTo);
  const timeStatus = now < validFrom ? "upcoming" : now > validTo ? "expired" : "active";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Quay lại
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{promo.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{typeLabels[promo.type]}</p>
        </div>
        <Badge variant={isActive ? "success" : "default"}>{isActive ? "Đang hoạt động" : "Đã tắt"}</Badge>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary-600">{promo.usedCount}</p>
                <p className="text-sm text-gray-500 mt-1">Lượt dùng</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-gray-700">{promo.usageLimit ?? "∞"}</p>
                <p className="text-sm text-gray-500 mt-1">Giới hạn</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-green-600">
                  {timeStatus === "active" ? "Đang chạy" : timeStatus === "upcoming" ? "Sắp diễn ra" : "Đã hết hạn"}
                </p>
                <p className="text-sm text-gray-500 mt-1">Trạng thái thời gian</p>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Tag className="h-5 w-5 text-primary-600" />Chi tiết ưu đãi</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Loại ưu đãi</p>
                  <p className="font-semibold mt-1">{typeLabels[promo.type]}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giá trị</p>
                  <p className="font-semibold text-green-600 mt-1">
                    {promo.discountPercent
                      ? `Giảm ${promo.discountPercent}%`
                      : promo.discountAmount
                      ? `Giảm ${formatCurrency(promo.discountAmount)}`
                      : promo.bonusPoints
                      ? `+${promo.bonusPoints} điểm`
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Đối tượng</p>
                  <p className="font-medium mt-1">{audienceLabels[promo.targetAudience]}</p>
                </div>
                {promo.targetTier && (
                  <div>
                    <p className="text-sm text-gray-500">Hạng thành viên</p>
                    <p className="font-medium mt-1">{tierLabels[promo.targetTier]}</p>
                  </div>
                )}
              </div>
              {promo.description && (
                <div>
                  <p className="text-sm text-gray-500">Mô tả</p>
                  <p className="text-gray-700 mt-1">{promo.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline & Usage */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary-600" />Thời gian & Sử dụng</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Bắt đầu</p>
                  <p className="font-medium mt-1">{formatDate(promo.validFrom)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kết thúc</p>
                  <p className="font-medium mt-1">{formatDate(promo.validTo)}</p>
                </div>
              </div>
              {usagePercent !== null && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Đã sử dụng</span>
                    <span className="font-medium">{promo.usedCount}/{promo.usageLimit} ({usagePercent}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${usagePercent >= 90 ? "bg-red-500" : usagePercent >= 60 ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    />
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
              <Button
                variant={isActive ? "outline" : "primary"}
                className="w-full"
                onClick={() => setIsActive(!isActive)}
              >
                <Power className="h-4 w-4 mr-2" />
                {isActive ? "Tắt khuyến mãi" : "Bật khuyến mãi"}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => router.push(`/promotions/${promo.id}/edit`)}>
                Chỉnh sửa
              </Button>
              <Button variant="ghost" className="w-full text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4 mr-2" />
                Xoá chương trình
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Thông tin hệ thống</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-gray-500">Mã</p>
                <p className="font-mono text-xs">{promo.id}</p>
              </div>
              <div>
                <p className="text-gray-500">Người tạo</p>
                <p>{promo.createdBy}</p>
              </div>
              <div>
                <p className="text-gray-500">Ngày tạo</p>
                <p>{formatDate(promo.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
