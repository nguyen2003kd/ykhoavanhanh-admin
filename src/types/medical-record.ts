export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  visitDate: string;
  doctorId: string;
  doctorName: string;
  specialtyName: string;
  diagnosis: string;
  prescription?: string;
  testResults?: TestResult[];
  imagingResults?: ImagingResult[];
  invoiceItems?: InvoiceItem[];
  attachments?: Attachment[];
  note?: string;
  totalCost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestResult {
  id: string;
  name: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  isAbnormal: boolean;
  recordedAt: string;
}

export interface ImagingResult {
  id: string;
  type: "xray" | "mri" | "ct" | "ultrasound" | "other";
  description: string;
  fileUrl?: string;
  recordedAt: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: "pdf" | "image" | "other";
  size: number;
  uploadedAt: string;
}
