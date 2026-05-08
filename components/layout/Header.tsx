"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiLogOut, FiChevronDown } from "react-icons/fi";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { clearAuthSession, getCurrentUserSession, hasAuthSession } from "@/lib/auth-session";
import { authService } from "@/services/auth";
import { AdminUser, AdminRole } from "@/types/user";

const roleLabels: Record<AdminRole, string> = {
  super_admin: "Quản trị viên",
  admin_content: "Biên tập nội dung",
  admin_membership: "Quản lý Membership",
  cskh: "CSKH",
  doctor: "Bác sĩ",
};

const moduleTitleMap: Record<string, string> = {
  "/": "Bảng điều khiển",
  "/patients": "Quản lý bệnh nhân",
  "/medical-records": "Hồ sơ sức khỏe",
  "/appointments": "Quản lý lịch hẹn",
  "/doctors": "Quản lý bác sĩ",
  "/specialties": "Chuyên khoa",
  "/membership": "Membership",
  "/membership/points": "Quản lý điểm",
  "/membership/gifts": "Quà tặng",
  "/membership/vouchers": "Voucher",
  "/content/articles": "Bài viết sức khỏe",
  "/content/news": "Tin tức",
  "/content/videos": "Video / Livestream",
  "/promotions": "Khuyến mãi",
  "/payments": "Thanh toán",
  "/reviews": "Đánh giá",
  "/notifications": "Thông báo",
  "/reports": "Báo cáo thống kê",
  "/users": "Người dùng",
  "/settings": "Cài đặt",
};

function getPageTitle(pathname: string): string {
  const sorted = Object.keys(moduleTitleMap).sort((a, b) => b.length - a.length);
  const match = sorted.find((key) => pathname === key || (key !== "/" && pathname.startsWith(key + "/")));
  return match ? moduleTitleMap[match] : "Y Khoa Vạn Hạnh";
}

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ isSidebarOpen, onToggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setIsUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const cached = getCurrentUserSession();
    if (cached) { setCurrentUser(cached); return; }
    if (!hasAuthSession()) return;
    authService.getMyInfo().then((u) => { if (u) setCurrentUser(u); }).catch(() => {});
  }, []);

  const handleLogout = async () => {
    try { await authService.logout(); } catch { }
    clearAuthSession();
    router.replace("/auth/login");
  };

  const pageTitle = getPageTitle(pathname);

  return (
    <header className="flex-shrink-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-gray-800">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2">
        {currentUser && (
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Avatar name={currentUser.fullName} size="sm" />
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium text-gray-700">{currentUser.fullName}</span>
                <span className="text-xs text-gray-500">{roleLabels[currentUser.role]}</span>
              </div>
              <FiChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[160px]">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{currentUser.fullName}</p>
                  <p className="text-xs text-gray-500 mb-1">{currentUser.email}</p>
                  <Badge variant="info" className="text-xs">{roleLabels[currentUser.role]}</Badge>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
