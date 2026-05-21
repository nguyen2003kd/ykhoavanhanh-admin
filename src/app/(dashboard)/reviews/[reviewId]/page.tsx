"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockReviews } from "@/mock-data/reviews";
import { formatDateTime } from "@/lib/utils";
import { Star, ArrowLeft, Eye, EyeOff, Check, X, MessageSquare } from "lucide-react";

function StarRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`h-4 w-4 ${s <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-700">{value}/5</span>
      </div>
    </div>
  );
}

export default function ReviewDetailPage({ params }: { params: Promise<{ reviewId: string }> }) {
  const { reviewId } = use(params);
  const router = useRouter();

  const review = mockReviews.find((r) => r.id === reviewId);
  const [approved, setApproved] = useState(review?.isApproved ?? false);
  const [visible, setVisible] = useState(review?.isVisible ?? false);
  const [adminNote, setAdminNote] = useState(review?.adminNote ?? "");
  const [saved, setSaved] = useState(false);

  if (!review) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Không tìm thấy đánh giá.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  const avgRating = ((review.attitude + review.expertise + review.waitTime + review.facilities) / 4).toFixed(1);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Quay lại
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết đánh giá</h1>
          <p className="text-sm text-gray-500 mt-0.5">{review.patientName} → {review.doctorName}</p>
        </div>
        <div className="flex items-center gap-2">
          {!visible ? (
            <Badge variant="default">Ẩn</Badge>
          ) : approved ? (
            <Badge variant="success">Đã duyệt</Badge>
          ) : (
            <Badge variant="warning">Chờ duyệt</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Ratings breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                Điểm đánh giá
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="text-5xl font-bold text-gray-900">{review.rating}</div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-5 w-5 ${s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Điểm tổng thể / Trung bình chi tiết: {avgRating}</p>
                </div>
              </div>
              <div className="space-y-3">
                <StarRow label="Thái độ bác sĩ" value={review.attitude} />
                <StarRow label="Chuyên môn" value={review.expertise} />
                <StarRow label="Thời gian chờ" value={review.waitTime} />
                <StarRow label="Cơ sở vật chất" value={review.facilities} />
              </div>
            </CardContent>
          </Card>

          {/* Comment */}
          {review.comment && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary-600" />Nhận xét của bệnh nhân</CardTitle></CardHeader>
              <CardContent>
                <blockquote className="border-l-4 border-primary-200 pl-4 text-gray-700 italic">
                  &ldquo;{review.comment}&rdquo;
                </blockquote>
              </CardContent>
            </Card>
          )}

          {/* Doctor reply */}
          {review.doctorReply && (
            <Card>
              <CardHeader><CardTitle>Phản hồi từ bác sĩ</CardTitle></CardHeader>
              <CardContent>
                <blockquote className="border-l-4 border-green-200 pl-4 text-gray-700 italic">
                  &ldquo;{review.doctorReply}&rdquo;
                </blockquote>
              </CardContent>
            </Card>
          )}

          {/* Admin note */}
          <Card>
            <CardHeader><CardTitle>Ghi chú nội bộ</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <textarea
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ghi chú của quản trị viên (không hiển thị với bệnh nhân)..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
              <Button variant="outline" onClick={handleSave}>{saved ? "Đã lưu!" : "Lưu ghi chú"}</Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          <Card>
            <CardHeader><CardTitle>Kiểm duyệt</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {!approved ? (
                <Button variant="primary" className="w-full" onClick={() => { setApproved(true); setVisible(true); }}>
                  <Check className="h-4 w-4 mr-2" /> Duyệt đánh giá
                </Button>
              ) : (
                <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50" onClick={() => setApproved(false)}>
                  <X className="h-4 w-4 mr-2" /> Huỷ duyệt
                </Button>
              )}
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setVisible(!visible)}
              >
                {visible ? <><EyeOff className="h-4 w-4 mr-2" />Ẩn khỏi trang web</> : <><Eye className="h-4 w-4 mr-2" />Hiển thị trên trang web</>}
              </Button>
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader><CardTitle>Thông tin</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Bệnh nhân</p>
                <p className="font-medium">{review.patientName}</p>
              </div>
              <div>
                <p className="text-gray-500">Bác sĩ được đánh giá</p>
                <p className="font-medium">{review.doctorName}</p>
              </div>
              <div>
                <p className="text-gray-500">Mã lịch hẹn</p>
                <p className="font-mono text-primary-600">{review.appointmentId}</p>
              </div>
              <div>
                <p className="text-gray-500">Ngày gửi</p>
                <p>{formatDateTime(review.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
