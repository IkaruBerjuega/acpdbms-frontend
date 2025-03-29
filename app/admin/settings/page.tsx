'use client';

import { useState } from 'react';
import type { Breadcrumbs } from '@/lib/definitions';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ContactSettingsPage } from '@/components/ui/components-to-relocate/ContactSettings';
import { AdminTools } from '@/components/ui/components-to-relocate/AdminTools';

// Assuming this is app/admin/settings/page.tsx
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>('contacts');

  const routeMap = [
    {
      href: '/admin/settings/contacts', // Kept for breadcrumbs, but not used for routing
      pageName: 'Contact Details',
      value: 'contacts',
    },
    {
      href: '/admin/settings/tools', // Kept for breadcrumbs, but not used for routing
      pageName: 'Admin Tools',
      value: 'tools',
    },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const currentRoute =
    routeMap.find((route) => route.value === activeTab) || routeMap[0];

  const breadcrumbs: Breadcrumbs[] = [
    {
      href: '/admin',
      pageName: 'Admin',
      active: false,
    },
    {
      href: currentRoute.href, // Still useful for breadcrumbs display
      pageName: currentRoute.pageName,
      active: true,
    },
  ];

  return (
    <main className='w-full h-full flex-col-start gap-2'>
      <div className='flex items-center'>
        <SidebarTrigger breadcrumbs={breadcrumbs} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your site settings and configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-2 mb-6'>
              <TabsTrigger value='contacts'>Contact Details</TabsTrigger>
              <TabsTrigger value='tools'>Admin Tools</TabsTrigger>
            </TabsList>
            <TabsContent value='contacts'>
              <ContactSettingsPage />
            </TabsContent>
            <TabsContent value='tools'>
              <AdminTools />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
