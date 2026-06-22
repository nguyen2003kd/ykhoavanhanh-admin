"use client";

import {
  FieldSection,
  HospitalCrudPage,
} from "@/components/hospital-admin/HospitalCrudPage";
import { Input } from "@/components/ui/Input";
import { doctorsHooks, type HisDoctor } from "@/api/doctorsApi";
import { toast } from "@/components/ui/Toast";

type DoctorForm = {
  doctorid: string;
  doctorname: string;
  description: string;
};

const createInitialForm = (): DoctorForm => ({
  doctorid: "",
  doctorname: "",
  description: "",
});

function mapItemToForm(item: HisDoctor): DoctorForm {
  return {
    doctorid: item.doctorid,
    doctorname: item.doctorname,
    description: item.description ?? "",
  };
}

export default function DoctorsPage() {
  const { data: doctors, isLoading } = doctorsHooks.useList();

  const createMutation = doctorsHooks.useCreate({
    onSuccess: () => toast.success("Tạo bác sĩ thành công"),
    onError: (err) => toast.error(err.message || "Tạo bác sĩ thất bại"),
  });
  const updateMutation = doctorsHooks.useUpdate({
    onSuccess: () => toast.success("Cập nhật bác sĩ thành công"),
    onError: (err) => toast.error(err.message || "Cập nhật bác sĩ thất bại"),
  });
  const deleteMutation = doctorsHooks.useDelete({
    onSuccess: () => toast.success("Xóa bác sĩ thành công"),
    onError: (err) => toast.error(err.message || "Xóa bác sĩ thất bại"),
  });

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <HospitalCrudPage
      title="Quản lý bác sĩ"
      description="Danh sách bác sĩ đồng bộ từ HIS."
      itemName="bác sĩ"
      compact
      isLoading={isLoading}
      isMutating={isMutating}
      items={doctors ?? []}
      createInitialForm={createInitialForm}
      mapItemToForm={mapItemToForm}
      onCreate={(form) => createMutation.mutate(form as Partial<HisDoctor>)}
      onUpdate={(id, form) => updateMutation.mutate({ id, data: form as Partial<HisDoctor> })}
      onDelete={(id) => deleteMutation.mutate(id)}
      getSearchText={(item) =>
        [item.doctorid, item.doctorname, item.description ?? ""].join(" ")
      }
      columns={[
        {
          title: "Mã bác sĩ",
          render: (item) => item.doctorid,
        },
        {
          title: "Tên bác sĩ",
          render: (item) => item.doctorname,
        },
        {
          title: "Mô tả",
          render: (item) => item.description ?? "—",
        },
        {
          title: "Cập nhật lúc",
          render: (item) => item.updatetime,
        },
      ]}
      renderForm={(form, setForm) => (
        <div className="space-y-5">
          <FieldSection title="Thông tin bác sĩ" description="Dữ liệu đồng bộ từ HIS.">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Mã bác sĩ"
                value={form.doctorid}
                onChange={(event) => setForm((prev) => ({ ...prev, doctorid: event.target.value }))}
                placeholder="VD: 0330"
              />
              <Input
                label="Tên bác sĩ"
                value={form.doctorname}
                onChange={(event) => setForm((prev) => ({ ...prev, doctorname: event.target.value }))}
                placeholder="VD: Nguyễn Văn A"
              />
              <Input
                label="Mô tả"
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="VD: Bác sĩ khoa Tim mạch"
              />
            </div>
          </FieldSection>
        </div>
      )}
    />
  );
}
