'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApiQuery, useApiMutation } from '@/hooks/tanstack-query';
import { ProjectDetailsInterface } from '@/lib/definitions';

export const useProjectViewEdit = (id: string) => {
  const [error, setError] = useState<string | null>(null);
  const [projectDetails, setProjectDetails] =
    useState<ProjectDetailsInterface | null>(null);

  // Fetch project details
  const { data, isLoading } = useApiQuery<ProjectDetailsInterface>({
    key: ['project', id],
    url: `/project-view/${id}`,
  });

  useEffect(() => {
    if (data) {
      setProjectDetails(data);
    }
  }, [data]);

  const mutation = useApiMutation<FormData>({
    url: `/project-view/${id}`,
    method: 'PUT',
    contentType: 'multipart/form-data',
    auth: true,
  });

  // Function to update project details
  const updateProjectDetails = useCallback(
    async (formData: FormData) => {
      return new Promise<boolean>((resolve, reject) => {
        mutation.mutate(formData, {
          onSuccess: () => {
            resolve(true);
          },
          onError: (error) => {
            setError(String(error));
            reject(error);
          },
        });
      });
    },
    [mutation]
  );

  return {
    projectDetails,
    isLoading,
    error,
    updateProjectDetails,
  };
};
