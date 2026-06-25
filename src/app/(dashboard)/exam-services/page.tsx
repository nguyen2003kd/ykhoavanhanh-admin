"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { FieldSection, HospitalCrudPage } from "@/components/hospital-admin/HospitalCrudPage";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { hisServicesHooks, hisServicesService, type HisService, type CreateHisServicePayload } from "@/api/hisServicesApi";
import { toast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";

type ServiceForm = {
  serviceid: string;
  servicetype: string;
  servicename: string;
  price: string;
  insurancetype: string;
  description: string;
};

const createInitialForm = (): ServiceForm => ({
  serviceid: "",
  servicetype: "",
  servicename: "",
  price: "",
  insurancetype: "",
  description: "",
});

function mapItemToForm(item: HisService): ServiceForm {
  return {
    serviceid: item.serviceid,
    servicetype: item.servicetype,
    servicename: item.servicename,
    price: item.price,
    insurancetype: item.insurancetype,
    description: item.description ?? "",
  };
}

function formToPayload(form: ServiceForm): CreateHisServicePayload {
  return {
    service_id: form.serviceid,
    service_name: form.servicename,
    service_type: form.servicetype,
    price: Number(form.price) || 0,
    insurancetype: form.insurancetype,
    description: form.description,
  };
}

export default function ExamServicesPage() {
  const { data: services, isLoading } = hisServicesHooks.useList();

  const createMutation = hisServicesHooks.useCreate({
    onSuccess: () => toast.success("Tạo dịch vụ thành công"),
    onError: (err) => toast.error(err.message || "Tạo dịch vụ thất bại"),
  });

  const updateMutation = hisServicesHooks.useUpdate({
    onSuccess: () => toast.success("Cập nhật dịch vụ thành công"),
    onError: (err) => toast.error(err.message || "Cập nhật dịch vụ thất bại"),
  });

  const deleteMutation = hisServicesHooks.useDelete({
    onSuccess: () => toast.success("Xóa dịch vụ thành công"),
    onError: (err) => toast.error(err.message || "Xóa dịch vụ thất bại"),
  });

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const [isExporting, setIsExporting] = useState(false);

  async function handleExportExcel() {
    setIsExporting(true);
    try {
      const blob = await hisServicesService.export();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dich-vu-his-${Date.now()}.xlsx`;
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
      title="Quản lý dịch vụ khám"
      description="Danh sách dịch vụ đồng bộ từ HIS."
      itemName="dịch vụ khám"
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
      items={services ?? []}
      createInitialForm={createInitialForm}
      mapItemToForm={mapItemToForm}
      onCreate={(form) => createMutation.mutate(formToPayload(form))}
      onUpdate={(id, form) => updateMutation.mutate({ id, data: formToPayload(form) })}
      onDelete={(id) => deleteMutation.mutate(id)}
      getSearchText={(item) =>
        [item.serviceid, item.servicename, item.servicetype, item.insurancetype, item.description ?? ""].join(" ")
      }
      columns={[
        {
          title: "Mã dịch vụ",
          render: (item) => item.serviceid,
        },
        {
          title: "Tên dịch vụ",
          render: (item) => item.servicename,
        },
        {
          title: "Loại dịch vụ",
          render: (item) => item.servicetype,
        },
        {
          title: "Giá",
          render: (item) => formatCurrency(Number(item.price) || 0),
        },
        {
          title: "Loại BH",
          render: (item) => item.insurancetype,
        },
        {
          title: "Mô tả",
          render: (item) => item.description ?? "—",
        },
        {
          title: "Từ ngày",
          render: (item) => item.fromdate,
        },
        {
          title: "Cập nhật lúc",
          render: (item) => item.updatetime,
        },
      ]}
      renderForm={(form, setForm) => (
        <div className="space-y-5">
          <FieldSection title="Thông tin dịch vụ" description="Dữ liệu đồng bộ từ HIS.">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Mã dịch vụ"
                value={form.serviceid}
                onChange={(event) => setForm((prev) => ({ ...prev, serviceid: event.target.value }))}
                placeholder="VD: 16635"
              />
              <Input
                label="Tên dịch vụ"
                value={form.servicename}
                onChange={(event) => setForm((prev) => ({ ...prev, servicename: event.target.value }))}
                placeholder="VD: Khám cấp cứu"
              />
              <Input
                label="Loại dịch vụ"
                value={form.servicetype}
                onChange={(event) => setForm((prev) => ({ ...prev, servicetype: event.target.value }))}
                placeholder="VD: KHÁM"
              />
              <Input
                label="Giá"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                placeholder="VD: 360000"
              />
              <Input
                label="Loại bảo hiểm"
                value={form.insurancetype}
                onChange={(event) => setForm((prev) => ({ ...prev, insurancetype: event.target.value }))}
                placeholder="VD: BHXH/BHT/DV"
              />
              <Input
                label="Mô tả"
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
          </FieldSection>
        </div>
      )}
    />
  );
}
