import {
  NotificationFilters,
  NotificationsResponse,
  UnseenNotificationCount,
} from "@/lib/notification-definitions";
import { useApiMutation, useApiQuery } from "../tanstack-query";

export const useGetNotifications = ({
  filter,
  page,
  role,
}: NotificationFilters) => {
  const canGetNotifs = Boolean(filter) && Boolean(page);

  const isAdmin = role === "admin";

  return useApiQuery<NotificationsResponse>({
    key: ["notifications", role],
    url: isAdmin
      ? `/admin/notifications?filter=${filter}&page=${page}`
      : `/notifications?filter=${filter}&page=${page}`,
    enabled: canGetNotifs,
  });
};

export const useGetUnseenNotificationsCount = ({
  role,
}: {
  role: NotificationFilters["role"];
}) => {
  const isAdmin = role === "admin";

  return useApiQuery<UnseenNotificationCount>({
    key: ["unseen-notifications-count", role],
    url: isAdmin ? "/tickets/unseen-count" : "/notifications/unseen-count",
  });
};

export default function useNotificationActions({
  id, //ticket id or userNotificationId
  role,
}: {
  id?: string;
  role: NotificationFilters["role"];
}) {
  const isAdmin = role === "admin";

  // mark a notification as seen
  const markAsSeen = useApiMutation<null>({
    url: isAdmin ? `/tickets/${id}/mark-seen` : `/mark-as-seen/${id}`,
    method: "PATCH",
    contentType: "application/json",
    auth: true,
  });

  // mark all notifications as seen
  const markAllSeen = useApiMutation<null>({
    url: isAdmin ? "/tickets/mark-all-seen" : `/notifications/mark-all-seen`,
    method: "PATCH",
    contentType: "application/json",
    auth: true,
  });

  return { markAsSeen, markAllSeen };
}
