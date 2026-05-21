"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

export default function NewPromotionPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "discount",
    discountPercent: "",
    targetAudience: "all",
    validFrom: "",
    validTo: "",
    usageLimit: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Tạo khuyến mãi thành công!");
      router.push("/promotions");
    } catch {
      toast.error("Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tạo khuyến mãi</h1>
          <p className="text-sm text-gray-500 mt-0.5">Thêm chương trình khuyến mãi mới</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Thông tin khuyến mãi</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input label="Tên chương trình *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Loại ưu đãi" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  options={[
                    { value: "discount", label: "Giảm giá %" },
                    { value: "package", label: "Gói dịch vụ" },
                    { value: "gift", label: "Tặng quà" },
                    { value: "points_bonus", label: "Thêm điểm" },
                  ]}
                />
                <Select label="Đối tượng" value={form.targetAudience} onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                  options={[
                    { value: "all", label: "Tất cả" },
                    { value: "new_patients", label: "Bệnh nhân mới" },
                    { value: "members", label: "Thành viên" },
                    { value: "specific_tier", label: "Hạng thành viên" },
                  ]}
                />
              </div>
              {form.type === "discount" && (
                <Input label="Phần trăm giảm (%)" type="number" min={1} max={100} value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} />
              )}
              <div className="grid grid-cols-2 gap-4">
                <Input label="Từ ngày *" type="date" required value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} />
                <Input label="Đến ngày *" type="date" required value={form.validTo} onChange={(e) => setForm({ ...form, validTo: e.target.value })} />
              </div>
              <Input label="Giới hạn sử dụng" type="number" placeholder="Để trống = không giới hạn" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="sticky top-6">
            <CardHeader><CardTitle>Tạo khuyến mãi</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-500">Chương trình sẽ được kích hoạt ngay sau khi tạo.</p>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>{loading ? "Đang tạo..." : "Tạo khuyến mãi"}</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => router.back()}>Hủy</Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
