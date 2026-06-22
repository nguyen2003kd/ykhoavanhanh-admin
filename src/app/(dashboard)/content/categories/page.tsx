"use client";

import { useState, useMemo } from "react";
import { postCategoriesHooks, type PostCategory } from "@/api/postCategoriesApi";
import { toast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Check,
  FolderOpen,
} from "lucide-react";
import { LoadingSection, Spinner } from "@/components/ui/Spinner";
import { ConfirmDialog } from "@/components/shares/dialog-confirm";

const PAGE_SIZE = 10;

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  parent_id: string;
  sort_order: number;
  is_active: boolean;
}

const EMPTY_FORM: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  parent_id: "",
  sort_order: 0,
  is_active: true,
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

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

/* ─── Component ───────────────────────────────────────────────────────────── */

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);

  const params = useMemo(() => {
    const p: Record<string, unknown> = { currentPage: page, pageSize: PAGE_SIZE };
    if (filterActive !== null) p.is_active = filterActive;
    return p;
  }, [page, filterActive]);

  const { data, isFetching } = postCategoriesHooks.useList(params);
  const total = data?.count ?? 0;
  const totalPages = data?.totalPages ?? (Math.ceil(total / PAGE_SIZE) || 1);

  const filteredRows = useMemo(() => {
    const rows = data?.rows ?? [];
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q)
    );
  }, [data, search]);

  /* ── Mutations ────────────────────────────────────────────────────────── */

  const createMutation = postCategoriesHooks.useCreate({
    onSuccess: () => {
      toast.success("Tạo danh mục thành công");
      closeModal();
    },
    onError: (err) => toast.error(err.message || "Tạo danh mục thất bại"),
  });

  const patchMutation = postCategoriesHooks.usePatch({
    onSuccess: () => toast.success("Cập nhật thành công"),
    onError: (err) => toast.error(err.message || "Cập nhật thất bại"),
  });

  const deleteMutation = postCategoriesHooks.useDelete({
    onSuccess: () => toast.success("Xóa danh mục thành công"),
    onError: (err) => toast.error(err.message || "Xóa danh mục thất bại"),
  });

  /* ── Actions ────────────────────────────────────────────────────────────── */

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(cat: PostCategory) {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
      parent_id: cat.parent_id ?? "",
      sort_order: cat.sort_order ?? 0,
      is_active: cat.is_active ?? true,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    const payload = {
      ...form,
      slug: form.slug.trim() || slugify(form.name),
      parent_id: form.parent_id || undefined,
      sort_order: Number(form.sort_order) || 0,
    };
    if (editingId) {
      patchMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  function toggleActive(cat: PostCategory) {
    patchMutation.mutate({
      id: cat.id,
      data: { is_active: !cat.is_active },
    });
  }

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  function openConfirmDelete(id: string) {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  }

  function handleConfirmDelete() {
    if (pendingDeleteId) {
      deleteMutation.mutate(pendingDeleteId);
      setPendingDeleteId(null);
      setConfirmOpen(false);
    }
  }

  /* ── Render ─────────────────────────────────────────────────────────────── */

  const isMutating =
    createMutation.isPending ||
    patchMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Danh mục bài viết</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý danh mục tin tức và bài viết
            {total > 0 && (
              <span className="ml-1.5 text-slate-400">({total} danh mục)</span>
            )}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Thêm danh mục
        </button>
      </div>

      {/* ── Filters ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tên, slug..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {(
            [
              { label: "Tất cả", value: null },
              { label: "Đang hoạt động", value: true },
              { label: "Đã tắt", value: false },
            ] as { label: string; value: boolean | null }[]
          ).map((f) => (
            <button
              key={String(f.value)}
              onClick={() => {
                setFilterActive(f.value);
                setPage(1);
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                filterActive === f.value
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
        {isFetching && <LoadingSection />}

        {!isFetching && filteredRows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <FolderOpen className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">
              Chưa có danh mục nào
            </p>
            <p className="text-xs text-slate-400">
              Tạo danh mục đầu tiên để bắt đầu
            </p>
          </div>
        )}

        {!isFetching && filteredRows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3">
                    Danh mục
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3 hidden md:table-cell">
                    Slug
                  </th>
                  <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3 hidden lg:table-cell">
                    Thứ tự
                  </th>
                  <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3">
                    Trạng thái
                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3 hidden sm:table-cell">
                    Ngày tạo
                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Name + Description */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FolderOpen className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate max-w-[200px]">
                            {cat.name}
                          </p>
                          {cat.description && (
                            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                        {cat.slug}
                      </span>
                    </td>

                    {/* Sort order */}
                    <td className="px-6 py-4 text-center hidden lg:table-cell">
                      <span className="text-xs text-slate-500">
                        {cat.sort_order ?? 0}
                      </span>
                    </td>

                    {/* Active toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleActive(cat)}
                        disabled={patchMutation.isPending}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                          cat.is_active
                            ? "text-emerald-600 bg-emerald-50 border border-emerald-200"
                            : "text-slate-500 bg-slate-50 border border-slate-200"
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            cat.is_active ? "bg-emerald-500" : "bg-slate-400"
                          )}
                        />
                        {cat.is_active ? "Hoạt động" : "Tắt"}
                      </button>
                    </td>

                    {/* Created at */}
                    <td className="px-6 py-4 text-right hidden sm:table-cell">
                      <span className="text-xs text-slate-400">
                        {cat.created_at ? formatDate(cat.created_at) : "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className=" py-4">
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity justify-end">
                        <button
                          onClick={() => openEdit(cat)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-primary hover:bg-primary-50 transition-colors"
                          title="Sửa"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openConfirmDelete(cat.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Xóa"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredRows.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Hiển thị {((page - 1) * PAGE_SIZE) + 1}–
              {Math.min(page * PAGE_SIZE, total)} trong {total} danh mục
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

      {/* ── Modal ──────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">
                {editingId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      name: e.target.value,
                      slug:
                        f.slug && f.slug === slugify(f.name)
                          ? slugify(e.target.value)
                          : f.slug,
                    }))
                  }
                  placeholder="VD: Sức khỏe"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  autoFocus
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, slug: e.target.value }))
                  }
                  placeholder="suc-khoe"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Để trống sẽ tự động tạo từ tên danh mục
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Mô tả ngắn về danh mục..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Sort order + Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Thứ tự
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        sort_order: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Trạng thái
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, is_active: !f.is_active }))
                    }
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-xl border transition-colors",
                      form.is_active
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-slate-50 border-slate-200 text-slate-500"
                    )}
                  >
                    {form.is_active ? (
                      <>
                        <Check className="w-4 h-4" />
                        Hoạt động
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        Tắt
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isMutating}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {isMutating && (
                    <Spinner size="sm" />
                  )}
                  {editingId ? "Lưu thay đổi" : "Tạo danh mục"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="delete"
        title="Xóa danh mục"
        description="Bạn có chắc muốn xóa danh mục này? Hành động này không thể hoàn tác."
        confirmLabel="Xóa"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
