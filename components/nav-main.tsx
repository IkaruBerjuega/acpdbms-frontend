'use client';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { GrTasks } from 'react-icons/gr';
import { MdSpaceDashboard, MdManageAccounts } from 'react-icons/md';
import { PiFilesFill } from 'react-icons/pi';
import { BiNews } from 'react-icons/bi';
import { usePathname } from 'next/navigation';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const adminNavs = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: MdSpaceDashboard,
    isActive: true,
  },
  {
    title: 'Projects',
    url: '/admin/projects',
    icon: GrTasks,
  },
  {
    title: 'Accounts',
    url: '/admin/accounts',
    icon: MdManageAccounts,
  },
  {
    title: 'Files',
    url: '/admin/files',
    icon: PiFilesFill,
  },
];

const employeeNavs = [
  {
    title: 'TASKS',
    url: '/employee/tasks',
    icon: GrTasks,
  },
  {
    title: 'FEEDS',
    url: '/employee/feeds',
    icon: BiNews,
  },
  {
    title: 'FILES',
    url: '/employee/files',
    icon: PiFilesFill,
  },
];

const clientNavs = [
  {
    title: 'FEEDS',
    url: '/client/feeds',
    icon: BiNews,
  },
  {
    title: 'FILES',
    url: '/client/files',
    icon: PiFilesFill,
  },
];

export function NavMain({ role }: { role: string }) {
  const pathname = usePathname();
  let navs: {
    title: string;
    url: string;
    icon: IconType;
  }[];
  if (role === 'admin') navs = adminNavs;
  else if (role === 'employee') navs = employeeNavs;
  else if (role === 'client') navs = clientNavs;
  else navs = [];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navs.map((nav) => {
          const isActive = pathname.startsWith(nav.url);
          return (
            <SidebarMenuItem key={nav.title}>
              <Link href={nav.url}>
                <SidebarMenuButton size={'default'} asChild tooltip={nav.title}>
                  <div
                    className={`flex space-x-2 p-2 rounded-md ${
                      isActive
                        ? 'bg-red-900 text-primary-foreground font-semibold'
                        : 'text-primary-foreground'
                    }`}
                  >
                    <div className='text-xl'>
                      <nav.icon />
                    </div>
                    <span>{nav.title}</span>
                  </div>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
