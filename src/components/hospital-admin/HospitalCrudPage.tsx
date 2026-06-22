"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Edit, Eye, Loader2, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ListPageLayout } from "@/components/ui/ListPageLayout";
import { Modal } from "@/components/ui/Modal";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

export type CrudColumn<T> = {
  title: string;
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  render: (item: T, index: number) => React.ReactNode;
};

type HospitalCrudPageProps<TItem extends { id: string }, TForm> = {
  title: string;
  description: string;
  itemName: string;
  items: TItem[];
  columns: CrudColumn<TItem>[];
  createInitialForm: () => TForm;
  mapItemToForm: (item: TItem) => TForm;
  renderForm: (
    form: TForm,
    setForm: React.Dispatch<React.SetStateAction<TForm>>
  ) => React.ReactNode;
  onCreate: (form: TForm) => void;
  onUpdate: (id: string, form: TForm) => void;
  onDelete: (id: string) => void;
  getSearchText: (item: TItem) => string;
  detailHref?: (item: TItem) => string;
  formSize?: "md" | "lg" | "xl" | "2xl";
  summary?: React.ReactNode;
  compact?: boolean;
  showActions?: boolean;
  isLoading?: boolean;
  isMutating?: boolean;
  pagination?: {
    currentPage: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    onPageSizeChange: (size: number) => void;
  };
};

