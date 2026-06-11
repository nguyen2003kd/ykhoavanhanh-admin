"use client";

/**
 * NavRail — Premium horizontal scrollable navigation carousel.
 * Sits sticky below AppHeader.
 *
 * Design:
 * – Taller tabs (h-12) with icon + label
 * – Active pill style: filled primary-600 bg, rounded-xl
 * – Hover: soft gray surface, smooth 150ms
 * – Sub-nav row: secondary breadcrumb-style tab strip
 * – Scroll: wheel, touch, momentum; arrow buttons + fade edges
 * – A11y: role=navigation, aria-current, keyboard focus rings
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Award,
  BarChart2,
  Bell,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
  LayoutGrid,
  Settings,
  Star,
  Stethoscope,
  Tag,
  Users,
  Wrench,
} from "lucide-react";

// ── Navigation schema ────────────────────────────────────────────────────────

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
  { id: "notifications", label: "Thông báo",   icon: Bell,        href: "/notifications" },
  { id: "reports",       label: "Báo cáo",     icon: BarChart2,   href: "/reports" },
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

// ── Sub-nav pill strip ────────────────────────────────────────────────────────

function SubNav({ group }: { group: NavGroup }) {
  const pathname = usePathname();
  if (!group.children?.length) return null;

  return (
    <div
      role="navigation"
      aria-label={`Điều hướng con: ${group.label}`}
      className="border-t border-gray-100 bg-gray-50/60 px-6 xl:px-8"
    >
      <div className="flex items-center gap-1 py-2">
        {group.children.map((child) => {
          const active = pathname === child.href || pathname.startsWith(child.href + "/");
          return (
            <Link
              key={child.href}
              href={child.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-150",
                active
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-gray-500 hover:bg-white hover:text-gray-800 hover:shadow-sm",
              )}
            >
              {child.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ── Fade edge overlay ─────────────────────────────────────────────────────────

function FadeEdge({ side, visible }: { side: "left" | "right"; visible: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-0 z-10 h-full w-16 transition-opacity duration-200",
        side === "left"
          ? "left-0 bg-gradient-to-r from-white via-white/80 to-transparent"
          : "right-0 bg-gradient-to-l from-white via-white/80 to-transparent",
        visible ? "opacity-100" : "opacity-0",
      )}
    />
  );
}

// ── Scroll arrow ──────────────────────────────────────────────────────────────

function ScrollArrow({
  direction,
  onClick,
  visible,
}: {
  direction: "left" | "right";
  onClick: () => void;
  visible: boolean;
}) {
  return (
    <button
      aria-label={direction === "left" ? "Cuộn sang trái" : "Cuộn sang phải"}
      onClick={onClick}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "absolute top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition-all duration-200 hover:bg-gray-50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
        direction === "left" ? "left-2" : "right-2",
        visible ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-90",
      )}
    >
      {direction === "left" ? (
        <ChevronLeft className="size-4 text-gray-600" />
      ) : (
        <ChevronRight className="size-4 text-gray-600" />
      )}
    </button>
  );
}

// ── Nav tab item ──────────────────────────────────────────────────────────────

function NavTab({
  group,
  active,
  onClick,
}: {
  group: NavGroup;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = group.icon;
  const href = group.href ?? group.children?.[0]?.href ?? "#";

  return (
    <Link
      href={href}
      onClick={onClick}
      data-nav-id={group.id}
      aria-current={active ? "page" : undefined}
      className={cn(
        // base
        "group relative flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-all duration-150",
        "focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1",
        // active
        active
          ? "bg-primary-600 text-white shadow-md shadow-primary-600/25"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800",
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0 transition-colors duration-150",
          active ? "text-white" : "text-gray-400 group-hover:text-gray-600",
        )}
      />
      <span className="leading-none">{group.label}</span>
    </Link>
  );
}

// ── NavRail ───────────────────────────────────────────────────────────────────

export function NavRail() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeGroup, setActiveGroup] = useState<NavGroup | null>(null);

  // Resolve active group from pathname
  useEffect(() => {
    setActiveGroup(NAV_GROUPS.find((g) => isGroupActive(pathname, g)) ?? null);
  }, [pathname]);

  // Center active tab in scroll container
  useEffect(() => {
    if (!scrollRef.current || !activeGroup) return;
    const el = scrollRef.current.querySelector<HTMLElement>(
      `[data-nav-id="${activeGroup.id}"]`,
    );
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeGroup]);

  // Scroll state tracking
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, []);

  // Mouse-wheel → horizontal scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollBy({ left: e.deltaY * 2.5, behavior: "smooth" });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const scroll = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -240 : 240,
      behavior: "smooth",
    });

  const hasSubNav = (activeGroup?.children?.length ?? 0) > 1;

  return (
    <nav
      aria-label="Điều hướng chính"
      className="sticky top-[72px] z-30 w-full shrink-0 border-b border-gray-100 bg-white shadow-[0_1px_4px_0_rgba(0,0,0,0.05)]"
    >
      {/* ── Primary tab row ── */}
      <div className="relative flex h-14 items-center">
        <FadeEdge side="left" visible={canScrollLeft} />
        <ScrollArrow direction="left" onClick={() => scroll("left")} visible={canScrollLeft} />

        {/* Scrollable tab track */}
        <div
          ref={scrollRef}
          role="list"
          className="flex h-full flex-1 items-center gap-1 overflow-x-auto px-5 xl:px-8 scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {NAV_GROUPS.map((group) => (
            <div key={group.id} role="listitem">
              <NavTab
                group={group}
                active={isGroupActive(pathname, group)}
                onClick={() => setActiveGroup(group)}
              />
            </div>
          ))}
        </div>

        <FadeEdge side="right" visible={canScrollRight} />
        <ScrollArrow direction="right" onClick={() => scroll("right")} visible={canScrollRight} />
      </div>

      {/* ── Sub-nav row ── */}
      {hasSubNav && activeGroup && <SubNav group={activeGroup} />}
    </nav>
  );
}
