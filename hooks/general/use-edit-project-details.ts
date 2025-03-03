'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProjectDetailsType } from '@/lib/form-constants/project-constants';

// Helper function for fetch with error handling
const fetchWithAuth = async (url: string, method: string, body?: any) => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for auth if using cookie-based auth
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const useProjectViewEdit = (id: string) => {
  const queryClient = useQueryClient();

  // Query key for this specific project
  const projectQueryKey = ['project', id];

  // Fetch project details
  const {
    data: projectDetails,
    error: queryError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: projectQueryKey,
    queryFn: async () => {
      const data = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/project-view/${id}`,
        'GET'
      );
      return data as ProjectDetailsType;
    },
    enabled: !!id, // Only run query if id exists
  });

  // Update project details
  const { mutateAsync: updateProjectDetails, error: mutationError } =
    useMutation({
      mutationFn: async (data: ProjectDetailsType) => {
        const formattedData = {
          ...data,
          zip_code: String(data.zip_code),
        };

        return fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
          'PUT',
          formattedData
        );
      },
      onSuccess: () => {
        // Invalidate and refetch the project data after successful update
        queryClient.invalidateQueries({ queryKey: projectQueryKey });
      },
    });

  // Combine errors from query and mutation
  const error =
    queryError || mutationError
      ? (queryError as Error)?.message ||
        (mutationError as Error)?.message ||
        'An error occurred'
      : '';

  return {
    updateProjectDetails,
    fetchProjectDetails: refetch,
    projectDetails,
    error,
    loading: isLoading,
  };
};
