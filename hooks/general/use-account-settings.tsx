import {
  NewEmailCheckRequest,
  Email2FARequest,
  NotificationsInterface,
  UserInfoInterface,
  UpdateEmailRequest,
  UpdateUserInfoRequest,
  PasswordChangeRequest,
} from "@/lib/user-definitions";
import { useApiMutation, useApiQuery } from "../tanstack-query";

export const getAccountSettings = () => {
  const getUser = useApiQuery<UserInfoInterface>({
    key: "user",
    url: "/user",
  });
  const getUserNotification = useApiQuery<NotificationsInterface>({
    key: "notification",
    url: `/user/notifications`,
  });
  return { getUser, getUserNotification };
};

export const useAccountSettings = () => {
  const updatePicture = useApiMutation<FormData>({
    url: "/profile/update-picture",
    method: "POST",
    contentType: "multiform/data",
    auth: true,
  });
  const updateProfile = useApiMutation<UpdateUserInfoRequest>({
    url: "/profile",
    method: "PUT",
    contentType: "application/json",
    auth: true,
  });
  const checkEmail = useApiMutation<NewEmailCheckRequest>({
    url: `/check-email`,
    method: "POST",
    contentType: "application/json",
    auth: true,
  });
  const toggleEmailNotification = useApiMutation<null>({
    url: "/profile/toggle-email-notifications",
    method: "PATCH",
    contentType: "application/json",
    auth: true,
  });
  const toggleSystemNotification = useApiMutation<null>({
    url: "/profile/toggle-system-notifications",
    method: "PATCH",
    contentType: "application/json",
    auth: true,
  });
  const send2FA = useApiMutation<Email2FARequest>({
    url: "/send-2fa-code",
    method: "POST",
    contentType: "application/json",
    auth: true,
  });
  const update2FA = useApiMutation<UpdateEmailRequest>({
    url: "/2fa-email-update",
    method: "POST",
    contentType: "application/json",
    auth: true,
  });
  const changePass = useApiMutation<PasswordChangeRequest>({
    url: "/password-change",
    method: "POST",
    contentType: "application/json",
    auth: true,
  });
  return {
    updatePicture,
    updateProfile,
    checkEmail,
    toggleEmailNotification,
    toggleSystemNotification,
    send2FA,
    update2FA,
    changePass,
  };
};
