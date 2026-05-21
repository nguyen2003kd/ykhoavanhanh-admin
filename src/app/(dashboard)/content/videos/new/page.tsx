"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

export default function NewVideoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    platform: "youtube",
    duration: "",
    status: "draft",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    router.push("/content/videos");
  }

  function extractVideoId(url: string): string | null {
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
    return ytMatch ? ytMatch[1] : null;
  }

  const previewId = form.platform === "youtube" ? extractVideoId(form.videoUrl) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
        <h1 className="text-2xl font-bold text-gray-900">Thêm video mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Thông tin video</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Tiêu đề *"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Tên video..."
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Nền tảng"
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  options={[
                    { value: "youtube", label: "YouTube" },
                    { value: "facebook", label: "Facebook" },
                    { value: "tiktok", label: "TikTok" },
                  ]}
                />
                <Input
                  label="Thời lượng (mm:ss)"
                  placeholder="10:35"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
              <Input
                label="URL Video *"
                required
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
              <Input
                label="URL Thumbnail"
                value={form.thumbnailUrl}
                onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                placeholder="https://..."
              />
            </CardContent>
          </Card>

          {/* Preview */}
          {previewId && (
            <Card>
              <CardHeader><CardTitle>Xem trước</CardTitle></CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-900">
                  <iframe
                    src={`https://www.youtube.com/embed/${previewId}`}
                    className="w-full h-full"
                    allowFullScreen
                    title="Preview"
                  />
                </div>
              </CardContent>
            </Card>
          )}
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
                  { value: "published", label: "Hiển thị ngay" },
                ]}
              />
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? "Đang lưu..." : "Thêm video"}
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
