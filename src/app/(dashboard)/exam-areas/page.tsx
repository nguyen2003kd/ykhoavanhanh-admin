"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { FieldSection, HospitalCrudPage, TextareaField } from "@/components/hospital-admin/HospitalCrudPage";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  examAreasHooks,
  exportExamAreas,
  type ExamArea,
  type CreateExamAreaPayload,
} from "@/api/examAreasApi";
import { toast } from "@/components/ui/Toast";

type AreaForm = {
  code: string;
  name: string;
  short_name: string;
  address: string;
  phone: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
};

const createInitialForm = (): AreaForm => ({
  code: "",
  name: "",
  short_name: "",
  address: "",
  phone: "",
  description: "",
  status: "ACTIVE",
});

function mapItemToForm(item: ExamArea): AreaForm {
  return {
    code: item.code,
    name: item.name,
    short_name: item.short_name ?? "",
    address: item.address ?? "",
    phone: item.phone ?? "",
    description: item.description ?? "",
    status: item.status,
  };
}

function formToPayload(form: AreaForm): CreateExamAreaPayload {
  return {
    code: form.code,
    name: form.name,
    short_name: form.short_name || undefined,
    address: form.address || undefined,
    phone: form.phone || undefined,
    description: form.description || undefined,
    status: form.status,
  };
}

export default function ExamAreasPage() {
  const { data, isLoading } = examAreasHooks.useList();
  const areas = data?.rows ?? [];

  const createMutation = examAreasHooks.useCreate({
    onSuccess: () => toast.success("Tạo khu vực khám thành công"),
    onError: (err) => toast.error(err.message || "Tạo khu vực khám thất bại"),
  });

  const updateMutation = examAreasHooks.useUpdate({
    onSuccess: () => toast.success("Cập nhật khu vực khám thành công"),
    onError: (err) => toast.error(err.message || "Cập nhật khu vực khám thất bại"),
  });

  const deleteMutation = examAreasHooks.useDelete({
    onSuccess: () => toast.success("Xóa khu vực khám thành công"),
    onError: (err) => toast.error(err.message || "Xóa khu vực khám thất bại"),
  });

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const [isExporting, setIsExporting] = useState(false);

  async function handleExportExcel() {
    setIsExporting(true);
    try {
      const blob = await exportExamAreas();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `khu-vuc-kham-${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Xuất file Excel thành công");
    } catch (err) {
      toast.error((err as Error).message || "Xuất file Excel thất bại");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <HospitalCrudPage
      title="Quản lý khu vực khám bệnh"
      description="Quản lý tên khu vực, mô tả khu khám, địa chỉ và ID nội bộ để các phòng khám bên dưới có thể liên kết đúng."
      itemName="khu vực khám"
      compact
      isLoading={isLoading}
      isMutating={isMutating}
      headerActions={
        <Button
          variant="outline"
          className="h-12 rounded-2xl px-5 text-[15px] shadow-sm"
          onClick={handleExportExcel}
          disabled={isExporting}
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Đang xuất..." : "Xuất Excel"}
        </Button>
      }
      items={areas}
      createInitialForm={createInitialForm}
      mapItemToForm={mapItemToForm}
      onCreate={(form) => createMutation.mutate(formToPayload(form))}
      onUpdate={(id, form) => updateMutation.mutate({ id, data: formToPayload(form) })}
      onDelete={(id) => deleteMutation.mutate(id)}
      getSearchText={(item) => [item.id, item.code, item.name, item.short_name ?? "", item.address ?? ""].join(" ")}
      columns={[
        {
          title: "Mã khu vực",
          render: (item) => item.code,
        },
        {
          title: "Tên khu vực",
          render: (item) => item.name,
        },
        {
          title: "Tên viết tắt",
          render: (item) => item.short_name ?? "—",
        },
        {
          title: "Địa chỉ",
          render: (item) => item.address ?? "—",
        },
        {
          title: "Số điện thoại",
          render: (item) => item.phone ?? "—",
        },
        {
          title: "Trạng thái",
          render: (item) => (item.status === "ACTIVE" ? "Hoạt động" : "Ngưng"),
        },
      ]}
      renderForm={(form, setForm) => (
        <div className="space-y-5">
          <FieldSection
            title="Thông tin khu vực khám"
            description="Mô tả và địa chỉ khu khám sẽ được phòng khám kế thừa để admin tra cứu nhanh."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Mã khu vực"
                value={form.code}
                onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
                placeholder="VD: KVK01"
              />
              <Input
                label="Tên khu vực khám bệnh"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="VD: Khu khám Chuyên sâu"
              />
              <Input
                label="Tên viết tắt"
                value={form.short_name}
                onChange={(event) => setForm((prev) => ({ ...prev, short_name: event.target.value }))}
                placeholder="VD: KVTQ"
              />
              <Input
                label="Số điện thoại"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="VD: 0901234567"
              />
            </div>
            <TextareaField
              label="Mô tả khu khám"
              value={form.description}
              onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
              placeholder="Mô tả công năng khu khám"
            />
            <TextareaField
              label="Địa chỉ"
              value={form.address}
              onChange={(value) => setForm((prev) => ({ ...prev, address: value }))}
              placeholder="Địa chỉ hoặc vị trí khu khám"
              rows={2}
            />
          </FieldSection>
        </div>
      )}
    />
  );
}
