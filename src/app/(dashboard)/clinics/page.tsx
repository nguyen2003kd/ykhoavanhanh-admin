"use client";

import { FieldSection, HospitalCrudPage } from "@/components/hospital-admin/HospitalCrudPage";
import { Input } from "@/components/ui/Input";
import { roomsHooks, type HisRoom } from "@/api/roomsApi";
import { toast } from "@/components/ui/Toast";

type RoomForm = {
  roomid: string;
  roomname: string;
  description: string;
  mavp: string;
};

const createInitialForm = (): RoomForm => ({
  roomid: "",
  roomname: "",
  description: "",
  mavp: "",
});

function mapItemToForm(item: HisRoom): RoomForm {
  return {
    roomid: item.roomid,
    roomname: item.roomname,
    description: item.description ?? "",
    mavp: item.mavp,
  };
}

export default function ClinicsPage() {
  const { data: rooms, isLoading } = roomsHooks.useList();

  return (
    <HospitalCrudPage
      title="Quản lý phòng khám"
      description="Danh sách phòng khám đồng bộ từ HIS."
      itemName="phòng khám"
      compact
      isLoading={isLoading}
      items={rooms ?? []}
      createInitialForm={createInitialForm}
      mapItemToForm={mapItemToForm}
      onCreate={() => {
        toast.info("Chưa hỗ trợ tạo phòng khám từ HIS API");
      }}
      onUpdate={() => {
        toast.info("Chưa hỗ trợ cập nhật phòng khám từ HIS API");
      }}
      onDelete={() => {
        toast.info("Chưa hỗ trợ xóa phòng khám từ HIS API");
      }}
      getSearchText={(item) =>
        [item.roomid, item.roomname, item.description ?? "", item.mavp].join(" ")
      }
      columns={[
        {
          title: "Mã phòng",
          render: (item) => item.roomid,
        },
        {
          title: "Tên phòng khám",
          render: (item) => item.roomname,
        },
        {
          title: "Mô tả",
          render: (item) => item.description ?? "—",
        },
        {
          title: "Mã VP",
          render: (item) => item.mavp,
        },
        {
          title: "Cập nhật lúc",
          render: (item) => item.updatetime,
        },
      ]}
      renderForm={(form, setForm) => (
        <div className="space-y-5">
          <FieldSection title="Thông tin phòng khám" description="Dữ liệu đồng bộ từ HIS.">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Mã phòng"
                value={form.roomid}
                onChange={(event) => setForm((prev) => ({ ...prev, roomid: event.target.value }))}
                placeholder="VD: 024"
              />
              <Input
                label="Tên phòng khám"
                value={form.roomname}
                onChange={(event) => setForm((prev) => ({ ...prev, roomname: event.target.value }))}
                placeholder="VD: BV -P402 KHU B NỘI TIÊU HÓA"
              />
              <Input
                label="Mô tả"
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
              <Input
                label="Mã VP"
                value={form.mavp}
                onChange={(event) => setForm((prev) => ({ ...prev, mavp: event.target.value }))}
                placeholder="VD: 16852"
              />
            </div>
          </FieldSection>
        </div>
      )}
    />
  );
}
