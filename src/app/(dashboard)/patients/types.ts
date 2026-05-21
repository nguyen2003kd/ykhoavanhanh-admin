export type PatientStatus = "active" | "inactive" | "pending";
export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type Gender = "male" | "female" | "other";

export interface Patient {
  id: string;
  code: string; // Mã bệnh nhân
  fullName: string;
  phone: string;
  email?: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  bloodType?: BloodType;
  allergies?: string[];
  medicalHistory?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  membershipId?: string;
  membershipTier?: "silver" | "gold" | "diamond";
  status: PatientStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PatientFamily {
  id: string;
  patientId: string; // Chủ hộ
  members: PatientFamilyMember[];
}

export interface PatientFamilyMember {
  id: string;
  patientId: string;
  relationship: string;
  isPrimary: boolean;
}
