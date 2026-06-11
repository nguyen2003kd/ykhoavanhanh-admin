"use client";

import { FieldSection, HospitalCrudPage, TextareaField, ToggleField } from "@/components/hospital-admin/HospitalCrudPage";
import { Input } from "@/components/ui/Input";
import { useHospitalAdminStore } from "@/hooks/useHospitalAdminStore";
import { formatCurrency } from "@/lib/utils";
import { ExamService } from "@/types/hospital-admin";

type ServiceForm = {
  name: string;
  service_type: string;
  service_group: string;
  insurance_visit_type: string;
  service_price: number;
  base_price: number;
  deposit: number;
  booking_note: string;
  detail: string;
  guide_room: string;
  internal_id: string;
  booking_group: string;
  display_group: string;
  show_price: boolean;
  display_priority: number;
};

const createInitialForm = (): ServiceForm => ({
  name: "",
  service_type: "",
  service_group: "",
  insurance_visit_type: "",
  service_price: 0,
  base_price: 0,
  deposit: 0,
  booking_note: "",
  detail: "",
  guide_room: "",
  internal_id: "",
  booking_group: "",
  display_group: "",
  show_price: true,
  display_priority: 1,
});

function mapItemToForm(item: ExamService): ServiceForm {
  return {
    name: item.name,
    service_type: item.service_type,
    service_group: item.service_group,
    insurance_visit_type: item.insurance_visit_type,
    service_price: item.service_price,
    base_price: item.base_price,
    deposit: item.deposit,
    booking_note: item.booking_note,
    detail: item.detail,
    guide_room: item.guide_room,
    internal_id: item.internal_id,
    booking_group: item.booking_group,
    display_group: item.display_group,
    show_price: item.show_price,
    display_priority: item.display_priority,
  };
}

export default function ExamServicesPage() {
  const services = useHospitalAdminStore((state) => state.services);
  const addService = useHospitalAdminStore((state) => state.addService);
  const updateService = useHospitalAdminStore((state) => state.updateService);
  const deleteService = useHospitalAdminStore((state) => state.deleteService);

  return (
    <HospitalCrudPage
      title="Quản lý dịch vụ khám"
      description="Quản lý loại dịch vụ, nhóm dịch vụ, khám BHYT, giá, tạm ứng và nhóm hiển thị để mở lịch khám theo đúng dịch vụ."
      itemName="dịch vụ khám"
      compact
      items={services}
      createInitialForm={createInitialForm}
      mapItemToForm={mapItemToForm}
      onCreate={addService}
      onUpdate={updateService}
      onDelete={deleteService}
      getSearchText={(item) =>
        [
          item.id,
          item.name,
          item.internal_id,
          item.service_group,
          item.service_type,
          item.booking_group,
          item.display_group,
        ].join(" ")
      }
      columns={[
        {
          title: "Tên dịch vụ",
          render: (item) => item.name,
        },
        {
          title: "Loại dịch vụ",
          render: (item) => item.service_type,
        },
        {
          title: "Nhóm dịch vụ",
          render: (item) => item.service_group,
        },
        {
          title: "Loại khám bảo hiểm",
          render: (item) => item.insurance_visit_type,
        },
        {
          title: "Giá dịch vụ",
          render: (item) => formatCurrency(item.service_price),
        },
        {
          title: "Giá gốc",
          render: (item) => formatCurrency(item.base_price),
        },
        {
          title: "Tạm ứng",
          render: (item) => formatCurrency(item.deposit),
        },
        {
          title: "Ghi chú đặt khám",
          render: (item) => item.booking_note,
        },
        {
          title: "Chi tiết",
          render: (item) => item.detail,
        },
        {
          title: "Phòng hướng dẫn vào khám",
          render: (item) => item.guide_room,
        },
        {
          title: "ID nội bộ",
          render: (item) => item.internal_id,
        },
        {
          title: "Nhóm đặt khám",
          render: (item) => item.booking_group,
        },
        {
          title: "Nhóm hiển thị",
          render: (item) => item.display_group,
        },
        {
          title: "Hiển thị giá",
          render: (item) => (item.show_price ? "Có" : "Không"),
        },
        {
          title: "Ưu tiên hiển thị",
          render: (item) => item.display_priority,
        },
      ]}
      renderForm={(form, setForm) => (
        <div className="space-y-5">
          <FieldSection
            title="Thông tin dịch vụ khám"
            description="ID nội bộ dùng để đồng bộ sang chương trình khám bệnh và vẫn giữ nguyên số 0 đầu nếu có."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Tên dịch vụ"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
              <Input
                label="Loại dịch vụ"
                value={form.service_type}
                onChange={(event) => setForm((prev) => ({ ...prev, service_type: event.target.value }))}
              />
              <Input
                label="Nhóm dịch vụ"
                value={form.service_group}
                onChange={(event) => setForm((prev) => ({ ...prev, service_group: event.target.value }))}
              />
              <Input
                label="Loại khám bảo hiểm"
                value={form.insurance_visit_type}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, insurance_visit_type: event.target.value }))
                }
                placeholder="VD: BHYT + Dịch vụ"
              />
              <Input
                label="Giá dịch vụ"
                type="number"
                value={String(form.service_price)}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, service_price: Number(event.target.value) || 0 }))
                }
              />
              <Input
                label="Giá gốc"
                type="number"
                value={String(form.base_price)}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, base_price: Number(event.target.value) || 0 }))
                }
              />
              <Input
                label="Tạm ứng"
                type="number"
                value={String(form.deposit)}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, deposit: Number(event.target.value) || 0 }))
                }
              />
              <Input
                label="Phòng hướng dẫn vào khám"
                value={form.guide_room}
                onChange={(event) => setForm((prev) => ({ ...prev, guide_room: event.target.value }))}
              />
              <Input
                label="ID nội bộ"
                value={form.internal_id}
                onChange={(event) => setForm((prev) => ({ ...prev, internal_id: event.target.value }))}
              />
              <Input
                label="Nhóm đặt khám"
                value={form.booking_group}
                onChange={(event) => setForm((prev) => ({ ...prev, booking_group: event.target.value }))}
              />
              <Input
                label="Nhóm hiển thị"
                value={form.display_group}
                onChange={(event) => setForm((prev) => ({ ...prev, display_group: event.target.value }))}
              />
              <Input
                label="Ưu tiên hiển thị"
                type="number"
                value={String(form.display_priority)}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, display_priority: Number(event.target.value) || 0 }))
                }
              />
            </div>
            <TextareaField
              label="Ghi chú đặt khám"
              value={form.booking_note}
              onChange={(value) => setForm((prev) => ({ ...prev, booking_note: value }))}
            />
            <TextareaField
              label="Chi tiết"
              value={form.detail}
              onChange={(value) => setForm((prev) => ({ ...prev, detail: value }))}
              rows={5}
            />
            <ToggleField
              label="Hiển thị giá"
              checked={form.show_price}
              onChange={(checked) => setForm((prev) => ({ ...prev, show_price: checked }))}
            />
          </FieldSection>
        </div>
      )}
    />
  );
}
