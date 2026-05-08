import { AdminUser } from "@/types/user";

export const mockUsers: AdminUser[] = [
  { id: "u001", fullName: "Nguyễn Quản Lý", email: "admin@vanhanh.vn", phone: "0900000001", role: "super_admin", avatar: "/images/users/u001.jpg", isActive: true, createdAt: "2023-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "u002", fullName: "Trần Biên Tập", email: "content@vanhanh.vn", phone: "0900000002", role: "admin_content", isActive: true, createdAt: "2023-06-01T00:00:00Z", updatedAt: "2024-06-01T00:00:00Z" },
  { id: "u003", fullName: "Lê Chăm Sóc", email: "cskh@vanhanh.vn", phone: "0900000003", role: "cskh", isActive: true, createdAt: "2023-09-01T00:00:00Z", updatedAt: "2024-09-01T00:00:00Z" },
  { id: "u004", fullName: "Phạm Thành Viên", email: "membership@vanhanh.vn", phone: "0900000004", role: "admin_membership", isActive: true, createdAt: "2023-10-01T00:00:00Z", updatedAt: "2024-10-01T00:00:00Z" },
  { id: "u005", fullName: "Hoàng Bác Sĩ", email: "bshoang@vanhanh.vn", phone: "0900000005", role: "doctor", isActive: true, createdAt: "2024-01-15T00:00:00Z", updatedAt: "2024-01-15T00:00:00Z" },
  { id: "u006", fullName: "Vũ Tiếp Đón", email: "reception@vanhanh.vn", phone: "0900000006", role: "cskh", isActive: false, createdAt: "2024-02-01T00:00:00Z", updatedAt: "2024-05-01T00:00:00Z" },
  { id: "u007", fullName: "Đặng Nội Dung", email: "content2@vanhanh.vn", phone: "0900000007", role: "admin_content", isActive: true, createdAt: "2024-03-01T00:00:00Z", updatedAt: "2024-03-01T00:00:00Z" },
];
