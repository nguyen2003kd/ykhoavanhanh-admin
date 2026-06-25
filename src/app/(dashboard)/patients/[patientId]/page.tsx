"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { LoadingSection } from "@/components/ui/Spinner";
import { useGetPatientById } from "@/api/patientApi";

function getFullName(p: { patientfirstname: string | null; patientlastname: string | null }): string {
  return [p.patientfirstname, p.patientlastname].filter(Boolean).join(" ") || "—";
}

function getGender(sex: string | null): string {
  if (!sex) return "—";
  return sex.toLowerCase() === "nam" ? "Nam" : sex.toLowerCase() === "nữ" || sex.toLowerCase() === "nu" ? "Nữ" : sex;
}

export default function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const router = useRouter();
  const { data: patient, isLoading } = useGetPatientById(patientId);

  if (isLoading) {
    return <LoadingSection text="Đang tải thông tin bệnh nhân..." />;
  }

  if (!patient) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Không tìm thấy bệnh nhân.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  const fullName = getFullName(patient);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>← Quay lại</Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
            <p className="text-sm text-gray-500 font-mono">{patient.patientid}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/patients/${patientId}/edit`}>
            <Button variant="outline" size="sm">Chỉnh sửa</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Thông tin cơ bản */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Thông tin cá nhân</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Mã bệnh nhân:</span> <span className="font-medium ml-2 font-mono">{patient.patientid}</span></div>
              <div><span className="text-gray-500">Họ tên:</span> <span className="font-medium ml-2">{fullName}</span></div>
              <div><span className="text-gray-500">Ngày sinh:</span> <span className="font-medium ml-2">{patient.patientbirthday || patient.patientbirthyear || "—"}</span></div>
              <div><span className="text-gray-500">Giới tính:</span> <span className="font-medium ml-2">{getGender(patient.patientsex)}</span></div>
              <div><span className="text-gray-500">Điện thoại:</span> <span className="font-medium ml-2">{patient.patientphonenumber ?? "—"}</span></div>
              <div><span className="text-gray-500">Số CCCD:</span> <span className="font-medium ml-2">{patient.identifynumber ?? "—"}</span></div>
              <div><span className="text-gray-500">Mã BHYT:</span> <span className="font-medium ml-2">{patient.insurancenumber ?? "—"}</span></div>
              <div><span className="text-gray-500">Dân tộc:</span> <span className="font-medium ml-2">{patient.patientethnicnname ?? patient.patientethnic ?? "—"}</span></div>
              <div><span className="text-gray-500">Nghề nghiệp:</span> <span className="font-medium ml-2">{patient.professionname ?? patient.professionid ?? "—"}</span></div>
              <div className="col-span-2"><span className="text-gray-500">Địa chỉ:</span> <span className="font-medium ml-2">{patient.addressfull ?? ([patient.addressdetail, patient.addressstreet, patient.addresswardname, patient.addresscityname, patient.addressprovincename].filter(Boolean).join(", ") || "—")}</span></div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <Avatar name={fullName} size="lg" className="mx-auto mb-3" />
              <p className="font-semibold text-gray-900">{fullName}</p>
              <p className="text-sm text-gray-500 font-mono">{patient.patientid}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Thông tin khác</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="flex justify-between"><span className="text-gray-500">Quốc tịch</span><span className="font-medium">{patient.patientnational ?? "—"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">BHYT hết hạn</span><span className="font-medium">{patient.insuranceexpireddate ?? "—"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Cập nhật lúc</span><span className="font-medium">{patient.updatetime ?? "—"}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
