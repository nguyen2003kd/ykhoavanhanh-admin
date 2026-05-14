"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FiActivity,
  FiAward,
  FiBarChart2,
  FiBell,
  FiBook,
  FiCalendar,
  FiChevronDown,
  FiCreditCard,
  FiHome,
  FiLogOut,
  FiLayers,
  FiMapPin,
  FiSettings,
  FiStar,
  FiTag,
  FiTool,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { clearAuthSession } from "@/lib/auth-session";
import { authService } from "@/services/auth";

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
  { name: "Quản lý chuyên khoa", href: "/specialties", icon: FiActivity },
  { name: "Khu vực khám bệnh", href: "/exam-areas", icon: FiMapPin },
  { name: "Quản lý phòng khám", href: "/clinics", icon: FiLayers },
  { name: "Quản lý bác sĩ", href: "/doctors", icon: FiUser },
  { name: "Quản lý dịch vụ khám", href: "/exam-services", icon: FiCreditCard },
  { name: "Quản lý lịch khám", href: "/appointments", icon: FiCalendar },
  {
    name: "Bảng điều khiển", href: "/", icon: FiHome,
  },
  {
    name: "Bệnh nhân",
    icon: FiUsers,
    children: [
      { name: "Danh sách bệnh nhân", href: "/patients" },
      { name: "Hồ sơ sức khỏe", href: "/medical-records" },
    ],
  },
  {
    name: "Vận hành",
    icon: FiTool,
    children: [{ name: "Công cụ admin", href: "/operations" }],
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
    children: [{ name: "Chương trình KM", href: "/promotions" }],
  },
  { name: "Thanh toán", href: "/payments", icon: FiCreditCard },
  { name: "Đánh giá", href: "/reviews", icon: FiStar },
  { name: "Thông báo", href: "/notifications", icon: FiBell },
  { name: "Báo cáo", href: "/reports", icon: FiBarChart2 },
  { name: "Người dùng", href: "/users", icon: FiUser },
  { name: "Cài đặt", href: "/settings", icon: FiSettings },
];

function getActiveChild(pathname: string, children: NavChild[]) {
  return [...children].sort((a, b) => b.href.length - a.href.length).find((child) =>
    pathname === child.href || pathname.startsWith(child.href + "/")
  )?.href ?? null;
}

function isGroupActive(pathname: string, item: NavItem) {
  const child = item.children ? Boolean(getActiveChild(pathname, item.children)) : false;
  if (child) return true;
  if (!item.href) return false;
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
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
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } catch {}
    clearAuthSession();
    router.replace("/auth/login");
  };

  return (
    <aside
      className={cn(
        "sidebar-scroll flex h-full flex-shrink-0 flex-col overflow-hidden bg-gray-900 transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div
        className={cn(
          "flex flex-shrink-0 items-center justify-center border-b border-gray-700 px-5 py-4",
          !isOpen && "px-2"
        )}
      >
        <div className={cn("flex items-center justify-center", isOpen ? "w-40" : "w-8")}>
          <Image
            src="/logo/logo-vanhanh.svg"
            alt="Y Khoa Vạn Hạnh"
            width={isOpen ? 160 : 32}
            height={isOpen ? 40 : 32}
            className="h-auto max-w-full"
          />
        </div>
      </div>

      <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
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
                    "w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center gap-3",
                    active ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white",
                    !isOpen && "justify-center"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {isOpen && (
                    <>
                      <span className="flex-1 truncate text-left">{item.name}</span>
                      <FiChevronDown
                        className={cn("h-4 w-4 flex-shrink-0 transition-transform", isExpanded && "rotate-180")}
                      />
                    </>
                  )}
                </button>
                {isOpen && isExpanded && (
                  <div className="ml-7 mt-0.5 space-y-0.5">
                    {item.children.map((child) => {
                      const exactMatchExists = item.children?.some((entry) => pathname === entry.href);
                      const childActive =
                        pathname === child.href || (!exactMatchExists && pathname.startsWith(child.href + "/"));
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                            childActive ? "bg-primary-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
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
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-primary-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white",
                !isOpen && "justify-center"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {isOpen && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={cn("flex-shrink-0 border-t border-gray-700 px-3 py-4", !isOpen && "px-2")}>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={!isOpen ? "Đăng xuất" : undefined}
          className={cn(
            "w-full rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-red-400 disabled:opacity-50 flex items-center gap-3",
            !isOpen && "justify-center px-2"
          )}
        >
          <FiLogOut className="h-4 w-4 flex-shrink-0" />
          {isOpen && <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>}
        </button>
      </div>
    </aside>
  );
}
