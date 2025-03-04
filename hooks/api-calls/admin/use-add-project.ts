'use client';

import { useApiMutation } from '@/hooks/tanstack-query-hook';

export function useAddProject() {
  return useApiMutation<FormData>({
    url: '/projects',
    method: 'POST',
    contentType: '',
    auth: true,
    additionalHeaders: {
      Accept: 'application/json',
    },
  });
}
