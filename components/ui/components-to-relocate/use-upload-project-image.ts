'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

// Helper function for fetch with auth and error handling
const fetchWithAuth = async (url: string, method: string, body?: FormData) => {
  try {
    const options: RequestInit = {
      method,
      credentials: 'include',
    };

    if (body) {
      options.body = body;
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

export const useUpdateProjectImage = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: uploadPhoto,
    error,
    isPending,
  } = useMutation({
    mutationKey: ['updateProjectImage'],
    mutationFn: async ({
      data,
      projectId,
    }: {
      data: FormData;
      projectId: string;
    }) => {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/project-view/${projectId}/update-image`,
        'POST',
        data
      );
      if (!response) throw new Error('Image upload failed');
      return response.message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectDetails'] });
    },
  });

  return {
    uploadPhoto,
    error,
    isPending,
  };
};
