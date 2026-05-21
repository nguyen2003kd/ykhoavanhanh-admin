"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

export default function NewNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    status: "draft",
    sourceUrl: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    router.push("/content/news");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
        <h1 className="text-2xl font-bold text-gray-900">Thêm tin tức mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Nội dung tin tức</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Tiêu đề *"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Tiêu đề tin tức..."
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt</label>
                <textarea
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Mô tả ngắn về tin tức..."
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                <textarea
                  rows={14}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                  placeholder="Nhập nội dung HTML hoặc Markdown..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
              </div>
              <Input
                label="Nguồn / URL tham khảo"
                value={form.sourceUrl}
                onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                placeholder="https://..."
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader><CardTitle>Xuất bản</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Trạng thái"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                options={[
                  { value: "draft", label: "Bản nháp" },
                  { value: "pending_review", label: "Gửi duyệt" },
                  { value: "published", label: "Đăng ngay" },
                ]}
              />
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu tin tức"}
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
