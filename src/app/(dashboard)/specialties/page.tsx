"use client";

import { FieldSection, HospitalCrudPage, TextareaField, ToggleField } from "@/components/hospital-admin/HospitalCrudPage";
import { Input } from "@/components/ui/Input";
import { useHospitalAdminStore } from "@/hooks/useHospitalAdminStore";
import { AdminSpecialty } from "@/types/hospital-admin";

type SpecialtyForm = {
  name: string;
  guide_room: string;
  booking_note: string;
  internal_id: string;
  booking_group: string;
  display_priority: number;
  hide_search: boolean;
};

const createInitialForm = (): SpecialtyForm => ({
  name: "",
  guide_room: "",
  booking_note: "",
  internal_id: "",
  booking_group: "",
  display_priority: 1,
  hide_search: false,
});

function mapItemToForm(item: AdminSpecialty): SpecialtyForm {
  return {
    name: item.name,
    guide_room: item.guide_room,
    booking_note: item.booking_note,
    internal_id: item.internal_id,
    booking_group: item.booking_group,
    display_priority: item.display_priority,
    hide_search: item.hide_search,
  };
}

export default function SpecialtiesPage() {
  const specialties = useHospitalAdminStore((state) => state.specialties);
  const addSpecialty = useHospitalAdminStore((state) => state.addSpecialty);
  const updateSpecialty = useHospitalAdminStore((state) => state.updateSpecialty);
  const deleteSpecialty = useHospitalAdminStore((state) => state.deleteSpecialty);

  return (
    <HospitalCrudPage
      title="Quản lý chuyên khoa"
      description="Quản lý danh mục chuyên khoa dùng để mở lịch khám, gắn phòng hướng dẫn và đồng bộ ID nội bộ sang hệ thống khám bệnh."
      itemName="chuyên khoa"
      compact
      items={specialties}
      createInitialForm={createInitialForm}
      mapItemToForm={mapItemToForm}
      onCreate={addSpecialty}
      onUpdate={updateSpecialty}
      onDelete={deleteSpecialty}
      getSearchText={(item) =>
        [item.id, item.name, item.internal_id, item.booking_group, item.guide_room].join(" ")
      }
      columns={[
        {
          title: "Tên chuyên khoa",
          render: (item) => item.name,
        },
        {
          title: "Phòng hướng dẫn vào khám",
          render: (item) => item.guide_room,
        },
        {
          title: "Ghi chú đặt khám",
          render: (item) => item.booking_note,
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
          title: "Ưu tiên hiển thị",
          render: (item) => item.display_priority,
        },
        {
          title: "Ẩn tìm kiếm",
          render: (item) => (item.hide_search ? "Có" : "Không"),
        },
      ]}
      renderForm={(form, setForm) => (
        <div className="space-y-5">
          <FieldSection
            title="Thông tin chuyên khoa"
            description="ID nội bộ là chuỗi để giữ nguyên các số 0 đầu khi đồng bộ sang HIS."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Tên chuyên khoa"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="VD: Nội khoa"
              />
              <Input
                label="Phòng hướng dẫn vào khám"
                value={form.guide_room}
                onChange={(event) => setForm((prev) => ({ ...prev, guide_room: event.target.value }))}
                placeholder="VD: PK Nội 01"
              />
              <Input
                label="ID nội bộ"
                value={form.internal_id}
                onChange={(event) => setForm((prev) => ({ ...prev, internal_id: event.target.value }))}
                placeholder="VD: 001"
                hint="Cho phép bắt đầu bằng số 0."
              />
              <Input
                label="Nhóm đặt khám"
                value={form.booking_group}
                onChange={(event) => setForm((prev) => ({ ...prev, booking_group: event.target.value }))}
                placeholder="VD: noi-tong-quat"
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
              placeholder="Nhập lưu ý khi bệnh nhân đặt khám"
            />
            <ToggleField
              label="Ẩn tìm kiếm"
              checked={form.hide_search}
              onChange={(checked) => setForm((prev) => ({ ...prev, hide_search: checked }))}
              description="Bật nếu chuyên khoa chỉ dùng nội bộ hoặc chưa muốn hiển thị cho người dùng."
            />
          </FieldSection>
        </div>
      )}
    />
  );
}
