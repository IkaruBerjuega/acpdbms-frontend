import ClientAccView from '@/components/ui/admin/accounts/view-edit-contents.tsx/client-account-view';
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
            href: '/admin/accounts?tab=Client',
            active: false,
          },
          {
            pageName: 'View Account Details',
            href: `/admin/accounts/client/${id}/view`,
            active: true,
          },
        ]}
      />
      <ClientAccView
        id={id}
        edit={edit}
      />
    </main>
  );
}
