export interface DoctorReview {
  id: string;
  patientId: string;
  patientName: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  rating: number; // 1-5
  attitude: number; // Thái độ
  expertise: number; // Chuyên môn
  waitTime: number; // Thời gian chờ
  facilities: number; // Cơ sở vật chất
  comment?: string;
  isVisible: boolean;
  isApproved: boolean;
  adminNote?: string;
  doctorReply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceReview {
  id: string;
  patientId: string;
  patientName: string;
  appointmentId: string;
  overallRating: number;
  comment?: string;
  isVisible: boolean;
  isApproved: boolean;
  createdAt: string;
}
