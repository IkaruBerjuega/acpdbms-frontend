import {
  requestAPI,
  useApiMutation,
  useApiQuery,
} from "@/hooks/tanstack-query";
import {
  ProjectListResponseInterface,
  UserDetailsResponse,
} from "@/lib/definitions";
import {
  adminUpdateProfile,
  updateProfile,
} from "@/lib/form-constants/form-constants";

// fetches profile and projects for employees and clients
export const useProfile = (
  userId: string,
  initialData?: UserDetailsResponse
) => {
  // get profile details
  const { data: profileDetails, error: profileError } =
    useApiQuery<UserDetailsResponse>({
      key: ["user-details", userId],
      url: `/users/${userId}`,
      enabled: !!userId,
      initialData: initialData,
    });

  // determine project endpoints based on account type
  const ongoingUrl = profileDetails?.client
    ? `/clients/${userId}/projects/ongoing`
    : `/employee/projects/ongoing/${userId}`;

  const finishedUrl = profileDetails?.client
    ? `/clients/${userId}/projects/finished`
    : `/employee/projects/finished/${userId}`;

  // fetch ongoing projects
  const { data: ongoingProjects, error: ongoingError } = useApiQuery<
    ProjectListResponseInterface[]
  >({
    key: `ongoing-projects-${userId}`,
    url: ongoingUrl,
    enabled: !!userId && !!profileDetails,
  });

  // fetch finished projects
  const { data: finishedProjects, error: finishedError } = useApiQuery<
    ProjectListResponseInterface[]
  >({
    key: `finished-projects-${userId}`,
    url: finishedUrl,
    enabled: !!userId && !!profileDetails,
  });

  // combine errors
  const error = profileError || ongoingError || finishedError;

  // update profile (non-admin)
  const updateProfileMutation = useApiMutation<updateProfile>({
    url: `/profile`,
    method: "PUT",
    contentType: "application/json",
    auth: true,
  });

  // update profile from admin
  const updateProfileFromAdminMutation = useApiMutation<adminUpdateProfile>({
    url: `/edit-profile/${userId}`,
    method: "PUT",
    contentType: "application/json",
    auth: true,
  });

  // upload profile picture
  const uploadPhoto = useApiMutation<FormData>({
    url: `/profile/update-picture`,
    method: "POST",
    contentType: "multipart/form-data",
    auth: true,
  });

  // deactivate employee from project
  const deactivateEmployeeFromProject = async (teamId: number) => {
    return await requestAPI({
      url: `/teams/${teamId}/deactivate`,
      method: "POST",
      body: null,
      contentType: "application/json",
      auth: true,
    });
  };

  const getAuthenticatedUser = async () => {
    return await requestAPI({
      url: `/user`,
      method: "GET",
      contentType: "application/json",
      auth: true,
    });
  };

  return {
    ongoingProjects,
    finishedProjects,
    profileDetails,
    updateProfileMutation,
    uploadPhoto,
    updateProfileFromAdminMutation,
    deactivateEmployeeFromProject,
    getAuthenticatedUser,
    error,
  };
};