export function HospitalCrudPage<TItem extends { id: string }, TForm>({
  title,
  description,
  itemName,
  items,
  columns,
  createInitialForm,
  mapItemToForm,
  renderForm,
  onCreate,
  onUpdate,
  onDelete,
  getSearchText,
  detailHref,
  formSize = "xl",
  summary,
  compact = false,
  showActions = true,
  isLoading = false,
  isMutating = false,
  pagination,
}: HospitalCrudPageProps<TItem, TForm>) {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TItem | null>(null);
  const [draft, setDraft] = useState<TForm>(createInitialForm);
  const [deleteTarget, setDeleteTarget] = useState<TItem | null>(null);
  const prevMutating = useRef(false);

  // Đóng modal khi mutation vừa hoàn thành
  useEffect(() => {
    if (prevMutating.current && !isMutating) {
      setIsFormOpen(false);
    }
    prevMutating.current = isMutating;
  }, [isMutating]);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => getSearchText(item).toLowerCase().includes(keyword));
  }, [getSearchText, items, search]);

  const openCreate = () => {
    setEditingItem(null);
    setDraft(createInitialForm());
    setIsFormOpen(true);
  };

  const openEdit = (item: TItem) => {
    setEditingItem(item);
    setDraft(mapItemToForm(item));
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (editingItem) {
      onUpdate(editingItem.id, draft);
    } else {
      onCreate(draft);
    }
  };

  return (
    <div className="space-y-6">
      {!compact && (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
          <Button variant="primary" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm {itemName}
          </Button>
        </div>
      )}

      {!compact && summary}

      <Card className="overflow-hidden rounded-[24px] border-gray-200 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <CardHeader className="space-y-4 border-b border-gray-100 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,0.96))] px-7 py-5">
          {compact ? (
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full max-w-xl">
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`Nhập tên, mã hoặc nội dung liên quan đến ${itemName}`}
                  className="h-12 rounded-2xl border-gray-200 bg-white px-4 text-[15px] shadow-sm"
                />
              </div>
              <Button variant="primary" onClick={openCreate} className="h-12 rounded-2xl px-5 text-[15px] shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Thêm {itemName}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-lg">{title}</CardTitle>
                <Badge variant="info">{filteredItems.length} bản ghi</Badge>
              </div>
              <div className="max-w-md">
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  label={`Tìm kiếm ${itemName}`}
                  placeholder={`Nhập tên, mã hoặc nội dung liên quan đến ${itemName}`}
                />
              </div>
            </>
          )}
        </CardHeader>
        <CardContent className="px-7 py-5">
          <ListPageLayout
            items={filteredItems}
            resetPageKey={search}
            externalPagination={pagination ? { ...pagination } : undefined}
            renderTable={(pagedItems) => (
              <div className="overflow-hidden rounded-[22px] border border-gray-200 bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/90">
                      <TableHead className="sticky left-0 z-10 bg-slate-50/90 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 whitespace-nowrap">
                        STT
                      </TableHead>
                      {columns.map((column) => (
                        <TableHead
                          key={column.title}
                          className={`text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 whitespace-nowrap ${column.headerClassName ?? column.className ?? ""}`}
                        >
                          {column.title}
                        </TableHead>
                      ))}
                      {showActions && (
                        <TableHead className="sticky right-0 z-10 bg-slate-50/90 text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 whitespace-nowrap">
                          Thao tác
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i} className="odd:bg-white even:bg-slate-50/40">
                          <TableCell><div className="h-5 w-8 animate-pulse rounded-full bg-slate-200" /></TableCell>
                          {columns.map((col) => (
                            <TableCell key={col.title}>
                              <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                            </TableCell>
                          ))}
                          {showActions && (
                            <TableCell>
                              <div className="flex justify-end gap-2">
                                <div className="h-8 w-8 animate-pulse rounded-xl bg-slate-200" />
                                <div className="h-8 w-8 animate-pulse rounded-xl bg-slate-200" />
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : pagedItems.map((item, index) => (
                      <TableRow
                        key={item.id}
                        className="odd:bg-white even:bg-slate-50/40 hover:bg-sky-50/60"
                      >
                        <TableCell className="sticky left-0 z-[1] bg-background whitespace-nowrap">
                          <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {index + 1}
                          </span>
                        </TableCell>
                        {columns.map((column) => (
                          <TableCell
                            key={column.title}
                            className={`min-w-[120px] align-top text-[15px] leading-7 text-slate-700 ${column.cellClassName ?? column.className ?? ""}`}
                          >
                            <div className="max-w-[260px] break-words whitespace-normal">
                              {column.render(item, index)}
                            </div>
                          </TableCell>
                        ))}
                        {showActions && (
                          <TableCell className="sticky right-0 z-[1] bg-background">
                            <div className="flex justify-end gap-2 whitespace-nowrap">
                              {detailHref && (
                                <Link href={detailHref(item)}>
                                  <Button variant="ghost" size="sm" className="rounded-xl px-2.5" title="Xem" aria-label="Xem">
                                    <Eye className="size-4" />
                                  </Button>
                                </Link>
                              )}
                              <Button variant="outline" size="sm" onClick={() => openEdit(item)} className="rounded-xl px-2.5" title="Sửa" aria-label="Sửa">
                                <Edit className="size-4" />
                              </Button>
                              <Button variant="danger" size="sm" onClick={() => setDeleteTarget(item)} className="rounded-xl px-2.5" title="Xóa" aria-label="Xóa">
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingItem ? `Cập nhật ${itemName}` : `Thêm ${itemName}`}
        size={formSize}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsFormOpen(false)} disabled={isMutating}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={isMutating} className="min-w-[100px]">
              {isMutating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{editingItem ? "Đang lưu..." : "Đang tạo..."}</>
              ) : (
                editingItem ? "Lưu thay đổi" : "Tạo mới"
              )}
            </Button>
          </div>
        }
      >
        {renderForm(draft, setDraft)}
      </Modal>

      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title={`Xóa ${itemName}`}
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (deleteTarget) onDelete(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              Xác nhận xóa
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600">
          Bạn có chắc muốn xóa {itemName} này? Hành động này sẽ ảnh hưởng đến dữ liệu quản trị liên quan.
        </p>
      </Modal>
    </div>
  );
}

export function AuditStamp({
  createdAt,
  updatedAt,
  updatedBy,
}: {
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}) {
  return (
    <div className="space-y-1 text-xs text-gray-500">
      <p>Tạo: {formatDateTime(createdAt)}</p>
      <p>Cập nhật: {formatDateTime(updatedAt)}</p>
      <p>Người cập nhật: {updatedBy}</p>
    </div>
  );
}

export function FieldSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/70 p-4">
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function TextareaField({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="w-full">
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
      />
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
      </div>
    </label>
  );
}
