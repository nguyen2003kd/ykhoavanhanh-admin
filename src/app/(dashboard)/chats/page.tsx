"use client";

import { ConversationList } from "@/components/chat/ConversationList";
import { ConversationDetail } from "@/components/chat/ConversationDetail";

export default function ChatsPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 rounded-2xl overflow-hidden border border-border bg-background shadow-sm">
      {/* ── Left pane: conversation list ── */}
      <div className="w-80 shrink-0 border-r border-border flex flex-col bg-background">
        <ConversationList />
      </div>

      {/* ── Right pane: conversation detail ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        <ConversationDetail />
      </div>
    </div>
  );
}
