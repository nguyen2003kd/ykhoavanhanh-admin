"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { postsHooks, postsMediaService, postsService } from "@/api/postsApi";
import { postCategoriesHooks } from "@/api/postCategoriesApi";
import { TextEditor } from "@/components/shares/rich-text-editor";
import { Select } from "@/components/ui/Select";
import type { ApiFile } from "@/components/shares/rich-text-editor/types/types";
import { toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ChevronLeft,
  FileText,
  Image as ImageIcon,
  AlignLeft,
  Globe,
  Star,
  Save,
  X,
  CircleCheck,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { ThumbnailUpload } from "@/components/hospital-admin/ThumbnailUpload";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  DRAFT: { label: "Nháp", icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-200" },
  PUBLISHED: { label: "Đã xuất bản", icon: Globe, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  HIDDEN: { label: "Ẩn", icon: AlertCircle, color: "text-slate-500 bg-slate-50 border-slate-200" },
  ARCHIVED: { label: "Lưu trữ", icon: FileText, color: "text-slate-400 bg-slate-50 border-slate-200" },
} as const;

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: post, isLoading } = postsHooks.useDetail(id);

  const [form, setForm] = useState({
    name: "",
    description: "",
    content: "",
    thumbnail_path: "",
    category_id: "",
    slug: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "HIDDEN" | "ARCHIVED",
    is_featured: false,
  });
  const [pendingThumbnail, setPendingThumbnail] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditorUploading, setIsEditorUploading] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);
  const { data: categoriesData } = postCategoriesHooks.useList({ currentPage: 1, pageSize: 100 } as Record<string, unknown>);
  const categoryOptions = (categoriesData?.rows ?? [])
    .filter((c) => c.is_active)
    .map((c) => ({ value: c.id, label: c.name }));

  async function handleEditorUpload(file: File): Promise<(ApiFile & { url: string }) | null> {
    setIsEditorUploading(true);
    try {
      return await postsService.uploadEditorFileForPost(id, file);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload ảnh thất bại");
      return null;
    } finally {
      setIsEditorUploading(false);
    }
  }

  useEffect(() => {
    if (post) {
      setForm({
        name: post.name ?? "",
        description: post.description ?? "",
        content: post.content ?? "",
        thumbnail_path: post.thumbnail_path ?? "",
        category_id: post.category_id ?? "",
        slug: post.slug ?? "",
        status: (post.status as "DRAFT" | "PUBLISHED" | "HIDDEN" | "ARCHIVED") ?? "DRAFT",
        is_featured: post.is_featured ?? false,
      });
      setFormInitialized(true);
    }
  }, [post]);

  const patchMutation = postsHooks.usePatch({
    onSuccess: () => {
      toast.success("Cập nhật tin tức thành công");
      router.push("/content/news");
    },
    onError: (err) => toast.error(err.message || "Cập nhật tin tức thất bại"),
  });

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tiêu đề tin tức");
      return;
    }

    let thumbnailPath = form.thumbnail_path;
    if (pendingThumbnail) {
      setIsUploading(true);
      try {
        const media = await postsMediaService.upload(id, pendingThumbnail, { media_type: "THUMBNAIL" });
        thumbnailPath = media.url ?? media.file_path;
        setPendingThumbnail(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload ảnh thất bại");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    patchMutation.mutate({
      id,
      data: {
        name: form.name,
        description: form.description,
        content: form.content,
        category_id: form.category_id || undefined,
        slug: form.slug.trim() || undefined,
        thumbnail_path: thumbnailPath || undefined,
        status: form.status,
        is_featured: form.is_featured,
      },
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-slate-700">Đang tải dữ liệu</p>
            <p className="text-xs text-slate-400">Vui lòng chờ trong giây lát...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-slate-400" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-700">Không tìm thấy tin tức</p>
            <p className="text-xs text-slate-400">Bài viết có thể đã bị xóa hoặc không tồn tại.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/content/news")}>
            <ChevronLeft className="w-4 h-4" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const currentStatus = STATUS_CONFIG[form.status] ?? STATUS_CONFIG.DRAFT;
  const StatusIcon = currentStatus.icon;
  const isSaving = patchMutation.isPending || isUploading || isEditorUploading;

  return (
    <div className="min-h-[100dvh] bg-slate-50/50">
      {/* ── Top Navigation Bar ─────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200/80 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-slate-500 hover:text-slate-800 -ml-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Quay lại
            </Button>
            <div className="w-px h-5 bg-slate-200" />
            <span className="text-sm font-medium text-slate-800">Chỉnh sửa tin tức</span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                currentStatus.color
              )}
            >
              <StatusIcon className="w-3 h-3" />
              {currentStatus.label}
            </div>
            <Button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isSaving}
              size="sm"
              className="gap-2 shadow-sm active:scale-[0.98] transition-transform"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left Column ────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Metadata Card */}
            <section className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">Thông tin cơ bản</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Tiêu đề và mô tả ngắn cho bài viết</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                <div className="px-6 py-5 space-y-1">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    Tiêu đề bài viết
                    <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nhập tiêu đề bài viết..."
                    className="text-slate-800 placeholder:text-slate-300"
                  />
                </div>

                <div className="px-6 py-5 space-y-1">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
                    Mô tả ngắn
                  </label>
                  <textarea
                    rows={3}
                    className={cn(
                      "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800",
                      "placeholder:text-slate-300 bg-white",
                      "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400",
                      "resize-none transition-shadow"
                    )}
                    placeholder="Mô tả ngắn về nội dung bài viết (sẽ hiển thị trong danh sách)..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Danh mục</label>
                    <Select
                      placeholder="Chọn danh mục..."
                      value={form.category_id}
                      onValueChange={(v) => setForm({ ...form, category_id: v })}
                      options={categoryOptions}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Slug</label>
                    <Input
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="tu-dong-tao-tu-tieu-de"
                      className="font-mono text-slate-600"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Content Editor Card */}
            <section className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <AlignLeft className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-800">Nội dung bài viết</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Soạn thảo nội dung chi tiết với trình soạn thảo</p>
                  </div>
                </div>
                {isEditorUploading && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Đang upload ảnh...</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <TextEditor
                  key={formInitialized ? "ready" : "loading"}
                  content={form.content}
                  onChangeContent={(value) => setForm({ ...form, content: value })}
                  contentClassName="min-h-[500px] rounded-xl border border-slate-200 text-sm"
                  uploadFile={{
                    onUpload: handleEditorUpload,
                    isLoading: isEditorUploading,
                    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
                  }}
                />
              </div>
            </section>
          </div>

          {/* ── Right Column (Sticky Sidebar) ─────── */}
          <div className="space-y-6 lg:sticky lg:top-[4.5rem] lg:self-start">

            {/* Thumbnail Card */}
            <section className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">Ảnh đại diện</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Hiển thị trong danh sách tin tức</p>
                </div>
              </div>
              <div className="p-6">
                <ThumbnailUpload
                  value={form.thumbnail_path}
                  onChange={(url) => setForm((f) => ({ ...f, thumbnail_path: url }))}
                  pendingFile={pendingThumbnail}
                  onPendingChange={(file) => setPendingThumbnail(file)}
                />
              </div>
            </section>

            {/* Publish Card */}
            <section className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">Xuất bản</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Cài đặt hiển thị bài viết</p>
                </div>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* Featured toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/40">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                      form.is_featured ? "bg-amber-50 text-amber-500" : "bg-slate-100 text-slate-400"
                    )}>
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Nổi bật</p>
                      <p className="text-xs text-slate-400">Ưu tiên trang chủ</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.is_featured}
                    onClick={() => setForm((f) => ({ ...f, is_featured: !f.is_featured }))}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:ring-offset-2",
                      form.is_featured ? "bg-primary" : "bg-slate-200"
                    )}
                  >
                    <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform", form.is_featured ? "translate-x-6" : "translate-x-1")} />
                  </button>
                </div>

                {/* Status selector */}
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Trạng thái</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(STATUS_CONFIG) as Array<"DRAFT" | "PUBLISHED" | "HIDDEN" | "ARCHIVED">).map((s) => {
                      const cfg = STATUS_CONFIG[s];
                      const Icon = cfg.icon;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, status: s }))}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all cursor-pointer",
                            "hover:border-slate-300 hover:bg-slate-50/60 active:scale-[0.98]",
                            form.status === s
                              ? "border-primary-400 bg-primary-50/50 ring-1 ring-primary-400/30"
                              : "border-slate-200 bg-white"
                          )}
                        >
                          <Icon className={cn("w-4 h-4", form.status === s ? "text-primary" : "text-slate-400")} />
                          <span className={cn("text-xs font-medium", form.status === s ? "text-primary" : "text-slate-500")}>
                            {cfg.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <Button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={isSaving}
                    className="w-full gap-2 shadow-sm active:scale-[0.98] transition-transform"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isUploading ? "Đang upload ảnh..." : patchMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSaving}
                    className="w-full gap-2 active:scale-[0.98] transition-transform"
                  >
                    <X className="w-4 h-4" />
                    Hủy bỏ
                  </Button>
                  {post.published_at && (
                    <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1 pt-1">
                      <CircleCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Xuất bản {new Date(post.published_at).toLocaleDateString("vi-VN")}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
