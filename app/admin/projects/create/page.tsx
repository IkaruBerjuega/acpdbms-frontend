import Breadcrumbs from '@/components/ui/projects/create/breadcrumbs';
import CreateForm from '@/components/ui/projects/create/create-form';

export default function Page() {
  return (
    <main className='flex flex-col w-full h-auto justify-center bg-stone-50 rounded-lg shadow-md p-8'>
      <div className='mb-2'>
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
      </div>
      <CreateForm />
    </main>
  );
}
