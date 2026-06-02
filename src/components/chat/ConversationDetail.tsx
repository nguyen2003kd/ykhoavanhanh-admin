"use client";

import { useRef, useEffect, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import {
  useConversation,
  useMessages,
  useConversationLogs,
  useSendMessage,
  useAssignConversation,
  useUpdateConversationStatus,
  useAddInternalNote,
} from "@/api/chatApi";
import { useUsersList } from "@/api/userApi";
import { cn } from "@/lib/utils";
import type { ConversationStatus, MessageType } from "@/types/chat";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToastStore } from "@/store/toastStore";
import {
  Send,
  Paperclip,
  CheckCheck,
  Clock,
  UserPlus,
  RefreshCcw,
  StickyNote,
  Activity,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

// ─── Inline Components ──────────────────────────────────────────────────────────

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

// ─── Status Config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ConversationStatus,
  { label: string; variant: "default" | "success" | "warning" | "danger" | "info" | "accent" }
> = {
  new: { label: "Mới", variant: "info" },
  in_progress: { label: "Đang xử lý", variant: "warning" },
  closed: { label: "Đã đóng", variant: "default" },
};

// ─── Log Icon ──────────────────────────────────────────────────────────────────

function LogIcon({ action }: { action: string }) {
  const map: Record<string, React.ReactNode> = {
    created: <Activity className="size-3 text-muted-foreground" />,
    assigned: <UserPlus className="size-3 text-blue-600" />,
    reassigned: <RefreshCcw className="size-3 text-purple-600" />,
    status_changed: <RefreshCcw className="size-3 text-amber-600" />,
    replied: <Send className="size-3 text-green-600" />,
    note_added: <StickyNote className="size-3 text-orange-600" />,
  };
  return map[action] ?? <Activity className="size-3 text-muted-foreground" />;
}

// ─── Time Formatter ──────────────────────────────────────────────────────────────

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

// ─── Message Bubble ─────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: {
    id: string;
    sender_type: MessageType;
    content: string;
    attachment_type?: string | null;
    attachment_url?: string | null;
    attachment_name?: string | null;
    created_at: string;
    sender?: { full_name?: string | null; avatar?: string | null };
  };
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender_type === "user";
  const isSystem = message.sender_type === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 text-xs text-muted-foreground">
          <Clock className="size-3" />
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}>
      <Avatar
        name={message.sender?.full_name ?? (isUser ? "Người dùng" : "CSKH")}
        src={message.sender?.avatar}
        size="sm"
      />
      <div
        className={cn(
          "max-w-[75%] flex flex-col gap-0.5",
          isUser ? "items-end" : "items-start"
        )}
      >
        <span className="text-[11px] text-muted-foreground px-1">
          {message.sender?.full_name ?? (isUser ? "Người dùng" : "CSKH")}
        </span>
        <div
          className={cn(
            "rounded-2xl px-3 py-2 text-sm leading-relaxed",
            isUser
              ? "bg-primary-600 text-white rounded-tr-sm"
              : "bg-muted rounded-tl-sm"
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {message.attachment_url && (
          <a
            href={message.attachment_url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-2 mt-1 px-3 py-2 rounded-xl border text-xs",
              isUser
                ? "bg-primary-700 border-primary-500 text-white/90 hover:bg-primary-600"
                : "bg-muted/80 border-border hover:bg-muted"
            )}
          >
            {message.attachment_type === "image" ? (
              <ImageIcon className="size-4 shrink-0" />
            ) : (
              <FileText className="size-4 shrink-0" />
            )}
            <span className="truncate">
              {message.attachment_name || "Tệp đính kèm"}
            </span>
          </a>
        )}

        <span className="text-[10px] text-muted-foreground/70 px-1">
          {formatTime(message.created_at)}
        </span>
      </div>
    </div>
  );
}

// ─── Reply Box ────────────────────────────────────────────────────────────────

