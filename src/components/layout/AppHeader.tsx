"use client";

/**
 * AppHeader — Premium spacious top header.
 * Height: ~72px (py-4 × 2 + content) — command-center feel.
 *
 * Layout:
 *   LEFT  : Hospital logo + name | Page title + breadcrumb
 *   CENTER: Global search
 *   RIGHT : Emergency | Notifications | Divider | Doctor profile
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { authService } from "@/api/authApi";
import { useCurrentUser } from "@/store/authStore";
import { AdminRole, AdminUser } from "@/types/user";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Clock,
  LogOut,
  Search,
  Settings,
  ShieldAlert,
  User,
} from "lucide-react";

// ── Constants ────────────────────────────────────────────────────────────────

const roleLabels: Record<AdminRole, string> = {
  super_admin: "Quản trị viên",
  admin_content: "Biên tập nội dung",
  admin_membership: "Quản lý Membership",
  cskh: "CSKH",
  doctor: "Bác sĩ",
};

const roleColors: Record<AdminRole, string> = {
  super_admin: "bg-violet-100 text-violet-700",
  admin_content: "bg-sky-100 text-sky-700",
  admin_membership: "bg-amber-100 text-amber-700",
  cskh: "bg-teal-100 text-teal-700",
  doctor: "bg-primary-100 text-primary-700",
};

const moduleTitleMap: Record<string, string> = {
  "/": "Bảng điều khiển",
  "/patients": "Bệnh nhân",
  "/medical-records": "Hồ sơ sức khỏe",
  "/specialties": "Chuyên khoa",
  "/exam-areas": "Khu vực khám",
  "/clinics": "Phòng khám",
  "/doctors": "Bác sĩ",
  "/exam-services": "Dịch vụ khám",
  "/appointments": "Lịch khám",
  "/operations": "Vận hành",
  "/membership": "Thành viên",
  "/membership/points": "Quản lý điểm",
  "/membership/gifts": "Quà tặng",
  "/membership/vouchers": "Voucher",
  "/content/articles": "Bài viết",
  "/content/news": "Tin tức",
  "/content/videos": "Video",
  "/promotions": "Khuyến mãi",
  "/payments": "Thanh toán",
  "/reviews": "Đánh giá",
  "/notifications": "Thông báo",
  "/reports": "Báo cáo",
  "/users": "Người dùng",
  "/settings": "Cài đặt",
};

const moduleSectionMap: Record<string, string> = {
  "/patients": "Quản lý bệnh nhân",
  "/medical-records": "Quản lý bệnh nhân",
  "/specialties": "Lâm sàng",
  "/exam-areas": "Lâm sàng",
  "/clinics": "Lâm sàng",
  "/doctors": "Lâm sàng",
  "/exam-services": "Lâm sàng",
  "/appointments": "Lịch khám",
  "/operations": "Vận hành",
  "/membership": "Membership",
  "/membership/points": "Membership",
  "/membership/gifts": "Membership",
  "/membership/vouchers": "Membership",
  "/content/articles": "Nội dung",
  "/content/news": "Nội dung",
  "/content/videos": "Nội dung",
};

function getPageInfo(pathname: string): { title: string; section: string | null } {
  const sorted = Object.keys(moduleTitleMap).sort((a, b) => b.length - a.length);
  const match = sorted.find(
    (key) => pathname === key || (key !== "/" && pathname.startsWith(key + "/")),
  );
  if (!match) return { title: "Y Khoa Vạn Hạnh", section: null };
  return {
    title: moduleTitleMap[match],
    section: moduleSectionMap[match] ?? null,
  };
}

// ── Live clock ───────────────────────────────────────────────────────────────

function LiveClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground" aria-live="off">
      <Clock className="size-3.5 shrink-0" />
      <span className="tabular-nums text-xs font-medium">
        {time.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}

// ── Global search ────────────────────────────────────────────────────────────

function GlobalSearch() {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className={cn(
        "relative flex h-10 w-full items-center gap-2.5 rounded-xl border px-4 transition-all duration-200",
        focused
          ? "border-primary-400 bg-white shadow-sm ring-3 ring-primary-400/15"
          : "border-border bg-muted/50 hover:border-border hover:bg-white",
      )}
    >
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <input
        type="text"
        placeholder="Tìm kiếm bệnh nhân, lịch khám, hồ sơ…"
        className="h-full flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label="Tìm kiếm toàn cục"
      />
      <div className="hidden shrink-0 items-center gap-1 sm:flex">
        <kbd className="inline-flex h-5 items-center rounded border border-border bg-white px-1.5 text-[10px] font-medium text-muted-foreground shadow-[0_1px_0_0_#e5e7eb]">
          /
        </kbd>
      </div>
    </div>
  );
}

// ── Notification bell ────────────────────────────────────────────────────────

function NotificationBell() {
  return (
    <button
      aria-label="Thông báo (3 chưa đọc)"
      className="group relative flex size-10 items-center justify-center rounded-xl border border-transparent text-gray-500 transition-all duration-150 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
    >
      <Bell className="size-[18px]" />
      <span
        className="absolute right-2 top-2 flex size-2 items-center justify-center rounded-full bg-error ring-2 ring-white"
        aria-hidden
      />
    </button>
  );
}

// ── Emergency button ─────────────────────────────────────────────────────────

function EmergencyButton() {
  return (
    <button
      aria-label="Cấp cứu khẩn cấp"
      className="flex h-10 items-center gap-2 rounded-xl border border-error/20 bg-error-light px-4 text-sm font-semibold text-error transition-all duration-150 hover:border-error/30 hover:bg-error/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/40"
    >
      <ShieldAlert className="size-4" />
      <span className="hidden xl:block">Khẩn cấp</span>
    </button>
  );
}

// ── User menu ────────────────────────────────────────────────────────────────

function UserMenu({ user }: { user: AdminUser }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try { await authService.logout(); } catch {}
    router.replace("/auth/login");
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Menu tài khoản"
        className={cn(
          "flex h-10 items-center gap-2.5 rounded-xl border px-3 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
          open
            ? "border-gray-200 bg-gray-50 shadow-sm"
            : "border-transparent hover:border-gray-200 hover:bg-gray-50",
        )}
      >
        {/* avatar with online ring */}
        <div className="relative shrink-0">
          <Avatar name={user.fullName} size="sm" className="size-8" />
          <span
            className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-emerald-500"
            aria-label="Đang hoạt động"
          />
        </div>

        {/* name + role */}
        <div className="hidden flex-col items-start leading-tight lg:flex">
          <span className="max-w-[120px] truncate text-[13px] font-semibold text-gray-800">
            {user.fullName}
          </span>
          <span className="text-[11px] text-gray-500">{roleLabels[user.role]}</span>
        </div>

        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-gray-400 transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-gray-100/80 bg-white shadow-xl shadow-black/[0.08] ring-1 ring-black/[0.04]"
        >
          {/* identity */}
          <div className="bg-gradient-to-br from-gray-50 to-white px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <Avatar name={user.fullName} size="md" />
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">{user.fullName}</p>
                <p className="truncate text-xs text-gray-500">{user.email}</p>
                <span
                  className={cn(
                    "mt-1.5 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
                    roleColors[user.role],
                  )}
                >
                  {roleLabels[user.role]}
                </span>
              </div>
            </div>
          </div>

          {/* shift status */}
          <div className="border-t border-gray-100 px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-gray-700">Ca sáng</span>
              </div>
              <span className="text-xs text-gray-400">07:00 – 15:00</span>
            </div>
          </div>

          {/* menu items */}
          <div className="border-t border-gray-100 py-1.5">
            <button
              role="menuitem"
              className="flex w-full items-center gap-3 px-5 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <User className="size-4 text-gray-400" />
              Hồ sơ cá nhân
            </button>
            <Link
              href="/settings"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Settings className="size-4 text-gray-400" />
              Cài đặt hệ thống
            </Link>
          </div>

          <div className="border-t border-gray-100 py-1.5">
            <button
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-5 py-2.5 text-sm text-error transition-colors hover:bg-error-light"
            >
              <LogOut className="size-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Breadcrumb ───────────────────────────────────────────────────────────────

