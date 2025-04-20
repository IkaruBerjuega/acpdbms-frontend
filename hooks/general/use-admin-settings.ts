import { useApiQuery, useApiMutation } from "@/hooks/tanstack-query";
import {
  DeleteContactPayload,
  DeleteRecentProjectImageRequest,
  DynamicContactSchema,
  LogoResponse,
  MaintenanceModeResponse,
  RecentProjectsResponse,
  StoreContactDetailsRequest,
} from "@/lib/definitions";

export const useAdminSettings = () => {
  const contactDetailsQuery = useApiQuery<DynamicContactSchema>({
    key: "siteContactDetails",
    url: "/contact-details",
  });

  const logoQuery = useApiQuery<LogoResponse>({
    key: "logo",
    url: "/settings/logo",
  });

  const recentImagesQuery = useApiQuery<RecentProjectsResponse>({
    key: "recentProjects",
    url: "/recent-projects",
  });

  const maintenanceModeQuery = useApiQuery<MaintenanceModeResponse>({
    key: "maintenanceMode",
    url: "/maintenance-mode",
  });

  return {
    contactDetailsQuery,
    logoQuery,
    recentImagesQuery,
    maintenanceModeQuery,
  };
};

export const useSettingsActions = <T>() => {
  const storeContactDetails = useApiMutation<StoreContactDetailsRequest>({
    url: "/contact-details",
    method: "POST",
    contentType: "application/json",
    auth: true,
  });
  const deleteContactDetail = useApiMutation<DeleteContactPayload>({
    url: "/contact-details",
    method: "DELETE",
    contentType: "application/json",
    auth: true,
  });

  const uploadLogo = useApiMutation<FormData>({
    url: "/settings/logo",
    method: "POST",
    contentType: "multipart/form-data",
    auth: true,
  });

  const uploadRecentProjectImage = useApiMutation<FormData>({
    url: "/recent-projects",
    method: "POST",
    contentType: "multipart/form-data",
    auth: true,
  });

  const deleteRecentProjectImage =
    useApiMutation<DeleteRecentProjectImageRequest>({
      url: "/recent-projects",
      method: "DELETE",
      contentType: "application/json",
      auth: true,
    });

  const toggleMaintenanceMode = useApiMutation<T>({
    url: "/settings/maintenance-mode",
    method: "POST",
    contentType: "application/json",
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
