"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

export default function NewVoucherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: "",
    name: "",
    discountType: "percent",
    discountValue: "",
    minOrderValue: "",
    maxDiscount: "",
    usageLimit: "",
    validFrom: "",
    validTo: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    router.push("/membership/vouchers");
  }

  function generateCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "VH";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setForm({ ...form, code });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
        <h1 className="text-2xl font-bold text-gray-900">Tạo voucher mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Thông tin voucher</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã voucher *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono uppercase focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="VHXXXXXX"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  />
                  <Button type="button" variant="outline" onClick={generateCode}>
                    Tự tạo
                  </Button>
                </div>
              </div>
              <Input
                label="Tên voucher *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="VD: Giảm 20% khám chuyên khoa..."
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Loại giảm giá"
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  options={[
                    { value: "percent", label: "Phần trăm (%)" },
                    { value: "fixed", label: "Số tiền cố định (₫)" },
                  ]}
                />
                <Input
                  label={form.discountType === "percent" ? "Giảm (%)" : "Giảm (₫)"}
                  type="number"
                  required
                  min={1}
                  max={form.discountType === "percent" ? 100 : undefined}
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  placeholder={form.discountType === "percent" ? "20" : "100000"}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Giá trị đơn tối thiểu (₫)"
                  type="number"
                  min={0}
                  value={form.minOrderValue}
                  onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                  placeholder="Để trống = không giới hạn"
                />
                {form.discountType === "percent" && (
                  <Input
                    label="Giảm tối đa (₫)"
                    type="number"
                    min={0}
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                    placeholder="Để trống = không giới hạn"
                  />
                )}
              </div>
              <Input
                label="Giới hạn sử dụng"
                type="number"
                min={1}
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                placeholder="Để trống = không giới hạn"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Từ ngày *"
                  type="date"
                  required
                  value={form.validFrom}
                  onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                />
                <Input
                  label="Đến ngày *"
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
            <CardHeader><CardTitle>Tạo voucher</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-500">
                Voucher sẽ được kích hoạt ngay sau khi tạo và có thể cấp phát cho bệnh nhân.
              </p>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? "Đang tạo..." : "Tạo voucher"}
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
