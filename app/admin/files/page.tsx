import { Suspense } from 'react';
import FileList from '@/components/ui/components-to-relocate/file-management/file-list';
import { Skeleton } from '@/components/ui/skeleton';
import type { Breadcrumbs, FileListResponseInterface } from '@/lib/definitions';
import { SidebarTrigger } from '@/components/ui/sidebar';
import serverRequestAPI from '@/hooks/server-request';

export default async function Page({
  searchParams,
}: {
  searchParams: {
    archived?: 'true' | 'false';
  };
}) {
  const archived = searchParams.archived === 'true';
  const url = archived ? '/files-archived' : '/files-list';

  // Fetch project list
  const projects = await serverRequestAPI({
    url: '/project-list',
    auth: true,
  });

  const initialData: FileListResponseInterface[] = await serverRequestAPI({
    url,
    auth: true,
  });

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
            <Skeleton className='flex-grow rounded-lg bg-white-primary shadow-md h-[600px]' />
          }
        >
          <FileList isArchived={archived} initialData={initialData} />
        </Suspense>
      </div>
    </main>
  );
}
