import { useApiMutation, useApiQuery } from '../tanstack-query';

export const getAccountSettings = <T,>() => {
  const getUser = useApiQuery<T>({
    key: 'user',
    url: '/user',
  });
  const getUserNotification = useApiQuery<T>({
    key: 'notification',
    url: `/user/notifications`,
  });
  return { getUser, getUserNotification };
};

export const useAccountSettings = <T,>() => {
  const updatePicture = useApiMutation<T>({
    url: '/profile/update-picture',
    method: 'POST',
    contentType: 'multiform/data',
    auth: true,
  });
  const updateProfile = useApiMutation<T>({
    url: '/profile',
    method: 'PUT',
    contentType: 'application/json',
    auth: true,
  });
  const checkEmail = useApiMutation<T>({
    url: `/check-email`,
    method: 'POST',
    contentType: 'application/json',
    auth: true,
  });
  const toggleEmailNotification = useApiMutation<T>({
    url: '/profile/toggle-email-notifications',
    method: 'PATCH',
    contentType: 'application/json',
    auth: true,
  });
  const toggleSystemNotification = useApiMutation<T>({
    url: '/profile/toggle-system-notifications',
    method: 'PATCH',
    contentType: 'application/json',
    auth: true,
  });
  const send2FA = useApiMutation<T>({
    url: '/send-2fa-code',
    method: 'POST',
    contentType: 'application/json',
    auth: true,
  });
  const update2FA = useApiMutation<T>({
    url: '/2fa-email-update',
    method: 'POST',
    contentType: 'application/json',
    auth: true,
  });
  const changePass = useApiMutation<T>({
    url: '/password-change',
    method: 'POST',
    contentType: 'application/json',
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
