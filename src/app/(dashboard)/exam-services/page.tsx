"use client";

import { FieldSection, HospitalCrudPage } from "@/components/hospital-admin/HospitalCrudPage";
import { Input } from "@/components/ui/Input";
import { hisServicesHooks, type HisService } from "@/api/hisServicesApi";
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

export default function ExamServicesPage() {
  const { data: services } = hisServicesHooks.useList();

  return (
    <HospitalCrudPage
      title="Quản lý dịch vụ khám"
      description="Danh sách dịch vụ đồng bộ từ HIS."
      itemName="dịch vụ khám"
      compact
      items={services ?? []}
      createInitialForm={createInitialForm}
      mapItemToForm={mapItemToForm}
      onCreate={() => {
        toast.info("Chưa hỗ trợ tạo dịch vụ từ HIS API");
      }}
      onUpdate={() => {
        toast.info("Chưa hỗ trợ cập nhật dịch vụ từ HIS API");
      }}
      onDelete={() => {
        toast.info("Chưa hỗ trợ xóa dịch vụ từ HIS API");
      }}
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
