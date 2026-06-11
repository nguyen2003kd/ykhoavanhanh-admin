"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

export default function NewNotificationPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: "",
    type: "marketing",
    targetAudience: "all",
    channels: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Tạo thông báo thành công!");
      router.push("/notifications");
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tạo thông báo mới</h1>
          <p className="text-sm text-gray-500 mt-0.5">Soạn và gửi thông báo đến bệnh nhân</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Nội dung thông báo</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input label="Tiêu đề *" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung *</label>
                <textarea required rows={5} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Loại thông báo" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  options={[
                    { value: "appointment", label: "Lịch hẹn" },
                    { value: "marketing", label: "Marketing" },
                    { value: "content", label: "Nội dung mới" },
                    { value: "membership", label: "Membership" },
                    { value: "system", label: "Hệ thống" },
                  ]}
                />
                <Select label="Đối tượng" value={form.targetAudience} onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                  options={[
                    { value: "all", label: "Tất cả bệnh nhân" },
                    { value: "members", label: "Thành viên" },
                    { value: "specific", label: "Bệnh nhân cụ thể" },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="sticky top-6">
            <CardHeader><CardTitle>Gửi thông báo</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-500">Thông báo sẽ được gửi đến đối tượng đã chọn qua các kênh thông báo được cấu hình.</p>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>{loading ? "Đang gửi..." : "Gửi thông báo"}</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => router.back()}>Hủy</Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
