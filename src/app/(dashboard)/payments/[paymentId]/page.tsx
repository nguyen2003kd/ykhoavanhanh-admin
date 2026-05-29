"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockPayments } from "@/mock-data/payments";
import { Payment } from "@/types/payment";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  User, FileText, Calendar, Receipt, ArrowLeft,
  CheckCircle, Clock, XCircle, RefreshCw, Banknote
} from "lucide-react";

const statusLabels: Record<Payment["status"], string> = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  failed: "Thất bại",
  refunded: "Đã hoàn tiền",
  expired: "Hết hạn",
};
const statusVariant: Record<Payment["status"], "warning" | "success" | "danger" | "info" | "default"> = {
  pending: "warning",
  paid: "success",
  failed: "danger",
  refunded: "info",
  expired: "default",
};
const statusIcon: Record<Payment["status"], React.ElementType> = {
  pending: Clock,
  paid: CheckCircle,
  failed: XCircle,
  refunded: RefreshCw,
  expired: XCircle,
};
const methodLabels: Record<Payment["method"], string> = {
  vcb_qr: "QR Code VietcomBank",
  vcb_transfer: "Chuyển khoản VietcomBank",
  vcb_card: "Thẻ VietcomBank",
  cash: "Tiền mặt",
};

export default function PaymentDetailPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = use(params);
  const router = useRouter();

  const payment = mockPayments.find((p) => p.id === paymentId);

  if (!payment) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Không tìm thấy giao dịch.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  const StatusIcon = statusIcon[payment.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Quay lại
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 font-mono">{payment.code}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Chi tiết giao dịch thanh toán</p>
        </div>
        <Badge variant={statusVariant[payment.status]} className="text-sm px-3 py-1">
          <StatusIcon className="h-4 w-4 mr-1.5 inline" />
          {statusLabels[payment.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main info */}
        <div className="col-span-2 space-y-6">
          {/* Payment info */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5 text-primary-600" />Thông tin giao dịch</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Mã giao dịch</dt>
                  <dd className="font-mono font-semibold text-primary-700 mt-1">{payment.code}</dd>
                </div>
                {payment.transactionId && (
                  <div>
                    <dt className="text-sm text-gray-500">Mã GD ngân hàng</dt>
                    <dd className="font-mono text-gray-800 mt-1">{payment.transactionId}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-gray-500">Số tiền</dt>
                  <dd className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(payment.amount)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Phương thức</dt>
                  <dd className="flex items-center gap-2 mt-1">
                    <Banknote className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{methodLabels[payment.method]}</span>
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm text-gray-500">Mô tả dịch vụ</dt>
                  <dd className="font-medium mt-1">{payment.description}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Patient info */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary-600" />Bệnh nhân</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Tên bệnh nhân</dt>
                  <dd className="font-medium mt-1">{payment.patientName}</dd>
                </div>
                {payment.appointmentId && (
                  <div>
                    <dt className="text-sm text-gray-500">Mã lịch hẹn</dt>
                    <dd className="font-mono text-primary-600 mt-1">{payment.appointmentId}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary-600" />Lịch sử giao dịch</CardTitle></CardHeader>
            <CardContent>
              <ol className="relative border-l border-gray-200 ml-3 space-y-4">
                <li className="ml-4">
                  <div className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-gray-300 border-2 border-white" />
                  <p className="text-sm font-medium text-gray-700">Tạo giao dịch</p>
                  <p className="text-xs text-gray-500">{formatDateTime(payment.createdAt)}</p>
                </li>
                {payment.paidAt && (
                  <li className="ml-4">
                    <div className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                    <p className="text-sm font-medium text-green-700">Thanh toán thành công</p>
                    <p className="text-xs text-gray-500">{formatDateTime(payment.paidAt)}</p>
                  </li>
                )}
                {payment.refundedAt && (
                  <li className="ml-4">
                    <div className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
                    <p className="text-sm font-medium text-blue-700">Đã hoàn tiền{payment.refundAmount ? ` – ${formatCurrency(payment.refundAmount)}` : ""}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(payment.refundedAt)}</p>
                  </li>
                )}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Thao tác</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {payment.status === "pending" && (
                <Button variant="primary" className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Xác nhận đã thanh toán
                </Button>
              )}
              {payment.status === "paid" && (
                <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Hoàn tiền
                </Button>
              )}
              <Button variant="ghost" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Xuất biên lai
              </Button>
              {payment.appointmentId && (
                <Button variant="ghost" className="w-full" onClick={() => router.push(`/appointments/${payment.appointmentId}`)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Xem lịch hẹn
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Thông tin hệ thống</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã</span>
                <span className="font-mono text-xs">{payment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tạo lúc</span>
                <span className="text-xs">{formatDateTime(payment.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cập nhật</span>
                <span className="text-xs">{formatDateTime(payment.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
