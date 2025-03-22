'use client';

import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/ui/general/sidebar/app-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-full bg-white-secondary'>
        <AppSidebar />
        <main className='flex-grow flex-col-start m-4 gap-2'>
          <div className='flex-1'>{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
