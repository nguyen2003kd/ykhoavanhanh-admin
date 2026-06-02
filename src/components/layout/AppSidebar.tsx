"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Award,
  BarChart2,
  Bell,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
  LayoutGrid,
  MessageSquare,
  Settings,
  Star,
  Stethoscope,
  Tag,
  Users,
  Wrench,
} from "lucide-react";

// ── Navigation schema (mirrors NavRail) ────────────────────────────────────

interface NavChild {
  name: string;
  href: string;
}

interface NavGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: NavChild[];
}

const NAV_GROUPS: NavGroup[] = [
  { id: "dashboard",    label: "Tổng quan",   icon: Home,        href: "/" },
  {
    id: "patients", label: "Bệnh nhân", icon: Users,
    children: [
      { name: "Danh sách bệnh nhân", href: "/patients" },
      { name: "Hồ sơ bệnh án",       href: "/medical-records" },
    ],
  },
  { id: "appointments", label: "Lịch khám",   icon: Calendar,    href: "/appointments" },
  { id: "operations",   label: "Vận hành",    icon: Wrench,      href: "/operations" },
  {
    id: "clinical", label: "Lâm sàng", icon: Stethoscope,
    children: [
      { name: "Chuyên khoa",   href: "/specialties" },
      { name: "Khu vực khám",  href: "/exam-areas" },
      { name: "Phòng khám",    href: "/clinics" },
      { name: "Bác sĩ",        href: "/doctors" },
      { name: "Dịch vụ khám",  href: "/exam-services" },
    ],
  },
  {
    id: "membership", label: "Membership", icon: Award,
    children: [
      { name: "Thành viên",   href: "/membership" },
      { name: "Điểm thưởng",  href: "/membership/points" },
      { name: "Quà tặng",     href: "/membership/gifts" },
      { name: "Voucher",      href: "/membership/vouchers" },
    ],
  },
  {
    id: "content", label: "Nội dung", icon: BookOpen,
    children: [
      { name: "Bài viết sức khỏe", href: "/content/articles" },
      { name: "Tin tức",           href: "/content/news" },
      { name: "Video",             href: "/content/videos" },
    ],
  },
  { id: "promotions",    label: "Khuyến mãi",  icon: Tag,         href: "/promotions" },
  { id: "payments",      label: "Thanh toán",  icon: CreditCard,  href: "/payments" },
  { id: "reviews",       label: "Đánh giá",    icon: Star,        href: "/reviews" },
  { id: "notifications", label: "Thông báo",   icon: Bell,          href: "/notifications" },
  { id: "chats",        label: "CSKH",          icon: MessageSquare,  href: "/chats" },
  { id: "reports",      label: "Báo cáo",      icon: BarChart2,     href: "/reports" },
  { id: "users",         label: "Người dùng",  icon: LayoutGrid,  href: "/users" },
  { id: "settings",      label: "Cài đặt",     icon: Settings,    href: "/settings" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function isGroupActive(pathname: string, group: NavGroup): boolean {
  if (group.href) {
    if (group.href === "/") return pathname === "/";
    return pathname === group.href || pathname.startsWith(group.href + "/");
  }
  return (
    group.children?.some(
      (c) => pathname === c.href || pathname.startsWith(c.href + "/"),
    ) ?? false
  );
}

// ── AppSidebar ───────────────────────────────────────────────────────────────

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Auto-expand whichever group is currently active
  useEffect(() => {
    const activeGroup = NAV_GROUPS.find((g) => isGroupActive(pathname, g));
    if (activeGroup?.children) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.add(activeGroup.id);
        return next;
      });
    }
  }, [pathname]);

  const toggleGroup = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <aside
      className={cn(
        "sticky top-0 z-40 flex h-screen flex-col border-r border-border bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header: logo + collapse toggle */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        {/* Logo + text wrapped so toggle can stay outside */}
        <div
          className={cn(
            "flex items-center gap-3 min-w-0",
            collapsed ? "justify-center" : "flex-1 min-w-0"
          )}
        >
          <div className={`${collapsed ? "hidden" : "h-12 w-12"} relative shrink-0 overflow-hidden rounded-lg`}>
            <Image
              src="/assets/images/logo.png"
              alt="Van Hanh Hospital"
              fill
              className="object-contain"
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-primary-700 leading-tight truncate">Van Hanh</span>
              <span className="text-xs text-muted-foreground leading-tight truncate">Hospital</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed((p) => !p)}
          aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {NAV_GROUPS.map((group) => {
          const Icon = group.icon;
          const active = isGroupActive(pathname, group);
          const isExpanded = expandedIds.has(group.id);

          if (group.children) {
            return (
              <div key={group.id}>
                <button
                  onClick={() => toggleGroup(group.id)}
                  title={collapsed ? group.label : undefined}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-primary-50 text-primary-700"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      active ? "text-primary-600" : "text-muted-foreground"
                    )}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate text-left">{group.label}</span>
                      <ChevronDown
                        className={cn(
                          "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </>
                  )}
                </button>

                {!collapsed && isExpanded && (
                  <div className="ml-7 mt-0.5 space-y-0.5">
                    {group.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150",
                            childActive
                              ? "bg-primary-600 text-white shadow-sm"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
              key={group.href}
              href={group.href!}
              title={collapsed ? group.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-primary-50 text-primary-700"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  active ? "text-primary-600" : "text-muted-foreground"
                )}
              />
              {!collapsed && <span className="truncate">{group.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
