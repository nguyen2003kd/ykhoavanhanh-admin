"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

export default function NewSpecialtyPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Thêm chuyên khoa thành công!");
      router.push("/specialties");
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
        <h1 className="text-2xl font-bold text-gray-900">Thêm chuyên khoa</h1>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader><CardTitle>Thông tin chuyên khoa</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input label="Tên chuyên khoa *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Nội khoa, Tim mạch..." />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="sticky top-6">
            <CardHeader><CardTitle>Lưu</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>{loading ? "Đang lưu..." : "Thêm chuyên khoa"}</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => router.back()}>Hủy</Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
