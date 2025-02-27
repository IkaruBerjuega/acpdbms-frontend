import { useApiQuery } from '@/hooks/tanstack-query-hook';
import { ProjectListResponseInterface } from '@/lib/definitions';

export const useProject = () => {
  const projectList = useApiQuery<ProjectListResponseInterface[]>({
    key: 'projects',
    url: '/project-list',
  });

  return {
    projects: projectList.data ?? [], // Ensure projects is always an array
    isLoading: projectList.isLoading,
    isError: !!projectList.error,
    error: projectList.error,
  };
};
