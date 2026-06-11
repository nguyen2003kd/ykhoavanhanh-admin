/**
 * Chat CSKH - Zustand Store
 * Quản lý UI state cho trang quản lý chat
 */

import { create } from "zustand";
import type { Conversation, ConversationStatus } from "@/types/chat";

interface ConversationFilters {
  status?: ConversationStatus;
  assigned_to_id?: string;
  search?: string;
}

interface ChatStore {
  // ── Selected conversation ────────────────────────────────────────────────
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;

  // ── Filters ─────────────────────────────────────────────────────────────
  filters: ConversationFilters;
  setFilters: (filters: ConversationFilters) => void;
  resetFilters: () => void;

  // ── Right panel state ───────────────────────────────────────────────────
  /** Tab đang active trong panel phải: "messages" | "notes" | "logs" */
  activeDetailTab: "messages" | "notes" | "logs";
  setActiveDetailTab: (tab: "messages" | "notes" | "logs") => void;

  // ── Optimistic updates ──────────────────────────────────────────────────
  /** Cache cục bộ để optimistic update trạng thái conversation */
  conversationsCache: Conversation[];
  setConversationsCache: (items: Conversation[]) => void;
  updateConversationInCache: (id: string, updates: Partial<Conversation>) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  // ── Selected ────────────────────────────────────────────────────────────
  selectedConversationId: null,
  setSelectedConversationId: (id) =>
    set({ selectedConversationId: id, activeDetailTab: "messages" }),

  // ── Filters ─────────────────────────────────────────────────────────────
  filters: {},
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: {} }),

  // ── Detail tabs ─────────────────────────────────────────────────────────
  activeDetailTab: "messages",
  setActiveDetailTab: (tab) => set({ activeDetailTab: tab }),

  // ── Cache ───────────────────────────────────────────────────────────────
  conversationsCache: [],
  setConversationsCache: (items) => set({ conversationsCache: items }),
  updateConversationInCache: (id, updates) =>
    set((state) => ({
      conversationsCache: state.conversationsCache.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),
}));
