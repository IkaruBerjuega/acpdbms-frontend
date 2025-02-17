import { IoIosNotifications } from 'react-icons/io';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  useSidebar,
} from '@/components/ui/sidebar';

// Mock notifications data with dates
const notifications = [
  {
    id: 1,
    text: 'Document Added',
    isNew: true,
    date: new Date(2025, 1, 17, 15, 30),
  },
  {
    id: 2,
    text: 'Document Reviewed',
    isNew: false,
    date: new Date(2025, 1, 17, 14, 45),
  },
];

export default function Notifications() {
  const newNotificationsCount = notifications.filter((n) => n.isNew).length;
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size={'default'}
              className='relative data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex flex-row justify-center items-center text-left text-sm leading-tight'>
                <IoIosNotifications className='size-4' />
                <span className='ml-4 truncate'>Notifications</span>
              </div>
              {newNotificationsCount > 0 && (
                <SidebarMenuBadge>{newNotificationsCount}</SidebarMenuBadge>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className='flex flex-col items-start py-2'
              >
                <span className={`${notification.isNew ? 'font-bold' : ''}`}>
                  {notification.text}
                </span>
                <span className='text-xs text-muted-foreground'>
                  {format(notification.date, 'MMM d, yyyy h:mm a')}
                </span>
                {notification.isNew && (
                  <span className='absolute right-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-blue-500'></span>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='text-center'>
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
