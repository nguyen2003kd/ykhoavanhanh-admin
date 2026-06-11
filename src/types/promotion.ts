export interface Promotion {
  id: string;
  name: string;
  description: string;
  bannerUrl?: string;
  type: "discount" | "package" | "gift" | "points_bonus";
  discountPercent?: number;
  discountAmount?: number;
  bonusPoints?: number;
  targetAudience: "all" | "new_patients" | "members" | "specific_tier";
  targetTier?: "silver" | "gold" | "diamond";
  validFrom: string;
  validTo: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}
