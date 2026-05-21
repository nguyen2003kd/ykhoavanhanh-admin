export type NotificationChannel = "app" | "zalo" | "sms" | "email";
export type NotificationType = "appointment" | "marketing" | "content" | "membership" | "system";

export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  channels: NotificationChannel[];
  targetAudience: "all" | "members" | "specific";
  targetPatientIds?: string[];
  scheduledAt?: string;
  sentAt?: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  sentCount?: number;
  failedCount?: number;
  createdBy: string;
  createdAt: string;
}
