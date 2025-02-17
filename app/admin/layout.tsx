'use client';

import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className='flex min-h-screen'>
        <AppSidebar />
        <main className='flex-1 m-4'>
          <SidebarTrigger />
          <div className='m-10'>{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
