import axiosInstance from "./axiosInstance";

/** 알림 상태 */
export type NotificationStatus = "NEW" | "UNREAD" | "READ";

/** 알림 타입(멘티 대상) */
export type NotificationType = "REMINDER" | "FEEDBACK" | "LEARNING_REPORT";

export type NotificationItem = {
  notificationId: number;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  taskId: number | null;
  learningReportId: number | null;
  createdAt: string;
};

export type UnreadCountResponse = {
  count: number;
};

/**
 * 알림 목록 조회
 */
export const getNotifications = async (): Promise<NotificationItem[]> => {
  const res = await axiosInstance.get<NotificationItem[]>("/notifications");
  return res.data;
};

/**
 * 읽지 않은 알림 개수 조회 (NEW 상태)
 */
export const getUnreadNotificationCount =
  async (): Promise<UnreadCountResponse> => {
    const res = await axiosInstance.get<UnreadCountResponse>(
      "/notifications/unread-count",
    );
    return res.data;
  };

/**
 * 알림 읽음 처리
 */
export const markNotificationAsRead = async (
  notificationId: number,
): Promise<void> => {
  await axiosInstance.put(`/notifications/${notificationId}/read`);
};
