import { MedicalRecord } from "@/types/medical-record";

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: "mr001",
    patientId: "p001",
    patientName: "Nguyễn Thị Lan",
    doctorId: "d001",
    doctorName: "BS. Trần Văn An",
    specialtyName: "Nội khoa",
    visitDate: "2024-07-10",
    diagnosis: "Tăng huyết áp độ II, không rõ nguyên nhân",
    prescription: "Amlodipine 5mg uống 1 viên/ngày buổi tối. Theo dõi huyết áp mỗi sáng.",
    note: "Bệnh nhân cần tái khám sau 4 tuần.",
    testResults: [
      { id: "t001", name: "Xét nghiệm máu tổng quát", value: "Bình thường", referenceRange: "WBC 4.5-11", unit: "K/μL", isAbnormal: false, recordedAt: "2024-07-10T09:00:00Z" },
      { id: "t002", name: "Cholesterol toàn phần", value: "6.2", referenceRange: "<5.2", unit: "mmol/L", isAbnormal: true, recordedAt: "2024-07-10T09:00:00Z" },
    ],
    invoiceItems: [
      { id: "inv001", name: "Phí khám bệnh", quantity: 1, unitPrice: 200000, total: 200000 },
      { id: "inv002", name: "Xét nghiệm máu", quantity: 1, unitPrice: 150000, total: 150000 },
    ],
    totalCost: 350000,
    attachments: [],
    createdAt: "2024-07-10T09:30:00Z",
    updatedAt: "2024-07-10T09:30:00Z",
  },
];
