'use client';

import { useApiQuery, useApiMutation } from '@/hooks/tanstack-query-hook';
import { ProjectDetailsInterface } from '@/lib/definitions';

export const useViewProject = (id: string) => {
  const projectDetails = useApiQuery<ProjectDetailsInterface[]>({
    key: ['project', id],
    url: `/project-view/${id}`,
  });
  return {
    projects: projectDetails.data ?? [], // Ensure projects is always an array
    isLoading: projectDetails.isLoading,
    isError: !!projectDetails.error,
    error: projectDetails.error,
  };
};

export function useEditProject(id: string) {
  return useApiMutation<FormData>({
    url: `/project-view/${id}`,
    method: 'PUT',
    contentType: 'multipart/form-data',
    auth: true, // Assumes authentication is required for creating a project
  });
}