function ReplyBox({ conversationId }: { conversationId: string }) {
  const [text, setText] = useState("");
  const sendMessage = useSendMessage();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage.mutate(
      { conversationId, payload: { content: text.trim() } },
      {
        onSuccess: () => {
          setText("");
          textareaRef.current?.focus();
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="border-t border-border bg-white px-4 py-3">
      <div className="flex items-end gap-2">
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
          title="Đính kèm tệp"
        >
          <Paperclip className="size-4" />
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn trả lời... (Enter để gửi, Shift+Enter để xuống dòng)"
            className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-2 pr-12 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] max-h-32 overflow-y-auto"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
        </div>

        <Button
          size="icon"
          disabled={!text.trim() || sendMessage.isPending}
          onClick={handleSend}
          className="size-9 shrink-0 rounded-full"
        >
          {sendMessage.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Internal Notes ───────────────────────────────────────────────────────────

interface NoteItem {
  id: string;
  content: string;
  created_at: string;
  actor?: { full_name?: string | null; avatar?: string | null };
}

function InternalNotesTab({ conversationId }: { conversationId: string }) {
  const [noteText, setNoteText] = useState("");
  const addNote = useAddInternalNote();
  const toast = useToastStore();
  const { data: logs } = useConversationLogs(conversationId);

  const notes: NoteItem[] = (logs ?? [])
    .filter((l) => l.action === "note_added")
    .map((l) => ({
      id: l.id,
      content: l.description,
      created_at: l.created_at,
      actor: l.actor,
    }));

  const handleAdd = () => {
    if (!noteText.trim()) return;
    addNote.mutate(
      { conversationId, content: noteText.trim() },
      {
        onSuccess: () => {
          setNoteText("");
          toast.success("Đã thêm ghi chú nội bộ");
        },
        onError: (err) => toast.error("Lỗi", err.message),
      }
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {notes.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">
            Chưa có ghi chú nội bộ nào
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="flex gap-2.5 py-2.5 border-b border-border/50 last:border-0"
            >
              <Avatar
                name={note.actor?.full_name ?? "CSKH"}
                src={note.actor?.avatar}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium">
                    {note.actor?.full_name ?? "CSKH"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatTime(note.created_at)}
                  </span>
                </div>
                <p className="text-xs text-foreground/80 whitespace-pre-wrap break-words">
                  {note.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-border px-4 py-3">
        <div className="flex gap-2">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Ghi chú nội bộ (chỉ CSKH nhìn thấy)..."
            rows={2}
            className="flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <Button
            size="sm"
            disabled={!noteText.trim() || addNote.isPending}
            onClick={handleAdd}
            className="shrink-0"
          >
            {addNote.isPending ? <Spinner className="size-3" /> : "Thêm"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Logs Tab ─────────────────────────────────────────────────────────────────

function LogsTab({ conversationId }: { conversationId: string }) {
  const { data: logs, isLoading } = useConversationLogs(conversationId);

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="size-6 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-2.5 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <p className="text-xs text-muted-foreground text-center py-8">
        Chưa có lịch sử thao tác
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {logs.map((log) => (
        <div
          key={log.id}
          className="flex items-start gap-3 px-4 py-2.5 border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
        >
          <div className="shrink-0 mt-0.5">
            <LogIcon action={log.action} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-foreground/80">{log.description}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {log.actor?.full_name ?? "Hệ thống"} · {formatTime(log.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Detail Header ───────────────────────────────────────────────────────────

interface DetailHeaderProps {
  conversation: ReturnType<typeof useConversation>["data"];
  isLoading: boolean;
  onStatusChange: (status: ConversationStatus) => void;
  onAssign: (userId: string) => void;
}

function DetailHeader({ conversation, isLoading, onStatusChange, onAssign }: DetailHeaderProps) {
  const { data: users } = useUsersList();
  const statusConfig = conversation ? STATUS_CONFIG[conversation.status] : null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white shrink-0">
      {isLoading ? (
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            name={conversation?.user?.full_name ?? "Người dùng"}
            src={conversation?.user?.avatar}
            size="sm"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {conversation?.user?.full_name ?? "Người dùng"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {statusConfig && (
                <Badge variant={statusConfig.variant}>
                  {statusConfig.label}
                </Badge>
              )}
              {conversation?.patient_id && (
                <Badge variant="accent">Bệnh nhân HIS</Badge>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 shrink-0">
        <Select
          value={conversation?.assigned_to_id ?? undefined}
          onValueChange={(val) => val !== "unassigned" && onAssign(val)}
          placeholder="Gán cho..."
          options={[
            { value: "unassigned", label: "Chưa gán" },
            ...(users?.rows ?? []).map((u) => ({
              value: u.id,
              label: u.full_name ?? u.id,
            })),
          ]}
          className="h-8 text-xs min-w-[130px]"
        />

        {conversation && conversation.status !== "closed" ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange("closed")}
            className="h-8 text-xs gap-1"
          >
            <CheckCheck className="size-3.5" />
            Đóng cuộc chat
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange("in_progress")}
            className="h-8 text-xs gap-1"
          >
            <RefreshCcw className="size-3.5" />
            Mở lại
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Messages Tab ─────────────────────────────────────────────────────────────

function MessagesTab({ conversationId }: { conversationId: string }) {
  const { data: messages, isLoading } = useMessages(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {(!messages || messages.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Send className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Chưa có tin nhắn nào</p>
            <p className="text-xs text-muted-foreground mt-1">
              Tin nhắn của người dùng sẽ xuất hiện ở đây
            </p>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      <ReplyBox conversationId={conversationId} />
    </div>
  );
}

// ─── Conversation Detail (main export) ────────────────────────────────────────

export function ConversationDetail() {
  const { selectedConversationId, activeDetailTab, setActiveDetailTab } = useChatStore();
  const { data: conversation, isLoading } = useConversation(selectedConversationId);
  const updateStatus = useUpdateConversationStatus();
  const assign = useAssignConversation();
  const toast = useToastStore();

  const handleStatusChange = (status: ConversationStatus) => {
    if (!selectedConversationId) return;
    updateStatus.mutate(
      { conversationId: selectedConversationId, payload: { status } },
      {
        onSuccess: () =>
          toast.success(STATUS_CONFIG[status].label + " cuộc chat"),
        onError: (err) => toast.error("Lỗi", err.message),
      }
    );
  };

  const handleAssign = (userId: string) => {
    if (!selectedConversationId) return;
    assign.mutate(
      { conversationId: selectedConversationId, payload: { assigned_to_id: userId } },
      {
        onSuccess: () => toast.success("Đã gán cuộc hội thoại"),
        onError: (err) => toast.error("Lỗi", err.message),
      }
    );
  };

  if (!selectedConversationId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-muted/10">
        <div className="text-center">
          <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Send className="size-7 text-muted-foreground" />
          </div>
          <p className="text-base font-semibold text-foreground">
            Chọn một cuộc hội thoại
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Chọn cuộc hội thoại từ danh sách bên trái để xem chi tiết
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background border-l border-border">
      <DetailHeader
        conversation={conversation}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        onAssign={handleAssign}
      />

      <div className="shrink-0 border-b border-border">
        <Tabs
          activeKey={activeDetailTab}
          onChange={(key) =>
            setActiveDetailTab(key as "messages" | "notes" | "logs")
          }
          tabs={[
            { key: "messages", label: "Tin nhắn" },
            { key: "notes", label: "Ghi chú nội bộ" },
            { key: "logs", label: "Lịch sử" },
          ]}
          className="px-4"
        />
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {activeDetailTab === "messages" && (
          <MessagesTab conversationId={selectedConversationId} />
        )}
        {activeDetailTab === "notes" && (
          <InternalNotesTab conversationId={selectedConversationId} />
        )}
        {activeDetailTab === "logs" && (
          <div className="flex-1 overflow-y-auto">
            <LogsTab conversationId={selectedConversationId} />
          </div>
        )}
      </div>
    </div>
  );
}
