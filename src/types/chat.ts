/**
 * Chat CSKH - Type Definitions
 */

// ─── Enums ──────────────────────────────────────────────────────────────────

export type ConversationStatus = "new" | "in_progress" | "closed";
export type MessageType = "user" | "staff" | "system";
export type LogAction =
  | "created"
  | "assigned"
  | "reassigned"
  | "status_changed"
  | "replied"
  | "note_added";

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface ChatUser {
  id: string;
  name?: string;
  full_name?: string;
  phone?: string;
  avatar?: string;
}

export interface Conversation {
  id: string;
  /** ID bệnh nhân trong HIS (null nếu không phải bệnh nhân) */
  patient_id?: string | null;
  patient?: ChatUser;
  /** Người tạo cuộc chat */
  user?: ChatUser;
  /** Người được gán xử lý */
  assigned_to?: ChatUser | null;
  /** ID nhân viên được gán */
  assigned_to_id?: string | null;
  status: ConversationStatus;
  /** Tiêu đề/tóm tắt – thường là tin nhắn đầu tiên */
  title?: string;
  /** Tin nhắn cuối cùng */
  last_message?: string;
  last_message_at?: string;
  /** Số tin nhắn chưa đọc */
  unread_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender?: ChatUser;
  sender_type: MessageType;
  content: string;
  /** Loại tệp đính kèm: image | file | null */
  attachment_type?: "image" | "file" | null;
  attachment_url?: string | null;
  attachment_name?: string | null;
  is_edited?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConversationLog {
  id: string;
  conversation_id: string;
  action: LogAction;
  actor_id: string;
  actor?: ChatUser;
  /** Mô tả hành động */
  description: string;
  /** Metadata bổ sung: { from: "new", to: "in_progress" } */
  metadata?: Record<string, unknown>;
  created_at: string;
}

// ─── Internal Note ────────────────────────────────────────────────────────────

export interface InternalNote {
  id: string;
  conversation_id: string;
  author_id: string;
  author?: ChatUser;
  content: string;
  created_at: string;
}

// ─── API Request / Response ──────────────────────────────────────────────────

export interface ConversationListParams {
  status?: ConversationStatus;
  assigned_to_id?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface ConversationListResponse {
  items: Conversation[];
  total: number;
  page: number;
  per_page: number;
}

export interface SendMessagePayload {
  content: string;
  attachment_url?: string;
  attachment_type?: "image" | "file";
}

export interface AssignConversationPayload {
  assigned_to_id: string;
}

export interface UpdateStatusPayload {
  status: ConversationStatus;
}

export interface ReopenConversationPayload {
  content: string;
}
