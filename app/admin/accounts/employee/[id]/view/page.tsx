import EmpAccView from '@/components/ui/admin/accounts/view-edit-contents.tsx/employee-account-view';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ edit?: string }>;
}) {
  // await the route parameters before using them
  const { id } = await params;
  const { edit = '' } = (await Promise.resolve(searchParams)) || { edit: '' };

  return (
    <main className='w-full h-auto flex justify-center flex-col'>
      <SidebarTrigger
        breadcrumbs={[
          {
            pageName: 'Accounts',
            href: '/admin/accounts?tab=Employee',
            active: false,
          },
          {
            pageName: 'View Account Details',
            href: `/admin/accounts/employee/${id}/view`,
            active: true,
          },
        ]}
      />
      <EmpAccView
        id={id}
        edit={edit}
      />
    </main>
  );
}
