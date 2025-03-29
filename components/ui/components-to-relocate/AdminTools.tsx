'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  useAdminSettings,
  useSettingsActions,
} from '@/hooks/general/use-admin-settings';
import { toast } from '@/hooks/use-toast';
import { LogoUpload } from './admin-tools/logo-upload';
import { MaintenanceToggle } from './admin-tools/maintenance-toggle';
import { RecentProjectsUpload } from './admin-tools/recent-project-upload';
import { Button } from '../button';
import { IoMdRemoveCircleOutline } from 'react-icons/io';

export interface Project {
  id: number;
  image_url: string;
  project_title: string;
}

export function AdminTools() {
  const { logoQuery, recentImagesQuery, maintenanceModeQuery } =
    useAdminSettings<any>();

  const {
    uploadLogo,
    uploadRecentProjectImage,
    deleteRecentProjectImage,
    toggleMaintenanceMode,
  } = useSettingsActions<any>();

  // Logo states
  const {
    data: logoData,
    error: logoError,
    isLoading: isLogoLoading,
  } = logoQuery;
  const logo = logoData?.logo_url;

  // Recent projects states
  const {
    data: recentProjectsData,
    error: projectsError,
    isLoading: isImageLoading,
  } = recentImagesQuery;

  const projects = recentProjectsData?.recent_project_images || [];

  const recentProjectsMessage =
    recentProjectsData?.message ||
    'No recent projects available. Upload some to get started!';

  // Maintenance mode states
  const {
    data: maintenanceData,
    error: maintenanceError,
    isLoading: isMaintenanceLoading,
  } = maintenanceModeQuery;

  const maintenanceMode = maintenanceData?.maintenance_mode || false;

  const {
    mutate: deleteRecentImages,
    error: deleteError,
    isLoading: isDeleting,
  } = deleteRecentProjectImage;

  const handleDeleteRecentImage = (id: number) => {
    deleteRecentImages(
      { image_ids: [id] },
      {
        onSuccess: () => {
          toast({
            title: 'Delete Successful',
            description: 'Project removed successfully.',
          });
        },
        onError: (err) => {
          console.error('Delete failed:', err);
          toast({
            variant: 'destructive',
            title: 'Delete Failed',
            description:
              'An error occurred while deleting the project. Please try again.',
          });
        },
      }
    );
  };
  return (
    <div className='grid gap-6'>
      {/* Logo Card */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <div>
            <CardTitle className='text-xl'>Logo</CardTitle>
            <p className='text-sm text-muted-foreground mb-4'>
              Update your site logo to reflect your brand identity.
            </p>
          </div>
          <LogoUpload uploadLogo={uploadLogo} />
        </CardHeader>
        <CardContent>
          {isLogoLoading ? (
            <div className='flex items-center justify-center p-4'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
            </div>
          ) : logoError ? (
            <p className='text-sm text-destructive'>
              Failed to load logo: {logoError.message || 'Unknown error'}
            </p>
          ) : !logo ? (
            <p className='text-sm text-muted-foreground'>
              {logoData?.message || 'No logo uploaded yet.'}
            </p>
          ) : (
            <div className='flex items-center justify-center bg-gray-100 p-4 rounded-md'>
              <img
                src={logo || '/placeholder.svg'}
                className='max-h-64 object-cover rounded-md'
                alt='Site Logo'
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Projects Card */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <div>
            <CardTitle className='text-xl'>Recent Projects</CardTitle>
            <p className='text-sm text-muted-foreground mb-4'>
              Showcase your latest work with images and titles.
            </p>
          </div>
          <RecentProjectsUpload uploadRecentImages={uploadRecentProjectImage} />
        </CardHeader>
        <CardContent>
          {isImageLoading ? (
            <div className='flex items-center justify-center p-4'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
            </div>
          ) : projectsError ? (
            <p className='text-sm text-destructive'>
              Failed to load projects:{' '}
              {projectsError.message || 'Unknown error'}
            </p>
          ) : deleteError ? (
            <p className='text-sm text-destructive'>
              Delete Error: {deleteError || 'Unknown error'}
            </p>
          ) : projects.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              {recentProjectsMessage}
            </p>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-gray-100 p-4 rounded-md'>
              {projects.map((project: Project) => (
                <div
                  key={project.id}
                  className='flex flex-col items-center gap-2 relative'
                >
                  <img
                    src={project.image_url || '/placeholder.svg'}
                    alt={project.project_title}
                    className='h-40 w-full object-cover rounded-md'
                  />
                  <Button
                    variant='ghost'
                    size='icon'
                    className='absolute top-0 right-0 bg-primary/70 text-destructive hover:text-destructive/90 hover:bg-destructive/50'
                    onClick={() => handleDeleteRecentImage(project.id)}
                    disabled={isDeleting}
                  >
                    <IoMdRemoveCircleOutline className='h-5 w-5' />
                  </Button>
                  <p className='text-sm font-medium text-center'>
                    {project.project_title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Maintenance Mode Card */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <div>
            <CardTitle className='text-xl flex items-center gap-3'>
              Maintenance Mode
              {maintenanceMode && <Badge variant='destructive'>Active</Badge>}
            </CardTitle>
            <p className='text-sm text-muted-foreground mb-4 w-[50rem]'>
              Temporarily restrict access to your site during updates or
              maintenance.
            </p>
          </div>
          <MaintenanceToggle
            toggleMaintenanceMode={toggleMaintenanceMode}
            maintenanceMode={maintenanceMode}
          />
        </CardHeader>
        <CardContent>
          {isMaintenanceLoading ? (
            <div className='flex items-center justify-center p-4'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
            </div>
          ) : maintenanceError ? (
            <p className='text-sm text-destructive'>
              Failed to load maintenance status:{' '}
              {maintenanceError.message || 'Unknown error'}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
