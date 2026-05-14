"use client";

import {
  FieldSection,
  HospitalCrudPage,
  TextareaField,
  ToggleField,
} from "@/components/hospital-admin/HospitalCrudPage";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useHospitalAdminStore } from "@/hooks/useHospitalAdminStore";
import { accountStatusLabels } from "@/lib/hospital-admin";
import { Doctor } from "@/types/hospital-admin";

type DoctorForm = {
  name: string;
  title: string;
  phone: string;
  email: string;
  gender: "male" | "female" | "other";
  date_of_birth: string;
  booking_note: string;
  internal_id: string;
  account_status: "active" | "inactive" | "on_leave";
  booking_group: string;
  display_group: string;
  show_price: boolean;
  display_priority: number;
};

const createInitialForm = (): DoctorForm => ({
  name: "",
  title: "",
  phone: "",
  email: "",
  gender: "male",
  date_of_birth: "",
  booking_note: "",
  internal_id: "",
  account_status: "active",
  booking_group: "",
  display_group: "",
  show_price: true,
  display_priority: 1,
});

function mapItemToForm(item: Doctor): DoctorForm {
  return {
    name: item.name,
    title: item.title,
    phone: item.phone,
    email: item.email,
    gender: item.gender,
    date_of_birth: item.date_of_birth,
    booking_note: item.booking_note,
    internal_id: item.internal_id,
    account_status: item.account_status,
    booking_group: item.booking_group,
    display_group: item.display_group,
    show_price: item.show_price,
    display_priority: item.display_priority,
  };
}

export default function DoctorsPage() {
  const doctors = useHospitalAdminStore((state) => state.doctors);
  const addDoctor = useHospitalAdminStore((state) => state.addDoctor);
  const updateDoctor = useHospitalAdminStore((state) => state.updateDoctor);
  const deleteDoctor = useHospitalAdminStore((state) => state.deleteDoctor);

  return (
    <HospitalCrudPage
      title="Quản lý bác sĩ"
      description="Bác sĩ có thể ngồi nhiều phòng khám, khu khám khác nhau theo lịch. ID nội bộ được giữ dạng chuỗi để đồng bộ sang chương trình khám bệnh."
      itemName="bác sĩ"
      compact
      items={doctors}
      createInitialForm={createInitialForm}
      mapItemToForm={mapItemToForm}
      onCreate={addDoctor}
      onUpdate={updateDoctor}
      onDelete={deleteDoctor}
      getSearchText={(item) =>
        [item.id, item.name, item.internal_id, item.phone, item.email, item.booking_group, item.display_group].join(" ")
      }
      columns={[
        {
          title: "Tên bác sĩ",
          render: (item) => item.name,
        },
        {
          title: "Chức danh",
          render: (item) => item.title,
        },
        {
          title: "Điện thoại",
          render: (item) => item.phone,
        },
        {
          title: "Email",
          render: (item) => item.email,
        },
        {
          title: "Giới tính",
          render: (item) => (item.gender === "male" ? "Nam" : item.gender === "female" ? "Nữ" : "Khác"),
        },
        {
          title: "Ngày sinh",
          render: (item) => item.date_of_birth,
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
          title: "Trạng thái tài khoản",
          render: (item) => accountStatusLabels[item.account_status],
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
            title="Thông tin bác sĩ"
            description="Bác sĩ có thể được điều sang phòng khám hoặc khu khám khác nhau tùy theo lịch làm việc."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Tên bác sĩ"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="VD: BS. Trần Văn An"
              />
              <Input
                label="Chức danh"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="VD: Tiến sĩ, Bác sĩ CKI"
              />
              <Input
                label="Điện thoại"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
              <Input
                label="Email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
              <Select
                label="Giới tính"
                value={form.gender}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    gender: event.target.value as DoctorForm["gender"],
                  }))
                }
                options={[
                  { value: "male", label: "Nam" },
                  { value: "female", label: "Nữ" },
                  { value: "other", label: "Khác" },
                ]}
              />
              <Input
                label="Ngày sinh"
                type="date"
                value={form.date_of_birth}
                onChange={(event) => setForm((prev) => ({ ...prev, date_of_birth: event.target.value }))}
              />
              <Input
                label="ID nội bộ"
                value={form.internal_id}
                onChange={(event) => setForm((prev) => ({ ...prev, internal_id: event.target.value }))}
                hint="Giữ nguyên số 0 đầu khi cần đồng bộ HIS."
              />
              <Select
                label="Trạng thái tài khoản"
                value={form.account_status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    account_status: event.target.value as DoctorForm["account_status"],
                  }))
                }
                options={[
                  { value: "active", label: "Hoạt động" },
                  { value: "inactive", label: "Ngừng sử dụng" },
                  { value: "on_leave", label: "Nghỉ đột xuất" },
                ]}
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
            <ToggleField
              label="Hiển thị giá"
              checked={form.show_price}
              onChange={(checked) => setForm((prev) => ({ ...prev, show_price: checked }))}
              description="Tắt nếu bác sĩ thuộc nhóm không công khai giá trên app."
            />
          </FieldSection>
        </div>
      )}
    />
  );
}
