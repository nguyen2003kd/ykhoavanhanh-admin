"use client";

import { FieldSection, HospitalCrudPage, TextareaField } from "@/components/hospital-admin/HospitalCrudPage";
import { Input } from "@/components/ui/Input";
import { useHospitalAdminStore } from "@/hooks/useHospitalAdminStore";
import { ExamArea } from "@/types/hospital-admin";

type AreaForm = {
  name: string;
  description: string;
  address: string;
  internal_id: string;
};

const createInitialForm = (): AreaForm => ({
  name: "",
  description: "",
  address: "",
  internal_id: "",
});

function mapItemToForm(item: ExamArea): AreaForm {
  return {
    name: item.name,
    description: item.description,
    address: item.address,
    internal_id: item.internal_id,
  };
}

export default function ExamAreasPage() {
  const areas = useHospitalAdminStore((state) => state.areas);
  const addArea = useHospitalAdminStore((state) => state.addArea);
  const updateArea = useHospitalAdminStore((state) => state.updateArea);
  const deleteArea = useHospitalAdminStore((state) => state.deleteArea);

  return (
    <HospitalCrudPage
      title="Quản lý khu vực khám bệnh"
      description="Quản lý tên khu vực, mô tả khu khám, địa chỉ và ID nội bộ để các phòng khám bên dưới có thể liên kết đúng."
      itemName="khu vực khám"
      compact
      items={areas}
      createInitialForm={createInitialForm}
      mapItemToForm={mapItemToForm}
      onCreate={addArea}
      onUpdate={updateArea}
      onDelete={deleteArea}
      getSearchText={(item) => [item.id, item.name, item.internal_id, item.address].join(" ")}
      columns={[
        {
          title: "Tên khu vực khám bệnh",
          render: (item) => item.name,
        },
        {
          title: "Mô tả khu khám",
          render: (item) => item.description,
        },
        {
          title: "Địa chỉ",
          render: (item) => item.address,
        },
        {
          title: "ID nội bộ",
          render: (item) => item.internal_id,
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
                label="Tên khu vực khám bệnh"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="VD: Khu khám Chuyên sâu"
              />
              <Input
                label="ID nội bộ"
                value={form.internal_id}
                onChange={(event) => setForm((prev) => ({ ...prev, internal_id: event.target.value }))}
                placeholder="VD: 002"
                hint="Cho phép bắt đầu bằng số 0."
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