function Breadcrumb({ section, title }: { section: string | null; title: string }) {
  if (!section) return <span className="text-sm font-semibold text-gray-800">{title}</span>;
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
      <span className="text-sm text-gray-400">{section}</span>
      <ChevronRight className="size-3.5 text-gray-300" />
      <span className="text-sm font-semibold text-gray-800">{title}</span>
    </nav>
  );
}

// ── AppHeader ─────────────────────────────────────────────────────────────────

export function AppHeader() {
  const pathname = usePathname();
  const currentUser = useCurrentUser();
  console.log("currentUser", currentUser);
  const [scrolled, setScrolled] = useState(false);

  // shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { title, section } = getPageInfo(pathname);

  return (
    <header
      role="banner"
      className={cn(
        "sticky top-0 z-40 w-full shrink-0 border-b border-gray-100 bg-white/95 backdrop-blur-md transition-shadow duration-200",
        scrolled ? "shadow-[0_2px_16px_0_rgba(0,0,0,0.07)]" : "shadow-none",
      )}
    >
      <div className="flex h-[72px] items-center gap-6 px-6 xl:px-8">

        {/* ── LEFT: Branding + page context ── */}
        <div className="flex shrink-0 items-center gap-5">
          {/* Hospital logo */}
          {/* <Link
            href="/"
            aria-label="Y Khoa Vạn Hạnh — Trang chủ"
            className="flex shrink-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" className="size-5 text-white" aria-hidden>
                <path
                  d="M12 3v18M3 12h18M7 7l10 10M17 7L7 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="hidden xl:block">
              <p className="text-[13px] font-bold leading-tight text-gray-900 tracking-tight">
                Y Khoa Vạn Hạnh
              </p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
                Hospital System
              </p>
            </div>
          </Link> */}

          {/* vertical divider */}
          <div className="hidden h-8 w-px bg-gray-100 xl:block" aria-hidden />

          {/* page breadcrumb */}
          <div aria-live="polite" aria-atomic className="hidden xl:block">
            <Breadcrumb section={section} title={title} />
          </div>
        </div>

        {/* ── CENTER: Search ── */}
        <div className="flex-1 px-4 xl:px-8">
          <div className="mx-auto max-w-lg">
            <GlobalSearch />
          </div>
        </div>

        {/* ── RIGHT: Actions + Profile ── */}
        <div className="flex shrink-0 items-center gap-2">
          <LiveClock />

          <div className="mx-1 h-6 w-px bg-gray-100" aria-hidden />

          <EmergencyButton />
          <NotificationBell />

          <div className="mx-1 h-6 w-px bg-gray-100" aria-hidden />

          {currentUser ? (
            <UserMenu user={currentUser} />
          ) : (
            /* Skeleton placeholder while loading */
            <div className="flex h-10 w-40 animate-pulse items-center gap-2.5 rounded-xl border border-gray-100 px-3">
              <div className="size-8 rounded-full bg-gray-100" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2 w-20 rounded bg-gray-100" />
                <div className="h-1.5 w-14 rounded bg-gray-100" />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
