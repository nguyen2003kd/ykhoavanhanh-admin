"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

export default function NewGiftPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "voucher",
    pointsRequired: "",
    stock: "",
    validFrom: "",
    validTo: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    router.push("/membership/gifts");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
        <h1 className="text-2xl font-bold text-gray-900">Thêm quà tặng mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Thông tin quà tặng</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Tên quà tặng *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="VD: Voucher khám miễn phí, Gói xét nghiệm..."
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Mô tả chi tiết quà tặng..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Loại quà"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  options={[
                    { value: "voucher", label: "Voucher" },
                    { value: "package", label: "Gói dịch vụ" },
                    { value: "product", label: "Sản phẩm" },
                    { value: "service", label: "Dịch vụ" },
                  ]}
                />
                <Input
                  label="Điểm cần đổi *"
                  type="number"
                  required
                  min={1}
                  value={form.pointsRequired}
                  onChange={(e) => setForm({ ...form, pointsRequired: e.target.value })}
                  placeholder="500"
                />
              </div>
              <Input
                label="Số lượng tồn kho *"
                type="number"
                required
                min={0}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="100"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Ngày bắt đầu *"
                  type="date"
                  required
                  value={form.validFrom}
                  onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                />
                <Input
                  label="Ngày kết thúc *"
                  type="date"
                  required
                  value={form.validTo}
                  onChange={(e) => setForm({ ...form, validTo: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader><CardTitle>Tạo quà tặng</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-500">
                Quà tặng sẽ hiển thị trong danh mục đổi điểm của thành viên sau khi tạo.
              </p>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? "Đang tạo..." : "Tạo quà tặng"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => router.back()}>
                Hủy
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
