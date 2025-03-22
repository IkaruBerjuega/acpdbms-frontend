import Dashboard from '@/components/ui/admin/dashboard/dashboard';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Page() {
  const breadCrumbs = [
    {
      href: '',
      pageName: 'Admin',
      active: false,
    },
    {
      href: '',
      pageName: 'Dashboard',
      active: true,
    },
  ];

  return (
    <main className='w-full h-full flex-col-start gap-2'>
      <SidebarTrigger breadcrumbs={breadCrumbs} />
      <Dashboard />
    </main>
  );
}
