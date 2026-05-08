"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { mockMedicalRecords } from "@/mock-data/medical-records";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function MedicalRecordDetailPage() {
  const { recordId } = useParams<{ recordId: string }>();
  const router = useRouter();
  const record = mockMedicalRecords.find((r) => r.id === recordId);

  if (!record) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Không tìm thấy hồ sơ bệnh án.</p>
      <Button variant="outline" className="mt-4" onClick={() => router.back()}>Quay lại</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
        <h1 className="text-2xl font-bold text-gray-900">Hồ sơ bệnh án</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>Thông tin khám</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Bệnh nhân:</span> <span className="font-medium ml-2">{record.patientName}</span></div>
          <div><span className="text-gray-500">Bác sĩ:</span> <span className="font-medium ml-2">{record.doctorName}</span></div>
          <div><span className="text-gray-500">Ngày khám:</span> <span className="font-medium ml-2">{formatDate(record.visitDate)}</span></div>
          {record.note && <div className="col-span-2"><span className="text-gray-500">Ghi chú:</span> <span className="font-medium ml-2">{record.note}</span></div>}
          <div className="col-span-2"><span className="text-gray-500">Chẩn đoán:</span> <span className="font-semibold ml-2 text-primary-700">{record.diagnosis}</span></div>
          {record.prescription && <div className="col-span-2"><span className="text-gray-500">Phác đồ điều trị:</span> <p className="mt-1 text-gray-700 leading-relaxed">{record.prescription}</p></div>}
        </CardContent>
      </Card>

      {record.testResults && record.testResults.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Kết quả xét nghiệm</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-600">Xét nghiệm</th>
                  <th className="text-left py-2 text-gray-600">Kết quả</th>
                  <th className="text-left py-2 text-gray-600">Mức bình thường</th>
                  <th className="text-left py-2 text-gray-600">Đơn vị</th>
                  <th className="text-left py-2 text-gray-600">Đánh giá</th>
                </tr>
              </thead>
              <tbody>
                {record.testResults.map((t) => (
                  <tr key={t.id} className="border-b">
                    <td className="py-2">{t.name}</td>
                    <td className="py-2 font-semibold">{t.value}</td>
                    <td className="py-2 text-gray-500">{t.referenceRange}</td>
                    <td className="py-2 text-gray-500">{t.unit}</td>
                    <td className="py-2"><Badge variant={t.isAbnormal ? "danger" : "success"}>{t.isAbnormal ? "Bất thường" : "Bình thường"}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Chi phí</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b"><th className="text-left py-2 text-gray-600">Dịch vụ</th><th className="text-right py-2 text-gray-600">Số lượng</th><th className="text-right py-2 text-gray-600">Đơn giá</th><th className="text-right py-2 text-gray-600">Thành tiền</th></tr>
            </thead>
            <tbody>
              {record.invoiceItems?.map((item) => (
                <tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-right">{item.quantity}</td><td className="py-2 text-right">{formatCurrency(item.unitPrice)}</td><td className="py-2 text-right font-medium">{formatCurrency(item.total)}</td></tr>
              ))}
            </tbody>
            <tfoot><tr><td colSpan={3} className="py-2 text-right font-semibold">Tổng cộng:</td><td className="py-2 text-right font-bold text-primary-700">{formatCurrency(record.totalCost ?? 0)}</td></tr></tfoot>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
