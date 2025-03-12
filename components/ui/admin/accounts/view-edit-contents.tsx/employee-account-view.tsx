'use client';

import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { BtnDialog, Button } from '@/components/ui/button';
import {
  Edit,
  User,
  MapPin,
  FileText,
  ListChecks,
  CheckCircle2,
} from 'lucide-react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import FormInput from '@/components/ui/general/form-components/form-input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/api-calls/admin/use-profile';
import { ViewEditCard } from './project-view-card';

export interface editAccountDetails {
  email?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  phoneNumber: string;
  street?: string;
  city_town?: string;
  state?: string;
  zip_code?: string;
  profile_picture_url?: string;
  position?: string;
}

export default function EmpAccView({ id, edit }: { id: string; edit: string }) {
  const [editAccDetails, setEditAccDetails] = useState<boolean>(false);

  const methods = useForm<editAccountDetails>({
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    setEditAccDetails(edit === 'true');
  }, [edit]);

  const {
    profileDetails,
    finishedProjects,
    ongoingProjects,
    updateProfileFromAdmin,
  } = useProfile(id);

  useEffect(() => {
    if (profileDetails && profileDetails.employee) {
      reset({
        first_name: profileDetails.employee.first_name,
        middle_name: profileDetails.employee.middle_name || '',
        last_name: profileDetails.employee.last_name,
        phoneNumber: profileDetails.employee.phone_number || '',
        street: profileDetails.employee.street || '',
        city_town: profileDetails.employee.city_town || '',
        state: profileDetails.employee.state || '',
        zip_code: profileDetails.employee.zip_code || '',
        email: profileDetails.email || '',
        profile_picture_url: '',
        position: profileDetails.employee.position || '',
      });
    }
  }, [reset, profileDetails]);

  const processForm: SubmitHandler<editAccountDetails> = async (data) => {
    const formattedData = {
      first_name: data.first_name,
      middle_name: data.middle_name,
      last_name: data.last_name,
      phone_number: data.phoneNumber,
      street: data.street,
      city_town: data.city_town,
      state: data.state,
      zip_code: data.zip_code,
      position: data.position,
      email: data.email,
    };

    await updateProfileFromAdmin(formattedData, id);
    toast({
      variant: 'default',
      title: 'Notification',
      description: 'You successfully updated the account details',
    });

    setEditAccDetails(false);
  };

  const address =
    [
      profileDetails?.employee?.street,
      profileDetails?.employee?.city_town,
      profileDetails?.employee?.state,
      profileDetails?.employee?.zip_code,
    ]
      .filter(Boolean)
      .join(', ') || 'Not Set';

  const phoneNumber = profileDetails?.employee?.phone_number;
  const noProfile = '/no-profile.png';

  const [imgSrc, setImgSrc] = useState<string>(
    profileDetails?.profile_picture_url || noProfile
  );

  useEffect(() => {
    setImgSrc(profileDetails?.profile_picture_url || noProfile);
  }, [profileDetails]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-5xl mx-auto'>
        <Card className='border-none shadow-md'>
          <CardContent className='p-6'>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(processForm)}
                className='space-y-8'
              >
                {/* Header / Profile Section */}
                <div className='flex flex-col md:flex-row justify-between gap-4 mb-6'>
                  <div className='flex flex-col md:flex-row items-start gap-6'>
                    {/* Profile Image */}
                    <div className='relative w-[100px] h-[100px] rounded-lg overflow-hidden shadow-md'>
                      <Image
                        src={imgSrc}
                        alt={`${
                          profileDetails?.employee?.first_name || 'First Name'
                        } ${
                          profileDetails?.employee?.last_name || 'Last Name'
                        }'s Image`}
                        quality={100}
                        className='object-cover'
                        fill
                        onError={() => setImgSrc(noProfile)}
                      />
                    </div>
                    {/* Name and Edit Button */}
                    <div className='flex flex-col justify-center'>
                      <h1 className='text-2xl font-bold text-primary mb-1'>
                        {`${
                          profileDetails?.employee?.first_name || 'First Name'
                        } ${
                          profileDetails?.employee?.last_name || 'Last Name'
                        }`}
                      </h1>
                      <div className='text-slate-600 text-sm space-y-1'>
                        <p>Phone Number: {phoneNumber || 'Not Set'}</p>
                        <p>Address: {address}</p>
                      </div>
                    </div>
                  </div>
                  {!editAccDetails && (
                    <Button
                      className='bg-maroon-600 hover:bg-maroon-700 text-white self-start'
                      onClick={() => setEditAccDetails(!editAccDetails)}
                      size='sm'
                    >
                      <Edit className='text-base mr-2' /> Edit Details
                    </Button>
                  )}
                </div>

                <Separator className='my-6' />

                {/* Personal Details */}
                {editAccDetails ? (
                  <div className='flex items-center mb-4'>
                    <User className='h-5 w-5 text-maroon-600 mr-2' />
                    <h2 className='font-semibold text-lg text-maroon-600'>
                      Personal Details
                    </h2>
                  </div>
                ) : (
                  <div className='flex items-center mb-4'>
                    <User className='h-5 w-5 text-slate-900 mr-2' />
                    <h2 className='font-semibold text-lg text-slate-900'>
                      Personal Details
                    </h2>
                  </div>
                )}

                {editAccDetails ? (
                  /* Edit Mode */
                  <div className='grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4'>
                    <FormInput
                      name={'first_name'}
                      label={'First Name'}
                      inputType={'default'}
                      register={register}
                      errorMessage={errors.first_name?.message}
                    />
                    <FormInput
                      name={'middle_name'}
                      label={'Middle Name'}
                      inputType={'default'}
                      register={register}
                      errorMessage={errors.middle_name?.message}
                    />
                    <FormInput
                      name={'last_name'}
                      label={'Last Name'}
                      inputType={'default'}
                      register={register}
                      errorMessage={errors.last_name?.message}
                    />
                    <FormInput
                      name={'phoneNumber'}
                      label={'Phone Number'}
                      inputType={'default'}
                      register={register}
                      errorMessage={errors.phoneNumber?.message}
                    />
                    <div className='lg:col-span-4 col-span-1'>
                      <Separator className='my-4' />
                      {/* Address Heading */}
                      <div className='flex items-center mb-4'>
                        <MapPin className='h-5 w-5 text-maroon-600 mr-2' />
                        <h2 className='font-semibold text-lg text-maroon-600'>
                          Address
                        </h2>
                      </div>
                    </div>
                    <FormInput
                      name={'state'}
                      label={'State'}
                      inputType={'default'}
                      placeholder='Ex. California'
                      register={register}
                      required
                    />
                    <FormInput
                      name={'city_town'}
                      label={'City/Town'}
                      inputType={'default'}
                      placeholder='Ex. Los Angeles'
                      register={register}
                      required
                    />
                    <FormInput
                      name={'street'}
                      label={'Street'}
                      inputType={'default'}
                      placeholder='Ex. 123 Sunset Blvd'
                      register={register}
                      required
                    />
                    <FormInput
                      name={'zip_code'}
                      label={'Zip Code'}
                      inputType={'default'}
                      placeholder='90028'
                      register={register}
                      errorMessage={errors.zip_code?.message}
                      validationRules={{
                        valueAsNumber: true,
                      }}
                    />
                    <div className='lg:col-span-4 col-span-1'>
                      <Separator className='my-4' />

                      <div className='flex items-center mb-4'>
                        <FileText className='h-5 w-5 text-maroon-600 mr-2' />
                        <h2 className='font-semibold text-lg text-maroon-600'>
                          Other Details
                        </h2>
                      </div>
                    </div>
                    <FormInput
                      name={'email'}
                      label={'Email'}
                      inputType={'default'}
                      register={register}
                      errorMessage={errors.email?.message}
                    />
                  </div>
                ) : (
                  /* View Mode */
                  <div className='grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4'>
                    <div>
                      <p className='text-sm text-slate-500'>First Name</p>
                      <p className='text-base text-slate-700'>
                        {profileDetails?.employee?.first_name || 'Not Set'}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-slate-500'>Middle Name</p>
                      <p className='text-base text-slate-700'>
                        {profileDetails?.employee?.middle_name || 'Not Set'}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-slate-500'>Last Name</p>
                      <p className='text-base text-slate-700'>
                        {profileDetails?.employee?.last_name || 'Not Set'}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-slate-500'>Phone Number</p>
                      <p className='text-base text-slate-700'>
                        {profileDetails?.employee?.phone_number || 'Not Set'}
                      </p>
                    </div>

                    {/* Address Section */}
                    <div className='lg:col-span-4 col-span-1'>
                      <Separator className='my-4' />
                      <div className='flex items-center mb-4'>
                        <MapPin className='h-5 w-5 text-slate-900 mr-2' />
                        <h2 className='font-semibold text-lg text-slate-900'>
                          Address
                        </h2>
                      </div>
                    </div>
                    <div>
                      <p className='text-sm text-slate-500'>State</p>
                      <p className='text-base text-slate-700'>
                        {profileDetails?.employee?.state || 'Not Set'}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-slate-500'>City/Town</p>
                      <p className='text-base text-slate-700'>
                        {profileDetails?.employee?.city_town || 'Not Set'}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-slate-500'>Street</p>
                      <p className='text-base text-slate-700'>
                        {profileDetails?.employee?.street || 'Not Set'}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-slate-500'>Zip Code</p>
                      <p className='text-base text-slate-700'>
                        {profileDetails?.employee?.zip_code || 'Not Set'}
                      </p>
                    </div>

                    {/* Other Details in View Mode */}
                    <div className='lg:col-span-4 col-span-1'>
                      <Separator className='my-4' />
                      <div className='flex items-center mb-4'>
                        <FileText className='h-5 w-5 text-slate-900 mr-2' />
                        <h2 className='font-semibold text-lg text-slate-900'>
                          Other Details
                        </h2>
                      </div>
                    </div>
                    <div>
                      <p className='text-sm text-slate-500'>Email</p>
                      <p className='text-base text-slate-700'>
                        {profileDetails?.email || 'Not Set'}
                      </p>
                    </div>
                  </div>
                )}

                <Separator className='my-6' />

                {/* Ongoing Projects */}
                {editAccDetails ? (
                  <div className='flex items-center mb-4'>
                    <ListChecks className='h-5 w-5 text-maroon-600 mr-2' />
                    <h2 className='font-semibold text-lg text-maroon-600'>
                      Ongoing Projects
                    </h2>
                  </div>
                ) : (
                  <div className='flex items-center mb-4'>
                    <ListChecks className='h-5 w-5 text-slate-900 mr-2' />
                    <h2 className='font-semibold text-lg text-slate-900'>
                      Ongoing Projects
                    </h2>
                  </div>
                )}
                {ongoingProjects && ongoingProjects.length > 0 ? (
                  <div className='w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4'>
                    {ongoingProjects.map((project) => (
                      <ViewEditCard
                        key={`${project.id}.${project.project_title}`}
                        name={project.project_title}
                        address={project.location}
                        endDate={String(project.end_date)}
                        id={id}
                        edit={editAccDetails}
                        canDelete={true}
                        image={String(project.image_url)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-600'>
                    No ongoing projects at this time.
                  </p>
                )}

                <Separator className='my-6' />

                {/* finished projects */}
                {editAccDetails ? (
                  <div className='flex items-center mb-4'>
                    <CheckCircle2 className='h-5 w-5 text-maroon-600 mr-2' />
                    <h2 className='font-semibold text-lg text-maroon-600'>
                      Finished Projects
                    </h2>
                  </div>
                ) : (
                  <div className='flex items-center mb-4'>
                    <CheckCircle2 className='h-5 w-5 text-slate-900 mr-2' />
                    <h2 className='font-semibold text-lg text-slate-900'>
                      Finished Projects
                    </h2>
                  </div>
                )}
                {finishedProjects && finishedProjects.length > 0 ? (
                  <div className='w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4'>
                    {finishedProjects.map((project) => (
                      <ViewEditCard
                        key={`${project.id}.${project.project_title}`}
                        name={project.project_title}
                        address={project.location}
                        endDate={String(project.end_date)}
                        id={id}
                        edit={editAccDetails}
                        canDelete={true}
                        image={String(project.image_url)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className='text-slate-600'>
                    No finished projects at this time.
                  </p>
                )}
                {editAccDetails && (
                  <div className='flex justify-end items-end gap-2 pt-4'>
                    <Button
                      onClick={() => setEditAccDetails(false)}
                      variant='outline'
                      className='border-slate-300 text-slate-700 hover:bg-slate-100'
                    >
                      Cancel
                    </Button>
                    <BtnDialog
                      dialogDescription="Do you confirm to update this account's details?"
                      dialogTitle='Edit Account Details'
                      variant='default'
                      submitType='submit'
                      submitTitle='Submit'
                      btnTitle='Save Details'
                      onClick={handleSubmit(processForm)}
                      className='  text-white'
                      alt={'edit project save button'}
                    />
                  </div>
                )}
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
