'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IoMdRemoveCircleOutline } from 'react-icons/io';
import {
  useAdminSettings,
  useSettingsActions,
} from '@/hooks/general/use-admin-settings';
import { UploadLogoType, UploadRecentProjectsType } from '@/lib/definitions';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Upload } from 'lucide-react';
import Dropzone from './drop-zone';

interface Project {
  id: number;
  image_url: string;
  project_title: string;
}

function UploadDialog({
  title,
  description,
  children,
  open,
  onOpenChange,
  trigger,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function LogoUpload({
  uploadLogo,
}: {
  uploadLogo: (data: FormData) => Promise<any>;
}) {
  const [openUpload, setOpenUpload] = useState<boolean>(false);
  const methods = useForm<UploadLogoType>({
    mode: 'onSubmit',
    defaultValues: { logo: undefined },
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const onClose = () => {
    setOpenUpload(false);
    reset();
  };

  const processForm: SubmitHandler<UploadLogoType> = async (data) => {
    const formData = new FormData();
    if (data.logo && data.logo.length > 0) {
      formData.append('logo', data.logo[0]);
    } else {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'Please select a logo file to upload.',
      });
      return;
    }

    try {
      const result = await uploadLogo(formData);
      toast({
        title: 'Upload Successful',
        description: 'Logo uploaded successfully.',
      });
      reset();
      setOpenUpload(false);
    } catch (err) {
      console.error('Logo upload error:', err);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description:
          'An error occurred while uploading the logo. Please try again.',
      });
    }
  };

  return (
    <UploadDialog
      title='Upload Logo'
      description="Update your site's logo. Recommended size: 200x60px."
      open={openUpload}
      onOpenChange={setOpenUpload}
      trigger={
        <Button onClick={() => setOpenUpload(true)} className='gap-2'>
          <Upload className='h-4 w-4' />
          Upload Logo
        </Button>
      }
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(processForm)} className='space-y-4'>
          <div className='space-y-2'>
            <Controller
              name='logo'
              control={control}
              render={({ field: { onChange } }) => (
                <Dropzone
                  onDrop={(acceptedFiles) => onChange(acceptedFiles)}
                  accept={{
                    'image/jpeg': [],
                    'image/png': [],
                    'image/webp': [],
                  }}
                  showImages={true}
                />
              )}
            />
            {errors.logo && (
              <p className='text-sm text-destructive'>
                {'Please provide a valid logo file.'}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Uploading...' : 'Upload Logo'}
            </Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </UploadDialog>
  );
}

function RecentProjectsUpload({
  uploadRecentImages,
}: {
  uploadRecentImages: (data: FormData) => Promise<any>;
}) {
  const [openUpload, setOpenUpload] = useState<boolean>(false);
  const methods = useForm<UploadRecentProjectsType>({
    mode: 'onSubmit',
    defaultValues: { project_titles: [], project_images: [] },
  });
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const onClose = () => {
    setOpenUpload(false);
    reset();
  };

  const processForm: SubmitHandler<UploadRecentProjectsType> = async (data) => {
    const formData = new FormData();
    if (
      data.project_images.length === data.project_titles.length &&
      data.project_titles.length > 0
    ) {
      data.project_titles.forEach((title, index) => {
        formData.append(`projects[${index}][project_title]`, title);
        formData.append(
          `projects[${index}][image]`,
          data.project_images[index]
        );
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description:
          'Please provide matching titles and images for all projects.',
      });
      return;
    }

    try {
      const result = await uploadRecentImages(formData);
      toast({
        title: 'Upload Successful',
        description: 'Recent projects uploaded successfully.',
      });
      reset();
      setOpenUpload(false);
    } catch (err) {
      console.error('Recent projects upload error:', err);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description:
          'An error occurred while uploading projects. Please try again.',
      });
    }
  };

  return (
    <UploadDialog
      title='Upload Recent Projects'
      description='Add images and titles for your recent projects. Recommended image size: 800x600px.'
      open={openUpload}
      onOpenChange={setOpenUpload}
      trigger={
        <Button onClick={() => setOpenUpload(true)} className='gap-2'>
          <Upload className='h-4 w-4' />
          Upload Projects
        </Button>
      }
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(processForm)} className='space-y-4'>
          <div className='space-y-2'>
            <Controller
              name='project_images'
              control={control}
              render={({ field: { onChange } }) => (
                <Dropzone
                  onDrop={(acceptedFiles) => onChange(acceptedFiles)}
                  accept={{
                    'image/jpeg': [],
                    'image/png': [],
                    'image/webp': [],
                  }}
                  showImages={true}
                  formInput={{ name: 'project_titles', register }}
                />
              )}
            />
            {errors.project_images && (
              <p className='text-sm text-destructive'>
                {'Please provide valid project images.'}
              </p>
            )}
            {errors.project_titles && (
              <p className='text-sm text-destructive'>
                {'Please provide valid project titles.'}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Uploading...' : 'Upload Projects'}
            </Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </UploadDialog>
  );
}

function MaintenanceToggle({
  toggleMaintenanceMode,
  maintenanceMode,
}: {
  toggleMaintenanceMode: () => Promise<any>;
  maintenanceMode: boolean;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleToggle = async () => {
    try {
      const result = await toggleMaintenanceMode();
      toast({
        title: 'Success',
        description: `Maintenance mode ${
          maintenanceMode ? 'disabled' : 'enabled'
        } successfully.`,
      });
      setIsConfirmOpen(false);
    } catch (err) {
      console.error('Toggle maintenance mode error:', err);
      toast({
        variant: 'destructive',
        title: 'Toggle Failed',
        description:
          'An error occurred while toggling maintenance mode. Please try again.',
      });
    }
  };

  return (
    <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={maintenanceMode ? 'destructive' : 'default'}
          className='gap-2'
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleToggle}>
            {maintenanceMode ? 'Disable' : 'Enable'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
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
  const projects: Project[] = recentProjectsData?.recent_project_images || [];
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

  const handleDeleteRecentImage = async (id: number) => {
    try {
      await deleteRecentImages({ image_ids: [id] });
      toast({
        title: 'Delete Successful',
        description: 'Project removed successfully.',
      });
    } catch (err) {
      console.error('Delete failed:', err);
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description:
          'An error occurred while deleting the project. Please try again.',
      });
    }
  };

  const handleUploadLogo = async (data: FormData) => {
    return await uploadLogo.mutate(data);
  };

  const handleUploadRecentImages = async (data: FormData) => {
    return await uploadRecentProjectImage.mutate(data);
  };

  const handleToggleMaintenance = async () => {
    return await toggleMaintenanceMode.mutate(null);
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
          <LogoUpload uploadLogo={handleUploadLogo} />
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
                src={logo}
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
          <RecentProjectsUpload uploadRecentImages={handleUploadRecentImages} />
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
              {projects.map((project) => (
                <div
                  key={project.id}
                  className='flex flex-col items-center gap-2 relative'
                >
                  <img
                    src={project.image_url}
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
            toggleMaintenanceMode={handleToggleMaintenance}
            maintenanceMode={maintenanceMode}
          />
        </CardHeader>
      </Card>
    </div>
  );
}
