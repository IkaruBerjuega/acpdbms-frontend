import { useApiQuery } from '../tanstack-query';

interface UseFileListProps<T> {
  projectId?: string;
  isArchived?: boolean;
  initialData?: T[];
  enabled?: boolean;
}

export const useFilesList = <T>({
  projectId,
  initialData,
}: UseFileListProps<T>) => {
  return useApiQuery<T[]>({
    key: 'files',
    url: `/projects/${projectId}/files`,
    initialData,
  });
};
