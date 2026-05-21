export type MembershipTier = "silver" | "gold" | "diamond";

export interface MemberProfile {
  id: string;
  patientId: string;
  patientName: string;
  tier: MembershipTier;
  points: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  familyGroupId?: string;
  isPrimaryMember: boolean;
  joinedAt: string;
  pointsExpiryDate?: string;
}

export interface FamilyGroup {
  id: string;
  name: string;
  primaryMemberId: string;
  members: FamilyMember[];
  totalPoints: number;
  createdAt: string;
}

export interface FamilyMember {
  patientId: string;
  patientName: string;
  relationship: string;
  addedAt: string;
}

export interface PointTransaction {
  id: string;
  memberId: string;
  type: "earn" | "redeem" | "expire" | "adjust";
  points: number;
  balance: number;
  description: string;
  referenceId?: string; // appointmentId, giftId, etc.
  createdAt: string;
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  pointsRequired: number;
  type: "voucher" | "package" | "product" | "service";
  stock: number;
  isActive: boolean;
  validFrom: string;
  validTo: string;
  createdAt: string;
}

export interface GiftRedemption {
  id: string;
  memberId: string;
  patientName: string;
  giftId: string;
  giftName: string;
  pointsUsed: number;
  status: "pending" | "approved" | "delivered" | "cancelled";
  requestedAt: string;
  processedAt?: string;
}

export interface Voucher {
  id: string;
  code: string;
  name: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  createdAt: string;
}
