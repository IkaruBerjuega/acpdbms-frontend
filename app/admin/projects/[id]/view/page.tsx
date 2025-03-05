'use client';
import { use } from 'react';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import ProjectView from '@/components/ui/components-to-relocate/project-view';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
};

export default function Page({ params, searchParams }: PageProps) {
  const { id } = use(params);
  const { edit = 'false' } = use(searchParams);
  console.log(edit);
  return (
    <main className='w-full h-auto flex justify-center flex-col'>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Projects',
            href: '/admin/projects',
          },
          {
            label: 'View Project Details',
            href: `/admin/projects/${id}/view`,
            active: true,
          },
        ]}
      />
      <ProjectView id={id} edit={edit} />
    </main>
  );
}
