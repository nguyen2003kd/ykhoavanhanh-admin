"use client";

import { FieldSection, HospitalCrudPage, TextareaField } from "@/components/hospital-admin/HospitalCrudPage";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useHospitalAdminStore } from "@/hooks/useHospitalAdminStore";
import { getAreaDescription, getAreaName } from "@/lib/hospital-admin";
import { Clinic } from "@/types/hospital-admin";

type ClinicFeeForm = {
  specialty_id: string;
  fee: number;
};

type ClinicForm = {
  name: string;
  clinic_type: string;
  guide_room: string;
  booking_note: string;
  area_id: string;
  internal_id: string;
  specialty_fees: ClinicFeeForm[];
};

const createInitialForm = (): ClinicForm => ({
  name: "",
  clinic_type: "",
  guide_room: "",
  booking_note: "",
  area_id: "",
  internal_id: "",
  specialty_fees: [{ specialty_id: "", fee: 0 }],
});

function mapItemToForm(item: Clinic): ClinicForm {
  return {
    name: item.name,
    clinic_type: item.clinic_type,
    guide_room: item.guide_room,
    booking_note: item.booking_note,
    area_id: item.area_id,
    internal_id: item.internal_id,
    specialty_fees: item.specialty_fees.map((fee) => ({ ...fee })),
  };
}

export default function ClinicsPage() {
  const clinics = useHospitalAdminStore((state) => state.clinics);
  const areas = useHospitalAdminStore((state) => state.areas);
  const specialties = useHospitalAdminStore((state) => state.specialties);
  const addClinic = useHospitalAdminStore((state) => state.addClinic);
  const updateClinic = useHospitalAdminStore((state) => state.updateClinic);
  const deleteClinic = useHospitalAdminStore((state) => state.deleteClinic);

  return (
    <HospitalCrudPage
      title="Quản lý phòng khám"
      description="Mỗi khu khám có danh sách phòng khám riêng. Phòng khám nhận dữ liệu khu khám từ module khu vực và lưu công khám theo từng khoa."
      itemName="phòng khám"
      compact
      items={clinics}
      createInitialForm={createInitialForm}
      mapItemToForm={mapItemToForm}
      onCreate={addClinic}
      onUpdate={updateClinic}
      onDelete={deleteClinic}
      getSearchText={(item) =>
        [
          item.id,
          item.name,
          item.internal_id,
          item.clinic_type,
          getAreaName(areas, item.area_id),
          getAreaDescription(areas, item.area_id),
        ].join(" ")
      }
      columns={[
        {
          title: "Tên phòng khám",
          render: (item) => item.name,
        },
        {
          title: "Loại phòng khám",
          render: (item) => item.clinic_type,
        },
        {
          title: "Hướng dẫn vào khám",
          render: (item) => item.guide_room,
        },
        {
          title: "Ghi chú đặt khám",
          render: (item) => item.booking_note,
        },
        {
          title: "Khu khám bệnh",
          render: (item) => getAreaName(areas, item.area_id),
        },
        {
          title: "Mô tả khu khám",
          render: (item) => getAreaDescription(areas, item.area_id),
        },
        {
          title: "ID nội bộ",
          render: (item) => item.internal_id,
        },
      ]}
      renderForm={(form, setForm) => (
        <div className="space-y-5">
          <FieldSection
            title="Thông tin phòng khám"
            description="Phòng khám lấy dữ liệu khu khám từ module khu vực và có thể lưu nhiều mức công khám theo từng khoa."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Tên phòng khám"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="VD: Phòng khám Nội 01"
              />
              <Input
                label="Loại phòng khám"
                value={form.clinic_type}
                onChange={(event) => setForm((prev) => ({ ...prev, clinic_type: event.target.value }))}
                placeholder="VD: Khám thường"
              />
              <Select
                label="Khu khám bệnh"
                value={form.area_id}
                onChange={(event) => setForm((prev) => ({ ...prev, area_id: event.target.value }))}
                options={areas.map((area) => ({ value: area.id, label: area.name }))}
                placeholder="Chọn khu khám"
              />
              <Input
                label="ID nội bộ"
                value={form.internal_id}
                onChange={(event) => setForm((prev) => ({ ...prev, internal_id: event.target.value }))}
                placeholder="VD: 0101"
                hint="Cho phép bắt đầu bằng số 0."
              />
              <Input
                label="Hướng dẫn vào khám"
                value={form.guide_room}
                onChange={(event) => setForm((prev) => ({ ...prev, guide_room: event.target.value }))}
                placeholder="Vị trí quầy/phòng"
              />
            </div>
            <TextareaField
              label="Ghi chú đặt khám"
              value={form.booking_note}
              onChange={(value) => setForm((prev) => ({ ...prev, booking_note: value }))}
            />
          </FieldSection>

          <FieldSection
            title="Công khám theo khoa"
            description="Mỗi phòng khám có thể thiết lập giá công khám khác nhau theo từng chuyên khoa."
          >
            <div className="space-y-3">
              {form.specialty_fees.map((fee, index) => (
                <div key={`${index}-${fee.specialty_id}`} className="grid gap-3 rounded-lg border border-gray-200 bg-white p-3 md:grid-cols-[2fr_1fr_auto]">
                  <Select
                    label="Chuyên khoa"
                    value={fee.specialty_id}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        specialty_fees: prev.specialty_fees.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, specialty_id: event.target.value } : entry
                        ),
                      }))
                    }
                    options={specialties.map((specialty) => ({
                      value: specialty.id,
                      label: specialty.name,
                    }))}
                    placeholder="Chọn chuyên khoa"
                  />
                  <Input
                    label="Công khám"
                    type="number"
                    value={String(fee.fee)}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        specialty_fees: prev.specialty_fees.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, fee: Number(event.target.value) || 0 } : entry
                        ),
                      }))
                    }
                  />
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          specialty_fees:
                            prev.specialty_fees.length === 1
                              ? prev.specialty_fees
                              : prev.specialty_fees.filter((_, entryIndex) => entryIndex !== index),
                        }))
                      }
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Xóa dòng
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    specialty_fees: [...prev.specialty_fees, { specialty_id: "", fee: 0 }],
                  }))
                }
                className="rounded-lg border border-dashed border-primary-300 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50"
              >
                Thêm công khám theo khoa
              </button>
            </div>
          </FieldSection>
        </div>
      )}
    />
  );
}
