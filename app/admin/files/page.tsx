import { Suspense } from 'react';
import FileList from '@/components/ui/components-to-relocate/file-management/file-list';
import { Skeleton } from '@/components/ui/skeleton';
import type { Breadcrumbs, FileListResponseInterface } from '@/lib/definitions';
import { SidebarTrigger } from '@/components/ui/sidebar';
import serverRequestAPI from '@/hooks/server-request';

interface Project {
  id: number;
  project_title: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    archived?: 'true' | 'false';
  };
}) {
  // Ensure `searchParams` is safely accessed
  const getArchivedStatus = () => {
    if (!searchParams) return false;
    return searchParams.archived === 'true';
  };

  const isArchivedFromParams = getArchivedStatus();
  const url = isArchivedFromParams ? '/files-archived' : '/files-list';

  let projects: Project[] = [];
  let initialData: FileListResponseInterface[] = [];

  try {
    // Fetch project list
    const projectsResponse = await serverRequestAPI({
      url: '/project-list',
      auth: true,
    });
    projects = projectsResponse;
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  // Determine isArchived based on initialData
  const isArchived =
    initialData.length > 0
      ? initialData.every((file) => file.is_archived)
      : isArchivedFromParams;

  const breadcrumbs: Breadcrumbs[] = [
    {
      href: '/admin',
      pageName: 'Admin',
      active: false,
    },
    {
      href: '/admin/files',
      pageName: 'Files',
      active: true,
    },
  ];

  return (
    <main className='w-full h-full flex-col-start gap-4'>
      <SidebarTrigger breadcrumbs={breadcrumbs} />
      <div className='flex-grow w-full'>
        <Suspense
          fallback={
            <div className='flex flex-col gap-2'>
              <Skeleton className='h-10 w-full rounded-lg bg-white-primary shadow-md' />
              <Skeleton className='flex-grow rounded-lg bg-white-primary shadow-md h-[600px]' />
            </div>
          }
        >
          <FileList
            isArchived={isArchived}
            initialData={initialData}
            projects={projects}
          />
        </Suspense>
      </div>
    </main>
  );
}
