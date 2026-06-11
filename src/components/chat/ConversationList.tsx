"use client";

import { useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { useConversations } from "@/api/chatApi";
import { cn } from "@/lib/utils";
import type { Conversation, ConversationStatus } from "@/types/chat";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Search, User, Smartphone } from "lucide-react";

// ─── Inline Skeleton ────────────────────────────────────────────────────────────

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

// ─── Status Config ──────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<ConversationStatus, string> = {
  new: "Mới",
  in_progress: "Đang xử lý",
  closed: "Đã đóng",
};

const STATUS_STYLES: Record<ConversationStatus, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200",
  closed: "bg-gray-50 text-gray-500 border-gray-200",
};

const STATUS_DOT_COLORS: Record<ConversationStatus, string> = {
  new: "bg-blue-500",
  in_progress: "bg-amber-500",
  closed: "bg-gray-400",
};

// ─── Tab Filter ────────────────────────────────────────────────────────────────

type FilterTab = "all" | ConversationStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "new", label: "Mới" },
  { key: "in_progress", label: "Đang xử lý" },
  { key: "closed", label: "Đã đóng" },
];

// ─── Conversation Item ─────────────────────────────────────────────────────────

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-3 rounded-lg transition-all duration-150",
        "hover:bg-muted/60",
        isActive
          ? "bg-primary-50 border border-primary-200"
          : "border border-transparent"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Avatar
            name={conversation.user?.full_name ?? "?"}
            src={conversation.user?.avatar}
            size="sm"
          />
          {conversation.unread_count && conversation.unread_count > 0 && (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {conversation.unread_count > 9 ? "9+" : conversation.unread_count}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "text-sm truncate",
                isActive ? "text-primary-900 font-semibold" : "text-foreground font-medium",
                conversation.unread_count && conversation.unread_count > 0 ? "font-semibold" : "font-normal"
              )}
            >
              {conversation.user?.full_name ?? "Người dùng"}
            </span>
            {conversation.last_message_at && (
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {formatTime(conversation.last_message_at)}
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {conversation.title || conversation.last_message || "Không có nội dung"}
          </p>

          <div className="flex items-center justify-between gap-2 mt-1.5">
            {/* Status badge with color dot */}
            <div className="flex items-center gap-1.5">
              <span
                className={cn("inline-flex h-1.5 w-1.5 rounded-full shrink-0", STATUS_DOT_COLORS[conversation.status])}
              />
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0 h-4 font-medium border rounded-4xl inline-flex items-center justify-center",
                  STATUS_STYLES[conversation.status]
                )}
              >
                {STATUS_LABELS[conversation.status]}
              </span>
            </div>

            {/* Channel + patient indicator */}
            <div className="flex items-center gap-1.5">
              {conversation.patient_id && (
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <User className="size-2.5" />
                  BN
                </span>
              )}
              <Smartphone className="size-2.5 text-muted-foreground/60" />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Skeleton Item ──────────────────────────────────────────────────────────────

function SkeletonItem() {
  return (
    <div className="px-3 py-3">
      <div className="flex items-start gap-3">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-2.5 w-full" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins}ph`;
  if (diffHours < 24) return `${diffHours}gi`;
  if (diffDays < 7) return `${diffDays}ngày`;
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

// ─── Conversation List ─────────────────────────────────────────────────────────

export function ConversationList() {
  const {
    selectedConversationId,
    setSelectedConversationId,
    filters,
    setFilters,
  } = useChatStore();

  const { data, isLoading, isFetching } = useConversations(filters);

  // Sync API data to store cache
  useEffect(() => {
    if (data?.items) {
      useChatStore.getState().setConversationsCache(data.items);
    }
  }, [data]);

  const conversations = data?.items ?? useChatStore.getState().conversationsCache;
  const total = data?.total ?? 0;

  // Count per status for tab badges
  const countByStatus = (status: FilterTab) => {
    if (status === "all") return total;
    return conversations.filter((c) => c.status === status).length;
  };

  const activeFilter = filters.status ?? "all";

  return (
    <div className="flex h-full flex-col">
      {/* ── Header ── */}
      <div className="shrink-0 px-3 pt-3 pb-2 space-y-2 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Tin nhắn</h2>
          <span className="text-xs text-muted-foreground">{total} cuộc</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Tìm tên, nội dung..."
            className="h-8 pl-8 text-xs"
            value={filters.search ?? ""}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value || undefined })
            }
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.key;
            const count = countByStatus(tab.key);
            return (
              <button
                key={tab.key}
                onClick={() =>
                  setFilters({
                    ...filters,
                    status: tab.key === "all" ? undefined : (tab.key as ConversationStatus),
                  })
                }
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150",
                  isActive
                    ? "bg-primary-600 text-white shadow-sm"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted"
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto px-2 py-1.5 space-y-0.5 scrollbar-thin">
        {isLoading ? (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonItem key={i} />
            ))}
          </>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <p className="text-sm text-muted-foreground">Không có cuộc hội thoại nào</p>
          </div>
        ) : (
          <>
            {isFetching && !isLoading && (
              <div className="flex items-center justify-center py-2">
                <span className="text-xs text-muted-foreground animate-pulse">
                  Đang tải...
                </span>
              </div>
            )}
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === selectedConversationId}
                onClick={() => setSelectedConversationId(conv.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
