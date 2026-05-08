"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FiHome, FiUsers, FiCalendar, FiActivity, FiAward,
  FiBell, FiFileText, FiStar, FiCreditCard, FiTag,
  FiSettings, FiLogOut, FiChevronDown, FiUser, FiBook,
  FiBarChart2,
} from "react-icons/fi";
import { clearAuthSession } from "@/lib/auth-session";
import { authService } from "@/services/auth";
import { useToast } from "@/components/ui/ToastProvider";

interface NavChild {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  children?: NavChild[];
}

const navigation: NavItem[] = [
  { name: "Bảng điều khiển", href: "/", icon: FiHome },
  {
    name: "Bệnh nhân",
    icon: FiUsers,
    children: [
      { name: "Danh sách bệnh nhân", href: "/patients" },
      { name: "Hồ sơ sức khỏe", href: "/medical-records" },
    ],
  },
  {
    name: "Lịch hẹn",
    icon: FiCalendar,
    children: [
      { name: "Tất cả lịch hẹn", href: "/appointments" },
      { name: "Đặt lịch mới", href: "/appointments/new" },
    ],
  },
  {
    name: "Bác sĩ & Khoa",
    icon: FiActivity,
    children: [
      { name: "Quản lý bác sĩ", href: "/doctors" },
      { name: "Chuyên khoa", href: "/specialties" },
    ],
  },
  {
    name: "Membership",
    icon: FiAward,
    children: [
      { name: "Thành viên", href: "/membership" },
      { name: "Quản lý điểm", href: "/membership/points" },
      { name: "Quà tặng", href: "/membership/gifts" },
      { name: "Voucher", href: "/membership/vouchers" },
    ],
  },
  {
    name: "Nội dung",
    icon: FiBook,
    children: [
      { name: "Bài viết sức khỏe", href: "/content/articles" },
      { name: "Tin tức", href: "/content/news" },
      { name: "Video / Livestream", href: "/content/videos" },
    ],
  },
  {
    name: "Khuyến mãi",
    icon: FiTag,
    children: [
      { name: "Chương trình KM", href: "/promotions" },
    ],
  },
  { name: "Thanh toán", href: "/payments", icon: FiCreditCard },
  { name: "Đánh giá", href: "/reviews", icon: FiStar },
  { name: "Thông báo", href: "/notifications", icon: FiBell },
  { name: "Báo cáo", href: "/reports", icon: FiBarChart2 },
  { name: "Người dùng", href: "/users", icon: FiUser },
  { name: "Cài đặt", href: "/settings", icon: FiSettings },
];

function isPathMatch(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  // Exact match hoặc match subpath (với dấu / sau)
  return pathname === href || (pathname.startsWith(`${href}/`) && href !== "/");
}

function getActiveChild(pathname: string, children: NavChild[]) {
  // Sort by length descending để match deepest path trước
  // Dùng subpath matching để /doctors/new cũng match /doctors
  return [...children].sort((a, b) => b.href.length - a.href.length).find((c) =>
    pathname === c.href || pathname.startsWith(c.href + "/")
  )?.href ?? null;
}

function isGroupActive(pathname: string, item: NavItem) {
  // Nếu có child được active (kể cả subpath), highlight group
  const child = item.children ? Boolean(getActiveChild(pathname, item.children)) : false;
  if (child) return true;
  
  // Nếu không có child, dùng subpath match cho self
  if (!item.href) return false;
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    const expanded = new Set<string>();
    navigation.forEach((item) => {
      if (item.children && isGroupActive(pathname, item)) expanded.add(item.name);
    });
    return expanded;
  });

  useEffect(() => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      navigation.forEach((item) => {
        if (item.children && isGroupActive(pathname, item)) next.add(item.name);
      });
      return next;
    });
  }, [pathname]);

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } catch { }
    clearAuthSession();
    router.replace("/auth/login");
  };

  return (
    <aside
      className={cn(
        "flex-shrink-0 flex flex-col h-full bg-gray-900 transition-all duration-300 overflow-hidden sidebar-scroll",
        isOpen ? "w-64" : "w-16",
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center justify-center px-5 py-4 border-b border-gray-700 flex-shrink-0",
        !isOpen && "px-2"
      )}>
        <div className={cn("flex items-center justify-center", isOpen ? "w-40" : "w-8")}>
          <Image 
            src="/logo/logo-vanhanh.svg" 
            alt="Y Khoa Vạn Hạnh" 
            width={isOpen ? 160 : 32} 
            height={isOpen ? 40 : 32} 
            className="max-w-full h-auto"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 py-4 space-y-0.5">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isGroupActive(pathname, item);

          if (item.children) {
            const isExpanded = expandedItems.has(item.name);
            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  title={!isOpen ? item.name : undefined}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white",
                    !isOpen && "justify-center"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {isOpen && (
                    <>
                      <span className="flex-1 text-left truncate">{item.name}</span>
                      <FiChevronDown className={cn("w-4 h-4 transition-transform flex-shrink-0", isExpanded && "rotate-180")} />
                    </>
                  )}
                </button>
                {isOpen && isExpanded && item.children && (
                  <div className="ml-7 mt-0.5 space-y-0.5">
                    {item.children.map((child) => {
                      // Nếu đã có child nào match chính xác thì không dùng startsWith cho child khác
                      const exactMatchExists = item.children?.some((c) => pathname === c.href);
                      const childActive = pathname === child.href || (!exactMatchExists && pathname.startsWith(child.href + "/"));
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                            childActive ? "bg-primary-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white",
                          )}
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              title={!isOpen ? item.name : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active ? "bg-primary-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white",
                !isOpen && "justify-center"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {isOpen && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={cn(
        "px-3 py-4 border-t border-gray-700 flex-shrink-0",
        !isOpen && "px-2"
      )}>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={!isOpen ? "Đăng xuất" : undefined}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors disabled:opacity-50",
            !isOpen && "justify-center px-2"
          )}
        >
          <FiLogOut className="w-4 h-4 flex-shrink-0" />
          {isOpen && <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>}
        </button>
      </div>
    </aside>
  );
}
