'use client';

import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/ui/general/sidebar/app-sidebar';
import { ProjectProvider } from '@/lib/context/project-context'; // Import ProjectProvider

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ProjectProvider>
        <div className='flex min-h-screen'>
          <AppSidebar />
          <main className='flex-1 m-4'>
            <SidebarTrigger />
            <div className='m-10'>{children}</div>
          </main>
        </div>
      </ProjectProvider>
    </SidebarProvider>
  );
}
