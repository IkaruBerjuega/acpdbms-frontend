import Breadcrumbs from '@/components/ui/projects/create/breadcrumbs';
import CreateForm from '@/components/ui/projects/create/create-form';

export default function Page() {
  return (
    <main className='flex flex-col gap-5'>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Projects',
            href: '/admin/projects',
          },
          {
            label: 'Add Project',
            href: '/admin/projects/create',
            active: true,
          },
        ]}
      />
      <CreateForm />
    </main>
  );
}
