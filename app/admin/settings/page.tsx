'use client';

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
import { ContactSettings } from '@/components/ui/components-to-relocate/ContactSettings';
import { AdminTools } from '@/components/ui/components-to-relocate/AdminTools';
import { useQueryParams } from '@/hooks/use-query-params';
import { usePathname, useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { paramsKey, params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Default to 'contacts' if no tab is specified in the URL
  const activeTab = paramsKey['tab'] || 'contacts';

  const tabs = [
    { value: 'contacts', label: 'Contact Details' },
    { value: 'tools', label: 'Admin Tools' },
  ];
  const routeMap = [
    {
      href: '/admin/settings/contacts',
      pageName: 'Contact Details',
      value: 'contacts',
    },
    {
      href: '/admin/settings/tools',
      pageName: 'Admin Tools',
      value: 'tools',
    },
  ];

  const handleTabChange = (value: string) => {
    params.set('tab', value);
    replace(`${pathname}?${params.toString()}`);
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
      href: currentRoute.href,
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
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value='contacts'>
              <ContactSettings />
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
