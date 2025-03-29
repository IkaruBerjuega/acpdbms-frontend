'use client';

import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from '../../alert-dialog';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryParams } from '@/hooks/use-query-params';
import { usePathname, useRouter } from 'next/navigation';

interface ApiMutationResult<T> {
  mutate: (
    body?: T,
    options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: any) => void;
    }
  ) => void;
  isLoading: boolean;
  data: any;
  error: string | undefined;
}

export function MaintenanceToggle({
  toggleMaintenanceMode,
  maintenanceMode,
}: {
  toggleMaintenanceMode: ApiMutationResult<void>;
  maintenanceMode: boolean;
}) {
  const queryClient = useQueryClient();
  const { paramsKey, params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const isConfirmOpen = paramsKey['confirm_maintenance'] === 'true';

  const toggleConfirm = (open: boolean) => {
    if (open) {
      params.set('confirm_maintenance', 'true');
    } else {
      params.delete('confirm_maintenance');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const onSuccess = (response: { message?: string }) => {
    toast({
      title: 'Success',
      description:
        response.message ||
        `Maintenance mode ${
          maintenanceMode ? 'disabled' : 'enabled'
        } successfully.`,
    });
    queryClient.invalidateQueries({ queryKey: ['maintenance-mode'] }); // Adjust queryKey as needed
    toggleConfirm(false);
  };

  const onError = (error: { message?: string }) => {
    console.error('Toggle maintenance mode error:', error);
    toast({
      variant: 'destructive',
      title: 'Toggle Failed',
      description:
        error.message ||
        'An error occurred while toggling maintenance mode. Please try again.',
    });
    queryClient.invalidateQueries({ queryKey: ['maintenance-mode'] }); // Optional, depending on behavior
  };

  const handleToggleMaintenance = () => {
    console.log('handleToggleMaintenance - Toggling to', !maintenanceMode);
    toggleMaintenanceMode.mutate(undefined, {
      onSuccess,
      onError,
    });
  };

  return (
    <AlertDialog
      open={isConfirmOpen}
      onOpenChange={(open) => {
        if (!toggleMaintenanceMode.isLoading) {
          toggleConfirm(open);
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          variant={maintenanceMode ? 'destructive' : 'default'}
          className='gap-2'
          onClick={() => toggleConfirm(true)}
        >
          <AlertTriangle className='h-4 w-4' />
          {maintenanceMode
            ? 'Disable Maintenance Mode'
            : 'Enable Maintenance Mode'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {maintenanceMode
              ? 'Disable Maintenance Mode'
              : 'Enable Maintenance Mode'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {maintenanceMode
              ? 'This will make your site accessible to all visitors again. Are you sure?'
              : 'This will restrict access to administrators only. Are you sure?'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => toggleConfirm(false)}
            disabled={toggleMaintenanceMode.isLoading}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleToggleMaintenance}
            disabled={toggleMaintenanceMode.isLoading}
          >
            {maintenanceMode ? 'Disable' : 'Enable'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
