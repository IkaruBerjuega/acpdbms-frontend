import AccountsTableHeaderActions from '@/components/ui/admin/accounts/table-header';
import Table from '@/components/ui/admin/accounts/table';
import { Suspense } from 'react';
export default function Page() {
  return (
    <main className='w-full h-full flex-col-start gap-2'>
      <AccountsTableHeaderActions />
      <div className='flex-grow bg-white-primary rounded-b-lg shadow-md system-padding'>
        <Table />
      </div>
    </main>
  );
}
