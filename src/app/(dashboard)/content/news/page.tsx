"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { postsHooks } from "@/api/postsApi";
import { postCategoriesHooks } from "@/api/postCategoriesApi";
import { toast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import { Link as LinkIcon } from "@/lib/link";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Eye,
  Loader2,
  Search,
  X,
  FileText,
  Clock,
  Globe,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const STATUS_CONFIG = {
  PUBLISHED: { label: "Đã xuất bản", color: "text-emerald-600 bg-emerald-50 border border-emerald-200", dot: "bg-emerald-500" },
  DRAFT: { label: "Nháp", color: "text-amber-600 bg-amber-50 border border-amber-200", dot: "bg-amber-500" },
  HIDDEN: { label: "Ẩn", color: "text-slate-500 bg-slate-50 border border-slate-200", dot: "bg-slate-400" },
  ARCHIVED: { label: "Lưu trữ", color: "text-slate-400 bg-slate-50 border border-slate-200", dot: "bg-slate-300" },
} as const;

function useAllPosts() {
  const { data } = postsHooks.useList({ currentPage: 1, pageSize: 1000 });
  return data?.rows ?? [];
}

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "DRAFT" | "PUBLISHED" | "HIDDEN" | "ARCHIVED">("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const { data, isFetching } = postsHooks.useList({
    currentPage: page,
    pageSize: PAGE_SIZE,
    ...(search ? { search } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(categoryFilter ? { category_id: categoryFilter } : {}),
  });
  const rows = data?.rows ?? [];
  const total = data?.count ?? 0;
  const totalPages = data?.totalPages ?? (Math.ceil(total / PAGE_SIZE) || 1);

  const allPosts = useAllPosts();
  const statTotal = allPosts.length;
  const statDraft = allPosts.filter((p) => p.status === "DRAFT").length;
  const statPublished = allPosts.filter((p) => p.status === "PUBLISHED").length;
  const statFeatured = allPosts.filter((p) => p.is_featured).length;

  const { data: categoriesData } = postCategoriesHooks.useList({ currentPage: 1, pageSize: 100 } as Record<string, unknown>);
  const categoryOptions = (categoriesData?.rows ?? [])
    .filter((c) => c.is_active)
    .map((c) => ({ value: c.id, label: c.name }));

  const deleteMutation = postsHooks.useDelete({
    onSuccess: () => toast.success("Xóa tin tức thành công"),
    onError: (err) => toast.error(err.message || "Xóa tin tức thất bại"),
  });

  const activeFilterCount = (search ? 1 : 0) + (statusFilter ? 1 : 0) + (categoryFilter ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* ── Stats Cards ────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{statTotal}</p>
              <p className="text-xs text-slate-400 font-medium">Tổng bài viết</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{statPublished}</p>
              <p className="text-xs text-slate-400 font-medium">Đã xuất bản</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{statDraft}</p>
              <p className="text-xs text-slate-400 font-medium">Bản nháp</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{statFeatured}</p>
              <p className="text-xs text-slate-400 font-medium">Nổi bật</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Header + Filters ───────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Tin tức</h1>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 text-primary text-xs font-medium">
                  {activeFilterCount} bộ lọc
                  <button onClick={() => { setSearch(""); setStatusFilter(""); setCategoryFilter(""); setPage(1); }} className="hover:text-primary/70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 mt-0.5">Thông báo và sự kiện bệnh viện</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Tìm tiêu đề, mô tả..."
                className="w-full sm:w-64 pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }}
                className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white text-slate-600 outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Trạng thái</option>
                <option value="DRAFT">Nháp</option>
                <option value="PUBLISHED">Đã xuất bản</option>
                <option value="HIDDEN">Ẩn</option>
                <option value="ARCHIVED">Lưu trữ</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white text-slate-600 outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Danh mục</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <Link
                href="/content/news/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Đăng tin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Table Card ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
        {isFetching && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        )}

        {!isFetching && rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 8"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">Chưa có tin tức nào</p>
            <p className="text-xs text-slate-400">Tạo tin tức đầu tiên để bắt đầu</p>
          </div>
        )}

        {!isFetching && rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3">Bài viết</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3">Trạng thái</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3 hidden lg:table-cell">Danh mục</th>
                  <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3 hidden xl:table-cell">Nổi bật</th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3 hidden md:table-cell">Lượt xem</th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((post) => {
                  const statusCfg = STATUS_CONFIG[post.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.DRAFT;
                  const thumbnailUrl = post.thumbnail_path
                    ? (post.thumbnail_path.startsWith("http")
                      ? post.thumbnail_path
                      : LinkIcon.imgEndpoid + post.thumbnail_path)
                    : null;

                  return (
                    <tr key={post.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* ── Post info ─── */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Thumbnail */}
                          <div className={cn(
                            "w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border",
                            thumbnailUrl ? "border-slate-200" : "border-slate-200 bg-slate-100"
                          )}>
                            {thumbnailUrl ? (
                              <Image
                                src={thumbnailUrl}
                                alt={post.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                                  <circle cx="8.5" cy="8.5" r="1.5"/>
                                  <path d="M21 15l-5-5L5 21"/>
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Text */}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate max-w-xs">{post.name}</p>
                            {post.description && (
                              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{post.description}</p>
                            )}
                            <p className="text-xs text-slate-300 mt-0.5">
                              {post.created_at ? formatDate(post.created_at) : "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ── Status badge ─── */}
                      <td className="px-6 py-4">
                        <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", statusCfg.color)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                          {statusCfg.label}
                        </div>
                      </td>

                      {/* ── Category ─── */}
                      <td className="px-6 py-4 hidden lg:table-cell">
                        {post.category ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-600">
                            {post.category.name}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>

                      {/* ── Featured ─── */}
                      <td className="px-6 py-4 text-center hidden xl:table-cell">
                        {post.is_featured ? (
                          <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-50">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>

                      {/* ── View count ─── */}
                      <td className="px-6 py-4 text-right hidden md:table-cell">
                        <div className="inline-flex items-center gap-1 text-xs text-slate-400">
                          <Eye className="w-3.5 h-3.5" />
                          {post.view_count?.toLocaleString() ?? 0}
                        </div>
                      </td>

                      {/* ── Actions ─── */}
                      <td className=" py-4">
                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity justify-end">
                          <Link
                            href={`/content/news/${post.id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-primary hover:bg-primary-50 transition-colors"
                            title="Sửa"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => {
                              if (confirm("Bạn có chắc muốn xóa tin tức này?")) {
                                deleteMutation.mutate(post.id);
                              }
                            }}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Xóa"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ─────────────────────────── */}
        {rows.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Hiển thị {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} trong {total} bài viết
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 || p === totalPages || Math.abs(p - page) <= 1
                )
                .map((p, idx, arr) => (
                  <span key={p} className="contents">
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-1 text-slate-400 text-sm">…</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={cn(
                        "inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm transition-colors",
                        p === page
                          ? "bg-primary text-white shadow-sm"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
