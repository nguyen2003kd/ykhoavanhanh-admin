export type AdminRole =
  | "super_admin"       // Cấu hình toàn hệ thống
  | "admin_content"     // Quản lý bài viết/tin tức
  | "admin_membership"  // Quản lý điểm/quà/voucher
  | "cskh"              // Nhân viên CSKH xác nhận lịch, tư vấn
  | "doctor";           // Bác sĩ xem lịch khám

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: AdminRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}
