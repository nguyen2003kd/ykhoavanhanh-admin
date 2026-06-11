"use client";

import { ConversationList } from "@/components/chat/ConversationList";
import { ConversationDetail } from "@/components/chat/ConversationDetail";

export default function ChatsPage() {
  return (
    <div className="flex h-[calc(100vh-8.5rem)] overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      {/* Left panel — conversation list */}
      <div className="w-80 shrink-0 border-r border-border overflow-hidden">
        <ConversationList />
      </div>

      {/* Right panel — conversation detail */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <ConversationDetail />
      </div>
    </div>
  );
}
