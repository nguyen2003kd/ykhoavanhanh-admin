"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/ToastProvider";
import { useHospitalAdminStore } from "@/hooks/useHospitalAdminStore";
import {
  getClinicName,
  getDoctorName,
  getServiceName,
  getSpecialtyName,
  getSyncVariant,
  getTicketStatusVariant,
  ticketStatusLabels,
} from "@/lib/hospital-admin";
import { formatDateTime } from "@/lib/utils";

export default function OperationsPage() {
  const toast = useToast();
  const tickets = useHospitalAdminStore((state) => state.tickets);
  const syncJobs = useHospitalAdminStore((state) => state.syncJobs);
  const clinics = useHospitalAdminStore((state) => state.clinics);
  const doctors = useHospitalAdminStore((state) => state.doctors);
  const specialties = useHospitalAdminStore((state) => state.specialties);
  const services = useHospitalAdminStore((state) => state.services);
  const syncTicketPatientCode = useHospitalAdminStore((state) => state.syncTicketPatientCode);
  const reassignTicket = useHospitalAdminStore((state) => state.reassignTicket);
  const refundTicket = useHospitalAdminStore((state) => state.refundTicket);
  const cancelTicket = useHospitalAdminStore((state) => state.cancelTicket);
  const runNightSyncNow = useHospitalAdminStore((state) => state.runNightSyncNow);

  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id ?? "");
  const [patientCode, setPatientCode] = useState("");
  const [reassignClinicId, setReassignClinicId] = useState("");
  const [reassignDoctorId, setReassignDoctorId] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [modalType, setModalType] = useState<"refund" | "cancel" | null>(null);

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId) ?? tickets[0];

  const refundedOrCancelledTickets = useMemo(
    () => tickets.filter((ticket) => ticket.status === "refunded" || ticket.status === "cancelled"),
    [tickets]
  );

  const handleSyncPatientCode = () => {
    if (!selectedTicket || !patientCode.trim()) {
      toast.warning("Thiếu dữ liệu", "Chọn phiếu và nhập mã BN cần đồng bộ.");
      return;
    }
    syncTicketPatientCode(selectedTicket.id, patientCode.trim());
    toast.success("Đồng bộ thành công", "Đã cập nhật lại mã BN từ App sang HIS.");
    setPatientCode("");
  };

  const handleReassign = () => {
    if (!selectedTicket || !reassignClinicId || !reassignDoctorId) {
      toast.warning("Thiếu dữ liệu", "Cần chọn phiếu, phòng khám và bác sĩ mới.");
      return;
    }
    reassignTicket(selectedTicket.id, reassignClinicId, reassignDoctorId);
    toast.success("Cập nhật thành công", "Đã đổi phòng khám và bác sĩ cho phiếu đã chọn.");
  };

  const submitTicketAction = () => {
    if (!selectedTicket || !modalType || !actionReason.trim()) {
      toast.warning("Thiếu dữ liệu", "Vui lòng nhập lý do xử lý phiếu.");
      return;
    }

    const result =
      modalType === "refund"
        ? refundTicket(selectedTicket.id, actionReason.trim())
        : cancelTicket(selectedTicket.id, actionReason.trim());

    if (result.ok) {
      toast.success("Thao tác thành công", result.message);
      setModalType(null);
      setActionReason("");
    } else {
      toast.error("Không thể thực hiện", result.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Công cụ vận hành khám bệnh</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý đồng bộ HIS, cập nhật lại mã BN, đổi phòng khám hoặc bác sĩ, hoàn/hủy phiếu và theo dõi báo cáo hoàn hủy.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Phiếu chờ đồng bộ HIS</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {tickets.filter((ticket) => ticket.his_sync_status === "pending").length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Phiếu hoàn/hủy</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{refundedOrCancelledTickets.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Phiếu đăng ký 2 phòng</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {tickets.filter((ticket) => ticket.booked_clinic_ids.length > 1).length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Đồng bộ 23h</p>
          <p className="mt-2 text-lg font-bold text-gray-900">{syncJobs[0]?.next_run_at ?? "Chưa cấu hình"}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Phiếu khám và thao tác admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Chọn phiếu khám"
              value={selectedTicketId}
              onChange={(event) => {
                setSelectedTicketId(event.target.value);
                setPatientCode("");
                setReassignClinicId("");
                setReassignDoctorId("");
              }}
              options={tickets.map((ticket) => ({
                value: ticket.id,
                label: `${ticket.ticket_number} - ${ticket.patient_name}`,
              }))}
            />

            {selectedTicket && (
              <div className="grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 lg:grid-cols-2">
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Bệnh nhân:</span> {selectedTicket.patient_name}</p>
                  <p><span className="font-medium">Mã BN:</span> {selectedTicket.patient_code}</p>
                  <p><span className="font-medium">Mã App:</span> {selectedTicket.app_patient_code}</p>
                  <p><span className="font-medium">Chuyên khoa:</span> {getSpecialtyName(specialties, selectedTicket.specialty_id)}</p>
                  <p><span className="font-medium">Phòng khám:</span> {getClinicName(clinics, selectedTicket.clinic_id)}</p>
                  <p><span className="font-medium">Bác sĩ:</span> {getDoctorName(doctors, selectedTicket.doctor_id)}</p>
                  <p><span className="font-medium">Dịch vụ:</span> {getServiceName(services, selectedTicket.service_id)}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getTicketStatusVariant(selectedTicket.status)}>
                      {ticketStatusLabels[selectedTicket.status]}
                    </Badge>
                    <Badge variant={getSyncVariant(selectedTicket)}>
                      HIS: {selectedTicket.his_sync_status}
                    </Badge>
                  </div>
                  <p><span className="font-medium">Ngày khám:</span> {selectedTicket.exam_date}</p>
                  <p><span className="font-medium">Nhóm đặt khám:</span> {selectedTicket.booking_group}</p>
                  <p><span className="font-medium">Nguồn:</span> {selectedTicket.source}</p>
                  <p><span className="font-medium">Đăng ký nhiều phòng:</span> {selectedTicket.booked_clinic_ids.length} phòng</p>
                  <p className="text-gray-500">{selectedTicket.note}</p>
                </div>
              </div>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Đồng bộ lại mã BN từ App sang HIS</h3>
                <Input
                  label="Mã BN mới"
                  value={patientCode}
                  onChange={(event) => setPatientCode(event.target.value)}
                  placeholder="VD: BN000999"
                />
                <Button variant="primary" onClick={handleSyncPatientCode}>
                  Cập nhật mã BN
                </Button>
              </div>

              <div className="rounded-xl border border-gray-200 p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Cập nhật lại phòng khám / bác sĩ</h3>
                <Select
                  label="Phòng khám mới"
                  value={reassignClinicId}
                  onChange={(event) => setReassignClinicId(event.target.value)}
                  options={clinics.map((clinic) => ({ value: clinic.id, label: clinic.name }))}
                  placeholder="Chọn phòng khám"
                />
                <Select
                  label="Bác sĩ mới"
                  value={reassignDoctorId}
                  onChange={(event) => setReassignDoctorId(event.target.value)}
                  options={doctors.map((doctor) => ({ value: doctor.id, label: doctor.name }))}
                  placeholder="Chọn bác sĩ"
                />
                <Button variant="primary" onClick={handleReassign}>
                  Cập nhật đăng ký
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Hoàn / hủy phiếu</h3>
              <p className="text-sm text-gray-500">
                Hệ thống sẽ chặn nếu đây là phòng khám đầu của trường hợp đăng ký 2 phòng khám để tránh sai logic khuyến mãi giảm 50%.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => setModalType("cancel")}>
                  Hủy phiếu
                </Button>
                <Button variant="danger" onClick={() => setModalType("refund")}>
                  Hoàn phiếu
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo hoàn / hủy phiếu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {refundedOrCancelledTickets.map((ticket) => (
                  <div key={ticket.id} className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{ticket.ticket_number}</p>
                        <p className="text-sm text-gray-500">{ticket.patient_name}</p>
                      </div>
                      <Badge variant={getTicketStatusVariant(ticket.status)}>
                        {ticketStatusLabels[ticket.status]}
                      </Badge>
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      <p>Lý do: {ticket.refund_reason || ticket.cancel_reason || "Chưa ghi nhận"}</p>
                      <p>Ngày cập nhật: {formatDateTime(ticket.updated_at)}</p>
                      <p>Người cập nhật: {ticket.updated_by}</p>
                    </div>
                  </div>
                ))}
                {refundedOrCancelledTickets.length === 0 && (
                  <p className="text-sm text-gray-500">Chưa có phiếu hoàn hoặc hủy cần báo cáo.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Đồng bộ phiếu khám 23h</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {syncJobs.map((job) => (
                <div key={job.id} className="rounded-xl border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">{job.name}</p>
                  <p className="mt-1 text-sm text-gray-500">Giờ chạy: {job.run_time}</p>
                  <p className="text-sm text-gray-500">Lần chạy gần nhất: {job.last_run_at ?? "Chưa có"}</p>
                  <p className="text-sm text-gray-500">Lần chạy tiếp theo: {job.next_run_at}</p>
                </div>
              ))}
              <Button
                variant="primary"
                onClick={() => {
                  runNightSyncNow();
                  toast.success("Đã chạy đồng bộ 23h", "Các phiếu chờ đồng bộ đã được đẩy sang trạng thái synced.");
                }}
              >
                Chạy đồng bộ ngay
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={modalType !== null}
        onClose={() => {
          setModalType(null);
          setActionReason("");
        }}
        title={modalType === "refund" ? "Hoàn phiếu khám" : "Hủy phiếu khám"}
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setModalType(null);
                setActionReason("");
              }}
            >
              Hủy
            </Button>
            <Button variant={modalType === "refund" ? "danger" : "primary"} onClick={submitTicketAction}>
              Xác nhận
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Ghi nhận lý do để hệ thống lưu lại lịch sử thao tác và phục vụ báo cáo cho kế toán.
          </p>
          <Input
            label="Lý do xử lý"
            value={actionReason}
            onChange={(event) => setActionReason(event.target.value)}
            placeholder="VD: Bác sĩ nghỉ đột xuất"
          />
        </div>
      </Modal>
    </div>
  );
}
