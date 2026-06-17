"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
// import { Select } from "@/components/ui/Select";
import { postsHooks } from "@/api/postsApi";
import { filesService } from "@/api/filesApi";
import { UploadImage } from "@/components/hospital-admin/UploadImage";
import { toast } from "@/components/ui/Toast";

export default function NewNewsPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    content: "",
    img_path: [] as string[],
  });
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const createMutation = postsHooks.useCreate({
    onSuccess: () => {
      toast.success("Tạo tin tức thành công");
      router.push("/content/news");
    },
    onError: (err) => toast.error(err.message || "Tạo tin tức thất bại"),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let uploadedUrls = form.img_path;

    if (pendingFiles.length > 0) {
      setIsUploading(true);
      try {
        const results = await Promise.all(
          pendingFiles.map((file) => filesService.upload(file))
        );
        uploadedUrls = [...uploadedUrls, ...results.map((r) => r.original)];
        setPendingFiles([]);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload ảnh thất bại");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    createMutation.mutate({ ...form, img_path: uploadedUrls });
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
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Tiêu đề tin tức..."
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt</label>
                <textarea
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Mô tả ngắn về tin tức..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đính kèm</label>
                <UploadImage
                  existingUrls={form.img_path}
                  pendingFiles={pendingFiles}
                  onExistingChange={(urls) => setForm({ ...form, img_path: urls })}
                  onPendingChange={(files) => setPendingFiles(files)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader><CardTitle>Xuất bản</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Button type="submit" variant="primary" className="w-full" disabled={createMutation.isPending || isUploading}>
                {isUploading ? "Đang upload ảnh..." : createMutation.isPending ? "Đang lưu..." : "Lưu tin tức"}
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
