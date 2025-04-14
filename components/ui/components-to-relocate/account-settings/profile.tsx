'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import InputForm from '../../general/form-components/form-input';
import {
  useAccountSettings,
  getAccountSettings,
} from '@/hooks/general/use-account-settings';
import { useQueryParams } from '@/hooks/use-query-params';
import { toast } from '@/hooks/use-toast';
import { BasicInfo, UserInfoInterface } from '@/lib/definitions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../alert-dialog';
import ProfilePictureSettings from './update-picture';
import FormInput from '../../general/form-components/form-input';

export default function ProfileSettings({
  role,
}: {
  role: 'employee' | 'client';
}) {
  const [showPopover, setShowPopover] = useState(false);
  const [previewData, setPreviewData] = useState<BasicInfo | null>(null);

  const methods = useForm<UserInfoInterface>({
    mode: 'onBlur',
  });

  const { getUser } = getAccountSettings<UserInfoInterface>();
  const { updateProfile } = useAccountSettings<BasicInfo>();
  const queryClient = useQueryClient();

  const { handleSubmit, register, reset } = methods;

  const { data: userData, error: userError, isLoading: userLoading } = getUser;
  console.log(userData);

  useEffect(() => {
    if (userData) {
      reset(userData);
    }
  }, [userData, reset]);

  const processForm: SubmitHandler<UserInfoInterface> = (data) => {
    const { [role]: roleData } = data;
    setPreviewData(roleData); // roleData is BasicInfo
    setShowPopover(true);
  };

  const handleFinalSubmit = () => {
    if (!previewData) return;

    updateProfile.mutate(previewData, {
      onSuccess: (response: { message: string }) => {
        toast({
          variant: 'default',
          title: 'Profile Updated',
          description: response.message || 'Profile updated successfully.',
        });
        queryClient.invalidateQueries({ queryKey: ['user'] });
        setShowPopover(false);
      },
      onError: (response: { message: string }) => {
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: response.message || 'Failed to update profile.',
        });
      },
    });
  };

  const profile = userData?.profile_picture_url;
  const fname = userData?.employee.first_name;

  if (userLoading) return <p>Loading...</p>;
  if (userError) return <p>Error loading user data: {userError.message}</p>;

  return (
    <div className='flex flex-col lg:flex-row gap-6'>
      {/* Profile Picture Section */}
      <div className='w-full lg:w-[30rem]'>
        <Card className='sticky top-12 pb-4'>
          <CardHeader>
            <CardTitle className='text-lg'>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className='flex justify-center'>
            <ProfilePictureSettings profile={profile} fname={fname} />
          </CardContent>
        </Card>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit(processForm)}
        className='flex-1 overflow-y-auto pr-0 lg:pr-2'
        style={{
          maxHeight: 'calc(76vh - 6rem)',
        }}
      >
        <div className='space-y-4'>
          {/* Basic Info */}
          <Card>
            <CardHeader className='pb-0'>
              <CardTitle className='text-lg'>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <FormInput
                name={`${role}.first_name`}
                label='First Name'
                inputType='default'
                register={register}
                required
              />
              <FormInput
                name={`${role}.middle_name`}
                label='Middle Name'
                inputType='default'
                register={register}
                required={false}
              />
              <FormInput
                name={`${role}.last_name`}
                label='Last Name'
                inputType='default'
                register={register}
                required
              />
              {role === 'employee' && (
                <FormInput
                  fieldBg='bg-primary/10'
                  name={`${role}.position`}
                  label='Position'
                  inputType='default'
                  register={register}
                  required={false}
                  readOnly
                />
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader className='pb-0'>
              <CardTitle className='text-lg'>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <FormInput
                name={`${role}.phone_number`}
                label='Phone Number'
                inputType='default'
                register={register}
                required
              />
              <FormInput
                fieldBg='bg-primary/10'
                name='email'
                label='Email'
                inputType='default'
                register={register}
                required={false}
                readOnly
              />
            </CardContent>
          </Card>

          {/* Address Info */}
          <Card>
            <CardHeader className='pb-0'>
              <CardTitle className='text-lg'>Address</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <FormInput
                name={`${role}.street`}
                label='Street'
                inputType='default'
                register={register}
                required
              />
              <FormInput
                name={`${role}.city_town`}
                label='City/Town'
                inputType='default'
                register={register}
                required
              />
              <FormInput
                name={`${role}.state`}
                label='State'
                inputType='default'
                register={register}
                required
              />
              <FormInput
                name={`${role}.zip_code`}
                label='Zip Code'
                inputType='default'
                register={register}
                required
              />
            </CardContent>
          </Card>

          <div className='flex justify-end'>
            <Button
              className='bg-gray-800 hover:bg-gray-900 text-white-primary'
              type='submit'
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>

      {/* Popover Preview */}
      {showPopover && (
        <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
          <AlertDialog open={showPopover} onOpenChange={setShowPopover}>
            <AlertDialogContent className='w-full max-w-[90vw] md:max-w-[30rem]'>
              <AlertDialogHeader>
                <AlertDialogTitle>Preview Profile Information</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className='mt-4 space-y-4 text-sm text-foreground'>
                    <div className='flex flex-col md:flex-row gap-6'>
                      <div className='space-y-2'>
                        <p className='text-lg'>Basic Details</p>
                        <p>
                          <strong>First Name:</strong> {previewData?.first_name}
                        </p>
                        <p>
                          <strong>Middle Name:</strong>{' '}
                          {previewData?.middle_name}
                        </p>
                        <p>
                          <strong>Last Name:</strong> {previewData?.last_name}
                        </p>
                      </div>
                      <div className='space-y-2'>
                        <p className='text-lg'>Address</p>
                        <p>
                          <strong>Street:</strong> {previewData?.street}
                        </p>
                        <p>
                          <strong>City/Town:</strong> {previewData?.city_town}
                        </p>
                        <p>
                          <strong>State:</strong> {previewData?.state}
                        </p>
                        <p>
                          <strong>Zip Code:</strong> {previewData?.zip_code}
                        </p>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <p className='text-lg'>Contact Details</p>
                      <p>
                        <strong>Phone Number:</strong>{' '}
                        {previewData?.phone_number}
                      </p>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className='mt-4'>
                <AlertDialogCancel onClick={() => setShowPopover(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleFinalSubmit}
                  disabled={userLoading || updateProfile.isLoading}
                >
                  {updateProfile.isLoading ? 'Updating...' : 'Confirm'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
