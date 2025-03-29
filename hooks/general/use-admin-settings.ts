import { useApiQuery, useApiMutation } from '@/hooks/tanstack-query';

export const useAdminSettings = <T>() => {
  const contactDetailsQuery = useApiQuery<T>({
    key: 'siteContactDetails',
    url: '/contact-details',
  });

  const logoQuery = useApiQuery<T>({
    key: 'logoUrl',
    url: '/settings/logo',
  });

  const recentImagesQuery = useApiQuery<T>({
    key: 'recentProjects',
    url: '/recent-projects',
  });

  const maintenanceModeQuery = useApiQuery<T>({
    key: 'maintenanceMode',
    url: '/maintenance-mode',
  });

  return {
    contactDetailsQuery,
    logoQuery,
    recentImagesQuery,
    maintenanceModeQuery,
  };
};

export const useSettingsActions = <T>() => {
  const storeContactDetails = useApiMutation<T>({
    url: '/contact-details',
    method: 'POST',
    contentType: 'application/json',
    auth: true,
  });
  const deleteContactDetail = useApiMutation<T>({
    url: '/contact-details',
    method: 'DELETE',
    contentType: 'application/json',
    auth: true,
  });
  const uploadLogo = useApiMutation<T>({
    url: '/settings/logo',
    method: 'POST',
    contentType: 'multipart/form-data',
    auth: true,
  });
  const uploadRecentProjectImage = useApiMutation<T>({
    url: '/recent-projects',
    method: 'POST',
    contentType: 'multipart/form-data',
    auth: true,
  });
  const deleteRecentProjectImage = useApiMutation<T>({
    url: '/recent-projects',
    method: 'DELETE',
    contentType: 'application/json',
    auth: true,
  });
  const toggleMaintenanceMode = useApiMutation<T>({
    url: '/settings/maintenance-mode',
    method: 'POST',
    contentType: 'application/json',
    auth: true,
  });
  return {
    storeContactDetails,
    deleteContactDetail,
    uploadLogo,
    uploadRecentProjectImage,
    deleteRecentProjectImage,
    toggleMaintenanceMode,
  };
};
