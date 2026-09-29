import { apiClient } from "./apiClient";

export type NotificationType = "DEADLINE_STUDENT" | "DEADLINE_TEACHER" | "MENTION";

export interface AppNotification {
  _id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  metadata?: {
    assignmentId?: string;
    classroomId?: string;
    commentId?: string;
    authorUsername?: string;
    authorName?: string;
    assignmentTitle?: string;
    dueDate?: string;
    shareText?: string;
  };
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: AppNotification[];
  unreadCount: number;
}

/**
 * Fetch current user's notifications
 */
export const getMyNotifications = async (limit = 25): Promise<NotificationsResponse> => {
  const response = await apiClient.get<NotificationsResponse>(`/api/notifications?limit=${limit}`);
  return response.data;
};

/**
 * Mark a single notification as read
 */
export const markNotificationRead = async (id: string): Promise<{ updated: AppNotification; unreadCount: number }> => {
  const response = await apiClient.patch<{ updated: AppNotification; unreadCount: number }>(`/api/notifications/${id}/read`);
  return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async (): Promise<{ success: boolean; unreadCount: number }> => {
  const response = await apiClient.patch<{ success: boolean; unreadCount: number }>("/api/notifications/read-all");
  return response.data;
};
