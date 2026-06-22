"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { postsHooks, postsMediaService, postsService } from "@/api/postsApi";
import { postCategoriesHooks } from "@/api/postCategoriesApi";
import { Select } from "@/components/ui/Select";
import { ThumbnailUpload } from "@/components/hospital-admin/ThumbnailUpload";
import { TextEditor } from "@/components/shares/rich-text-editor";
import type { ApiFile } from "@/components/shares/rich-text-editor/types/types";
import { toast } from "@/components/ui/Toast";
import {
  ChevronLeft,
  FileText,
  Image as ImageIcon,
  AlignLeft,
  Globe,
  Star,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const STATUS_CONFIG = {
  DRAFT: { label: "Nháp", icon: ClockIcon, color: "text-amber-600 bg-amber-50 border-amber-200" },
  PUBLISHED: { label: "Đã xuất bản", icon: GlobeIcon, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  HIDDEN: { label: "Ẩn", icon: AlertCircleIcon, color: "text-slate-500 bg-slate-50 border-slate-200" },
  ARCHIVED: { label: "Lưu trữ", icon: ArchiveIcon, color: "text-slate-400 bg-slate-50 border-slate-200" },
} as const;

function ArchiveIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>;
}

function ClockIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function GlobeIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
}
function AlertCircleIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}

export default function NewNewsPage() {
  const router = useRouter();
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
  const { data: categoriesData } = postCategoriesHooks.useList({ currentPage: 1, pageSize: 100 } as Record<string, unknown>);
  const categoryOptions = (categoriesData?.rows ?? [])
    .filter((c) => c.is_active)
    .map((c) => ({ value: c.id, label: c.name }));
  const [pendingThumbnail, setPendingThumbnail] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditorUploading, setIsEditorUploading] = useState(false);
  // ID của post DRAFT được tạo trước để phục vụ upload media
  const [draftPostId, setDraftPostId] = useState<string | null>(null);

  const patchMutation = postsHooks.usePatch();

  const createMutation = postsHooks.useCreate({
    onSuccess: () => {
      toast.success("Tạo tin tức thành công");
      router.push("/content/news");
    },
    onError: (err) => toast.error(err.message || "Tạo tin tức thất bại"),
  });

  async function getOrCreateDraftId(): Promise<string> {
    if (draftPostId) return draftPostId;
    const draft = await postsService.create({
      name: form.name.trim() || "Bài viết mới",
      status: "DRAFT",
    });
    setDraftPostId(draft.id);
    return draft.id;
  }

  async function handleEditorUpload(file: File): Promise<(ApiFile & { url: string }) | null> {
    setIsEditorUploading(true);
    try {
      const postId = await getOrCreateDraftId();
      return await postsService.uploadEditorFileForPost(postId, file);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload ảnh thất bại");
      return null;
    } finally {
      setIsEditorUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tiêu đề tin tức");
      return;
    }

    let thumbnailPath = form.thumbnail_path;

    if (pendingThumbnail) {
      setIsUploading(true);
      try {
        const postId = await getOrCreateDraftId();
        const media = await postsMediaService.upload(postId, pendingThumbnail, { media_type: "THUMBNAIL" });
        thumbnailPath = media.url ?? media.file_path;
        setPendingThumbnail(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload ảnh thất bại");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const payload = {
      ...form,
      thumbnail_path: thumbnailPath,
      slug: form.slug.trim() || slugify(form.name),
      category_id: form.category_id || undefined,
    };

    if (draftPostId) {
      // Patch post DRAFT đã tạo thay vì tạo mới
      patchMutation.mutate(
        { id: draftPostId, data: payload },
        {
          onSuccess: () => {
            toast.success("Tạo tin tức thành công");
            router.push("/content/news");
          },
          onError: (err) => toast.error(err.message || "Tạo tin tức thất bại"),
        }
      );
    } else {
      createMutation.mutate(payload);
    }
  }

  const currentStatus = STATUS_CONFIG[form.status] ?? STATUS_CONFIG.DRAFT;
  const StatusIcon = currentStatus.icon;
  const isSaving = createMutation.isPending || patchMutation.isPending || isUploading || isEditorUploading;

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
            <span className="text-sm font-medium text-slate-800">Tạo tin tức mới</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
              currentStatus.color
            )}>
              <StatusIcon className="w-3 h-3" />
              {currentStatus.label}
            </div>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              size="sm"
              className="gap-2 shadow-sm active:scale-[0.98] transition-transform"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Tạo tin tức
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
                  content={form.content}
                  onChangeContent={(value) => setForm({ ...form, content: value })}
                  contentClassName="min-h-[600px] rounded-xl border border-slate-200 text-sm"
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
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="w-full gap-2 shadow-sm active:scale-[0.98] transition-transform"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isUploading ? "Đang upload ảnh..." : createMutation.isPending ? "Đang lưu..." : "Tạo tin tức"}
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
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
