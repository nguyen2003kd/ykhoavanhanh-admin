import { MemberProfile, Gift, Voucher, PointTransaction, GiftRedemption } from "@/types/membership";

export const mockMembers: MemberProfile[] = [
  { id: "m001", patientId: "p001", patientName: "Nguyễn Thị Lan", tier: "gold", points: 1800, totalPointsEarned: 2500, totalPointsRedeemed: 700, isPrimaryMember: true, joinedAt: "2024-01-10T00:00:00Z", pointsExpiryDate: "2025-01-10T00:00:00Z" },
  { id: "m002", patientId: "p002", patientName: "Trần Văn Minh", tier: "silver", points: 900, totalPointsEarned: 1200, totalPointsRedeemed: 300, isPrimaryMember: true, joinedAt: "2024-01-15T00:00:00Z", pointsExpiryDate: "2025-01-15T00:00:00Z" },
  { id: "m003", patientId: "p003", patientName: "Lê Thị Hoa", tier: "diamond", points: 5500, totalPointsEarned: 8000, totalPointsRedeemed: 2500, isPrimaryMember: true, joinedAt: "2023-06-01T00:00:00Z", pointsExpiryDate: "2025-06-01T00:00:00Z" },
  { id: "m004", patientId: "p005", patientName: "Võ Thị Mai", tier: "silver", points: 450, totalPointsEarned: 750, totalPointsRedeemed: 300, isPrimaryMember: true, joinedAt: "2024-03-05T00:00:00Z", pointsExpiryDate: "2025-03-05T00:00:00Z" },
  { id: "m005", patientId: "p007", patientName: "Hoàng Thị Thanh", tier: "gold", points: 2300, totalPointsEarned: 3100, totalPointsRedeemed: 800, isPrimaryMember: true, joinedAt: "2023-12-01T00:00:00Z", pointsExpiryDate: "2024-12-01T00:00:00Z" },
  { id: "m006", patientId: "p009", patientName: "Trịnh Thị Yến", tier: "silver", points: 680, totalPointsEarned: 680, totalPointsRedeemed: 0, isPrimaryMember: true, joinedAt: "2024-05-01T00:00:00Z", pointsExpiryDate: "2025-05-01T00:00:00Z" },
];

export const mockPointTransactions: PointTransaction[] = [
  { id: "pt001", memberId: "m001", type: "earn", points: 200, balance: 1800, description: "Khám nội khoa — BS. Trần Văn An", referenceId: "a001", createdAt: "2024-07-10T08:30:00Z" },
  { id: "pt002", memberId: "m001", type: "redeem", points: -500, balance: 1600, description: "Đổi quà: Bình giữ nhiệt", referenceId: "g002", createdAt: "2024-06-15T14:00:00Z" },
  { id: "pt003", memberId: "m001", type: "earn", points: 300, balance: 2100, description: "Khám tim mạch — BS. Lê Thị Bích", referenceId: "a002", createdAt: "2024-05-20T09:00:00Z" },
  { id: "pt004", memberId: "m001", type: "earn", points: 150, balance: 1800, description: "Tái khám nội khoa", createdAt: "2024-04-10T10:00:00Z" },
  { id: "pt005", memberId: "m001", type: "adjust", points: 100, balance: 1650, description: "Tích điểm bù cho cuộc hẹn tháng 3", createdAt: "2024-03-20T08:00:00Z" },
  { id: "pt006", memberId: "m003", type: "earn", points: 500, balance: 5500, description: "Gói khám sức khỏe cao cấp", createdAt: "2024-07-05T10:00:00Z" },
  { id: "pt007", memberId: "m003", type: "redeem", points: -2000, balance: 5000, description: "Đổi gói kiểm tra sức khỏe cơ bản", referenceId: "g003", createdAt: "2024-06-01T14:00:00Z" },
  { id: "pt008", memberId: "m003", type: "earn", points: 800, balance: 7000, description: "Phẫu thuật và hậu phẫu", createdAt: "2024-05-10T09:00:00Z" },
  { id: "pt009", memberId: "m002", type: "earn", points: 250, balance: 900, description: "Khám tim mạch — BS. Lê Thị Bích", createdAt: "2024-07-10T09:30:00Z" },
  { id: "pt010", memberId: "m002", type: "redeem", points: -300, balance: 650, description: "Đổi quà: Khăn bông cao cấp", referenceId: "g001", createdAt: "2024-06-20T11:00:00Z" },
];

