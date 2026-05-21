export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "expired";
export type PaymentMethod = "vcb_qr" | "vcb_transfer" | "vcb_card" | "cash";

export interface Payment {
  id: string;
  code: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  description: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}
