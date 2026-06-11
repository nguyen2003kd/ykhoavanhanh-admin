export interface Doctor {
  id: string;
  fullName: string;
  title: string; // BS., ThS., PGS., GS.
  specialtyId: string;
  specialtyName: string;
  phone: string;
  email: string;
  avatar?: string;
  bio?: string;
  experience: number; // years
  isActive: boolean;
  averageRating: number;
  totalReviews: number;
  schedule?: DoctorSchedule[];
  createdAt: string;
}

export interface DoctorSchedule {
  dayOfWeek: number; // 0-6 (CN-T7)
  slots: {
    startTime: string;
    endTime: string;
    maxPatients: number;
  }[];
}