export const mockGifts: Gift[] = [
  { id: "g001", name: "Khăn bông cao cấp", description: "Khăn bông cotton 100% thương hiệu Y Khoa Vạn Hạnh, kích thước 60x120cm.", pointsRequired: 500, type: "product", stock: 50, isActive: true, validFrom: "2024-01-01T00:00:00Z", validTo: "2024-12-31T23:59:59Z", createdAt: "2024-01-01T00:00:00Z" },
  { id: "g002", name: "Bình giữ nhiệt", description: "Bình giữ nhiệt 500ml in logo bệnh viện, giữ nóng 12h, giữ lạnh 24h.", pointsRequired: 1000, type: "product", stock: 30, isActive: true, validFrom: "2024-01-01T00:00:00Z", validTo: "2024-12-31T23:59:59Z", createdAt: "2024-01-01T00:00:00Z" },
  { id: "g003", name: "Gói kiểm tra sức khỏe cơ bản", description: "Gói khám sức khỏe cơ bản gồm xét nghiệm máu, nước tiểu và X-quang ngực.", pointsRequired: 2000, type: "package", stock: 20, isActive: true, validFrom: "2024-02-01T00:00:00Z", validTo: "2024-12-31T23:59:59Z", createdAt: "2024-02-01T00:00:00Z" },
  { id: "g004", name: "Voucher giảm 50.000đ", description: "Voucher giảm 50.000đ cho lần khám tiếp theo, không áp dụng cho phẫu thuật.", pointsRequired: 800, type: "voucher", stock: 100, isActive: true, validFrom: "2024-01-01T00:00:00Z", validTo: "2024-12-31T23:59:59Z", createdAt: "2024-01-01T00:00:00Z" },
  { id: "g005", name: "Gói xét nghiệm toàn diện", description: "Xét nghiệm máu toàn diện 30 chỉ số, mỡ máu, đường huyết, chức năng gan thận.", pointsRequired: 3500, type: "package", stock: 15, isActive: true, validFrom: "2024-03-01T00:00:00Z", validTo: "2024-12-31T23:59:59Z", createdAt: "2024-03-01T00:00:00Z" },
  { id: "g006", name: "Tai nghe không dây", description: "Tai nghe không dây Bluetooth 5.0, chống ồn, pin 30h.", pointsRequired: 5000, type: "product", stock: 10, isActive: true, validFrom: "2024-06-01T00:00:00Z", validTo: "2024-12-31T23:59:59Z", createdAt: "2024-06-01T00:00:00Z" },
];

export const mockGiftRedemptions: GiftRedemption[] = [
  { id: "gr001", memberId: "m001", patientName: "Nguyễn Thị Lan", giftId: "g002", giftName: "Bình giữ nhiệt", pointsUsed: 1000, status: "delivered", requestedAt: "2024-06-15T14:00:00Z", processedAt: "2024-06-17T10:00:00Z" },
  { id: "gr002", memberId: "m002", patientName: "Trần Văn Minh", giftId: "g001", giftName: "Khăn bông cao cấp", pointsUsed: 500, status: "delivered", requestedAt: "2024-06-20T11:00:00Z", processedAt: "2024-06-22T09:00:00Z" },
  { id: "gr003", memberId: "m003", patientName: "Lê Thị Hoa", giftId: "g003", giftName: "Gói kiểm tra sức khỏe cơ bản", pointsUsed: 2000, status: "approved", requestedAt: "2024-06-01T14:00:00Z" },
  { id: "gr004", memberId: "m005", patientName: "Hoàng Thị Thanh", giftId: "g004", giftName: "Voucher giảm 50.000đ", pointsUsed: 800, status: "pending", requestedAt: "2024-07-08T10:00:00Z" },
];

export const mockVouchers: Voucher[] = [
  { id: "v001", code: "VANHANH10", name: "Giảm 10% phí khám", discountType: "percent", discountValue: 10, minOrderValue: 200000, maxDiscount: 100000, validFrom: "2024-07-01T00:00:00Z", validTo: "2024-09-30T23:59:59Z", usageLimit: 100, usedCount: 34, isActive: true, createdAt: "2024-07-01T00:00:00Z" },
  { id: "v002", code: "NOIDOC50K", name: "Giảm 50.000đ nội soi tiêu hoá", discountType: "fixed", discountValue: 50000, minOrderValue: 500000, validFrom: "2024-06-01T00:00:00Z", validTo: "2024-08-31T23:59:59Z", usageLimit: 50, usedCount: 22, isActive: true, createdAt: "2024-06-01T00:00:00Z" },
  { id: "v003", code: "TIMMACH15", name: "Giảm 15% Tim mạch", discountType: "percent", discountValue: 15, minOrderValue: 300000, maxDiscount: 200000, validFrom: "2024-07-01T00:00:00Z", validTo: "2024-07-31T23:59:59Z", usageLimit: 30, usedCount: 18, isActive: true, createdAt: "2024-07-01T00:00:00Z" },
  { id: "v004", code: "KHAMTONG", name: "Miễn phí khám tổng quát", discountType: "fixed", discountValue: 150000, minOrderValue: 150000, validFrom: "2024-08-01T00:00:00Z", validTo: "2024-08-31T23:59:59Z", usageLimit: 20, usedCount: 0, isActive: false, createdAt: "2024-07-15T00:00:00Z" },
];
