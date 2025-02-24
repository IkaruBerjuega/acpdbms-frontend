import { useApiQuery } from '@/hooks/tanstack-query-hook';

export const useProject = () => {
  const projectList = useApiQuery<Project[]>({
    key: 'projects',
    url: '/project-list',
  });

  return {
    projectList,
  };
};
