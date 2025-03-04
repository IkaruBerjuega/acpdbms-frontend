'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { step1Schema } from '@/lib/form-constants/project-constants';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Edit,
  MapPin,
  Building,
  User,
  FileText,
  Home,
  Map,
} from 'lucide-react';
import FormInput from '@/components/ui/general/form-components/form-input';
import { GeneralDialog } from './general-dialog';
import { toast } from './use-toast';
import { useProjectViewEdit } from '@/hooks/general/use-viewedit';
import { useUpdateProjectImage } from './use-upload-project-image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ProjectDetailsSchema = z.infer<typeof step1Schema>;

function ProjectDetails({ id, edit }: { id: string; edit: string }) {
  const [isEdit, setEdit] = useState<boolean>(false);
  const [isHovered, setHovered] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const formData = new FormData();

  const methods = useForm<ProjectDetailsSchema>({
    resolver: zodResolver(step1Schema),
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    register,
    control,
    reset,
    watch,
    formState: { errors, isValid },
  } = methods;

  useEffect(() => {
    edit === 'true' ? setEdit(true) : setEdit(false);
  }, [edit]);

  const { projectDetails, isLoading, updateProjectDetails } =
    useProjectViewEdit(id);

  const processForm: SubmitHandler<ProjectDetailsSchema> = async (data) => {
    const isSuccessful = await updateProjectDetails(formData);

    if (isSuccessful) {
      toast({
        title: 'Success',
        description: 'Project details updated successfully',
      });
      setEdit(false);
    } else {
      toast({
        title: 'Error',
        description: errors ? String(errors) : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (projectDetails) {
      reset({
        client_id: projectDetails.client_id,
        client_name: projectDetails.client_name,
        project_title: projectDetails.project_title,
        start_date: new Date(projectDetails.start_date),
        end_date: new Date(projectDetails.end_date),
        finish_date: projectDetails.finish_date
          ? new Date(projectDetails.finish_date)
          : undefined,
        street: projectDetails.street,
        city_town: projectDetails.city_town,
        state: projectDetails.state,
        zip_code: projectDetails.zip_code,
        status: projectDetails.status,
        image_url: projectDetails.image_url ?? undefined,
      });
    }
  }, [projectDetails, reset]);

  const details = watch();
  const projectLocation = `${projectDetails?.state}, ${projectDetails?.city_town}`;
  const title = projectDetails?.project_title;
  const status = projectDetails?.status;
  const image_url = projectDetails?.image_url;

  const { uploadPhoto } = useUpdateProjectImage();

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);

      const formData = new FormData();
      formData.append('image', file);

      const response = await uploadPhoto({ data: formData, projectId: id });
      if (response) {
        toast({
          variant: 'default',
          title: 'Success',
          description: response || 'Project image updated successfully',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            typeof errors === 'object'
              ? String(errors)
              : 'Failed to upload image',
        });
      }
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'finished':
        return 'bg-emerald-500 hover:bg-emerald-600';
      case 'on-hold':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'ongoing':
        return 'bg-slate-300 hover:bg-slate-400';
      default:
        return 'bg-slate-300 hover:bg-slate-400';
    }
  };

  return (
    <>
      <Card className='border-none shadow-md'>
        <CardContent className='p-6'>
          {/* Header */}
          <div className='flex flex-col md:flex-row justify-between gap-4 mb-6'>
            <div className='flex flex-col md:flex-row items-start gap-6'>
              <div
                className='relative h-[125px] w-[125px] rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105'
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <img
                  src={
                    // selectedFile
                    //   ? URL.createObjectURL(selectedFile)
                    //   : image_url ??
                    'https://media.istockphoto.com/id/1217618992/photo/3d-house.jpg?s=612x612&w=0&k=20&c=brVxRkoQX9q-2TwiyjgjYyNJrBCs-j41J34fLVp3pdA='
                  }
                  alt='Project'
                  className='object-cover h-full w-full'
                />
                {isHovered && (
                  <div className='absolute inset-0 flex items-center justify-center hover:bg-black-500 bg-opacity-30 text-white text-sm font-bold transition-opacity'>
                    Change Photo
                  </div>
                )}
                <input
                  type='file'
                  id='fileInput'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='hidden'
                />
              </div>
              <div className='flex flex-col justify-center'>
                <h1 className='text-2xl font-bold text-maroon-600 mb-1'>
                  {title}
                </h1>
                <div className='flex items-center text-slate-600 mb-3'>
                  <MapPin className='h-4 w-4 mr-1' />
                  <span className='text-sm'>{projectLocation}</span>
                </div>
                <Badge
                  className={`${getStatusColor(
                    status
                  )} text-white font-medium py-1`}
                >
                  {status}
                </Badge>
              </div>
            </div>
            {!isEdit && (
              <Button
                className='bg-maroon-600 hover:bg-maroon-700 text-white self-start'
                onClick={() => setEdit(!isEdit)}
                size='sm'
              >
                <Edit className='h-4 w-4 mr-2' /> Edit Details
              </Button>
            )}
          </div>

          <Separator className='my-6' />

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(processForm)} className='space-y-8'>
              {/* Basic Details Section */}
              <div>
                <div className='flex items-center mb-4'>
                  <FileText className='h-5 w-5 text-maroon-600 mr-2' />
                  <h2 className='font-semibold text-lg text-maroon-600'>
                    Basic Details
                  </h2>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {isEdit ? (
                    <>
                      <FormInput
                        name='client_name'
                        label='Client Name'
                        inputType='search'
                        validationRules={undefined}
                        errorMessage={errors.client_id?.message}
                        register={register}
                      />
                      <FormInput
                        name='project_title'
                        label='Project Title'
                        inputType='default'
                        validationRules={undefined}
                        errorMessage={errors.project_title?.message}
                        register={register}
                      />
                    </>
                  ) : (
                    <>
                      <div className='space-y-1'>
                        <div className='flex items-center'>
                          <User className='h-4 w-4 text-slate-500 mr-2' />
                          <span className='text-sm font-medium text-slate-700'>
                            Client Name
                          </span>
                        </div>
                        <p className='text-base pl-6'>{details?.client_name}</p>
                      </div>
                      <div className='space-y-1'>
                        <div className='flex items-center'>
                          <FileText className='h-4 w-4 text-slate-500 mr-2' />
                          <span className='text-sm font-medium text-slate-700'>
                            Project Title
                          </span>
                        </div>
                        <p className='text-base pl-6'>
                          {details?.project_title}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Location Section */}
              <div>
                <div className='flex items-center mb-4'>
                  <MapPin className='h-5 w-5 text-maroon-600 mr-2' />
                  <h2 className='font-semibold text-lg text-maroon-600'>
                    Project Location
                  </h2>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                  {isEdit ? (
                    <>
                      <FormInput
                        name='state'
                        label='State'
                        inputType='default'
                        validationRules={undefined}
                        errorMessage={errors.state?.message}
                        register={register}
                      />
                      <FormInput
                        name='city_town'
                        label='City/Town'
                        inputType='default'
                        validationRules={undefined}
                        errorMessage={errors.city_town?.message}
                        register={register}
                      />
                      <FormInput
                        name='street'
                        label='Street'
                        inputType='default'
                        validationRules={undefined}
                        errorMessage={errors.street?.message}
                        register={register}
                      />
                      <FormInput
                        name='zip_code'
                        label='Zip Code'
                        inputType='default'
                        register={register}
                        errorMessage={errors.zip_code?.message}
                        validationRules={{ valueAsNumber: true }}
                      />
                    </>
                  ) : (
                    <>
                      <div className='space-y-1'>
                        <div className='flex items-center'>
                          <Map className='h-4 w-4 text-slate-500 mr-2' />
                          <span className='text-sm font-medium text-slate-700'>
                            State
                          </span>
                        </div>
                        <p className='text-base pl-6'>{details?.state}</p>
                      </div>
                      <div className='space-y-1'>
                        <div className='flex items-center'>
                          <Building className='h-4 w-4 text-slate-500 mr-2' />
                          <span className='text-sm font-medium text-slate-700'>
                            City/Town
                          </span>
                        </div>
                        <p className='text-base pl-6'>{details?.city_town}</p>
                      </div>
                      <div className='space-y-1'>
                        <div className='flex items-center'>
                          <Home className='h-4 w-4 text-slate-500 mr-2' />
                          <span className='text-sm font-medium text-slate-700'>
                            Street
                          </span>
                        </div>
                        <p className='text-base pl-6'>{details?.street}</p>
                      </div>
                      <div className='space-y-1'>
                        <div className='flex items-center'>
                          <MapPin className='h-4 w-4 text-slate-500 mr-2' />
                          <span className='text-sm font-medium text-slate-700'>
                            Zip Code
                          </span>
                        </div>
                        <p className='text-base pl-6'>{details?.zip_code}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Duration Section */}
              <div>
                <div className='flex items-center mb-4'>
                  <Calendar className='h-5 w-5 text-maroon-600 mr-2' />
                  <h2 className='font-semibold text-lg text-maroon-600'>
                    Project Duration
                  </h2>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  {isEdit ? (
                    <>
                      <FormInput
                        name='start_date'
                        label='Start Date'
                        inputType='date'
                        control={control}
                        validationRules={undefined}
                        errorMessage={errors.start_date?.message}
                        register={register}
                      />
                      <FormInput
                        name='end_date'
                        label='End Date'
                        inputType='date'
                        control={control}
                        validationRules={undefined}
                        errorMessage={errors.end_date?.message}
                        register={register}
                      />
                    </>
                  ) : (
                    <>
                      <div className='space-y-1'>
                        <div className='flex items-center'>
                          <Calendar className='h-4 w-4 text-slate-500 mr-2' />
                          <span className='text-sm font-medium text-slate-700'>
                            Start Date
                          </span>
                        </div>
                        <p className='text-base pl-6'>
                          {details?.start_date
                            ? details.start_date.toLocaleDateString()
                            : ''}
                        </p>
                      </div>
                      <div className='space-y-1'>
                        <div className='flex items-center'>
                          <Calendar className='h-4 w-4 text-slate-500 mr-2' />
                          <span className='text-sm font-medium text-slate-700'>
                            End Date
                          </span>
                        </div>
                        <p className='text-base pl-6'>
                          {details?.end_date
                            ? details.end_date.toLocaleDateString()
                            : ''}
                        </p>
                      </div>
                      {details?.finish_date && (
                        <div className='space-y-1'>
                          <div className='flex items-center'>
                            <Calendar className='h-4 w-4 text-slate-500 mr-2' />
                            <span className='text-sm font-medium text-slate-700'>
                              Finish Date
                            </span>
                          </div>
                          <p className='text-base pl-6'>
                            {new Date(details.finish_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {isEdit && (
                <div className='flex justify-end gap-3 pt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setEdit(false)}
                    className='border-slate-300'
                  >
                    Cancel
                  </Button>
                  <GeneralDialog
                    message="Do you confirm to update this project's details?"
                    title='Edit Project Details'
                    variant='text'
                    type='submit'
                    btnText='Save Details'
                    onClick={handleSubmit(processForm)}
                    className='bg-maroon-600 hover:bg-maroon-700 text-white'
                  />
                </div>
              )}
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </>
  );
}

export default function ProjectView({
  id,
  edit,
}: {
  id: string;
  edit: string;
}) {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-5xl mx-auto'>
        <ProjectDetails id={id} edit={edit} />
      </div>
    </div>
  );
}
