'use client';

import {
  getAccountSettings,
  useAccountSettings,
} from '@/hooks/general/use-account-settings';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { NotificationsInterface } from '@/lib/definitions';

export default function NotificationsToggle() {
  const queryClient = useQueryClient();

  const { getUserNotification } = getAccountSettings<NotificationsInterface>();
  const { toggleEmailNotification, toggleSystemNotification } =
    useAccountSettings<any>();

  const {
    data: toggleNotificationData,
    error: toggleNotificationError,
    isLoading: toggleNotificationLoading,
  } = getUserNotification;

  console.log(toggleNotificationData);

  const handleToggleEmail = () => {
    toggleEmailNotification.mutate(undefined, {
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ['notification'] });

        toast({
          title: 'Success',
          description: `Email notifications ${
            response?.email_notifications ? 'enabled' : 'disabled'
          }.`,
        });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description:
            error?.message ||
            'An error occurred while toggling email notifications.',
        });
      },
    });
  };

  const handleToggleSystem = () => {
    toggleSystemNotification.mutate(undefined, {
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ['notification'] });

        toast({
          title: `Success`,
          description: `System notifications ${
            response?.system_notifications ? 'enabled' : 'disabled'
          }.`,
        });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description:
            error?.message ||
            'An error occurred while toggling system notifications.',
        });
      },
    });
  };

  return (
    <div className='space-y-4'>
      {/* Email Notifications Card */}
      <Card>
        <CardHeader className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pb-2'>
          <div className='flex-1'>
            <CardTitle className='text-lg'>Email Notifications</CardTitle>
            <p className='text-sm text-muted-foreground mb-2 sm:mb-4 max-w-full sm:max-w-xl'>
              Receive important account updates and alerts via email.
            </p>
          </div>
          <Switch
            checked={toggleNotificationData?.email_notifications}
            onCheckedChange={handleToggleEmail}
            disabled={toggleNotificationLoading}
          />
        </CardHeader>
        {toggleNotificationError && (
          <CardContent>
            <p className='text-sm text-destructive'>
              Failed to update:{' '}
              {toggleNotificationError.message || 'Unknown error'}
            </p>
          </CardContent>
        )}
      </Card>

      {/* System Notifications Card */}
      <Card>
        <CardHeader className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pb-2'>
          <div className='flex-1'>
            <CardTitle className='text-lg'>System Notifications</CardTitle>
            <p className='text-sm text-muted-foreground mb-2 sm:mb-4 max-w-full sm:max-w-xl'>
              Enable or disable system messages shown while using the app.
            </p>
          </div>
          <Switch
            checked={toggleNotificationData?.system_notifications}
            onCheckedChange={handleToggleSystem}
            disabled={toggleNotificationLoading}
          />
        </CardHeader>
        {toggleNotificationError && (
          <CardContent>
            <p className='text-sm text-destructive'>
              Failed to update:{' '}
              {toggleNotificationError.message || 'Unknown error'}
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
