import {
  requestAPI,
  useApiMutation,
  useApiQuery,
} from '@/hooks/tanstack-query';
import {
  ProjectListResponseInterface,
  UserDetailsResponse,
} from '@/lib/definitions';

// fetches profile and projects for employees and clients
export const useProfile = (userId?: string) => {
  // get profile details
  const {
    data: profileDetails,
    isLoading: profileLoading,
    error: profileError,
  } = useApiQuery<UserDetailsResponse>({
    key: `user-details-${userId}`,
    url: `/users/${userId}`,
    enabled: !!userId,
  });

  // determine project endpoints based on account type
  const ongoingUrl = profileDetails?.client
    ? `/clients/${userId}/projects/ongoing`
    : `/employee/projects/ongoing/${userId}`;

  const finishedUrl = profileDetails?.client
    ? `/clients/${userId}/projects/finished`
    : `/employee/projects/finished/${userId}`;

  // fetch ongoing projects
  const {
    data: ongoingProjects,
    isLoading: ongoingLoading,
    error: ongoingError,
  } = useApiQuery<ProjectListResponseInterface[]>({
    key: `ongoing-projects-${userId}`,
    url: ongoingUrl,
    enabled: !!userId && !!profileDetails,
  });

  // fetch finished projects
  const {
    data: finishedProjects,
    isLoading: finishedLoading,
    error: finishedError,
  } = useApiQuery<ProjectListResponseInterface[]>({
    key: `finished-projects-${userId}`,
    url: finishedUrl,
    enabled: !!userId && !!profileDetails,
  });

  // combine errors
  const error = profileError || ongoingError || finishedError;

  // update profile (non-admin)
  const updateProfileMutation = useApiMutation<any>({
    url: `/profile`,
    method: 'PUT',
    contentType: 'application/json',
    auth: true,
  });

  const updateProfile = async (data: any) => {
    return new Promise((resolve, reject) => {
      updateProfileMutation.mutate(data, {
        onSuccess: (responseData) => resolve(responseData),
        onError: (error) => reject(error),
      });
    });
  };

  // update profile from admin (updated to behave like the non-admin version)
  const updateProfileFromAdminMutation = useApiMutation<any>({
    url: `/users/${userId}/update`,
    method: 'PUT',
    contentType: 'application/json',
    auth: true,
  });

  const updateProfileFromAdmin = async (data: any, id?: string) => {
    return new Promise((resolve, reject) => {
      updateProfileFromAdminMutation.mutate(data, {
        onSuccess: (responseData) => resolve(responseData),
        onError: (error) => reject(error),
      });
    });
  };

  // toggle notifications
  const toggleNotifsMutation = useApiMutation<any>({
    url: `/profile/notifications/${userId}`,
    method: 'PUT',
    contentType: 'application/json',
    auth: true,
  });

  const toggleNotifs = async (data: {
    email_notifications?: boolean;
    system_notifications?: boolean;
  }) => {
    return await toggleNotifsMutation.mutate(data);
  };

  // upload profile picture
  const uploadPhotoMutation = useApiMutation<any>({
    url: `/profile/update-picture`,
    method: 'POST',
    contentType: 'multipart/form-data',
    auth: true,
  });

  const uploadPhoto = async (data: FormData): Promise<any> => {
    return new Promise((resolve, reject) => {
      uploadPhotoMutation.mutate(data, {
        onSuccess: (response) => resolve(response),
        onError: (error) => reject(error),
      });
    });
  };

  // deactivate employee from project
  const deactivateEmployeeFromProject = async (teamId: number) => {
    return await requestAPI({
      url: `/teams/${teamId}/deactivate`,
      method: 'POST',
      body: null,
      contentType: 'application/json',
      auth: true,
    });
  };

  const getAuthenticatedUser = async () => {
    return await requestAPI({
      url: `/user`,
      method: 'GET',
      contentType: 'application/json',
      auth: true,
    });
  };

  return {
    ongoingProjects,
    finishedProjects,
    profileDetails,
    updateProfile,
    uploadPhoto,
    updateProfileFromAdmin,
    toggleNotifs,
    deactivateEmployeeFromProject,
    getAuthenticatedUser,
    error,
  };
};
