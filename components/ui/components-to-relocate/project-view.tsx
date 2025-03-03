'use client';

import { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { step1Schema } from '@/lib/form-constants/project-constants';
import { cx } from 'class-variance-authority';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { FaRegEdit } from 'react-icons/fa';
import FormInput from '@/components/ui/general/form-components/form-input';
import LocationSelector from './location-picker';
import { GeneralDialog } from './general-dialog';
import FormLabel from './form-label';
import { toast } from './use-toast';
import { useProjectViewEdit } from '@/hooks/general/use-viewedit';
import { useUpdateProjectImage } from './use-upload-project-image';

type ProjectDetailsSchema = z.infer<typeof step1Schema>;
const formData = new FormData();
function ProjectDetails({ id, edit }: { id: string; edit: string }) {
  const [isEdit, setEdit] = useState<boolean>(false);

  const methods = useForm<ProjectDetailsSchema>({
    resolver: zodResolver(step1Schema),
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    register,
    control,
    reset, // To get the current values
    watch,
    formState: { errors, isValid },
  } = methods;

  useEffect(() => {
    edit === 'true' ? setEdit(true) : setEdit(false);
  }, [edit, setEdit]);

  const { projectDetails, isLoading, updateProjectDetails } =
    useProjectViewEdit(id);

  const processForm: SubmitHandler<ProjectDetailsSchema> = async (data) => {
    const isSuccessful = await updateProjectDetails(formData);

    if (isSuccessful) {
      toast({
        title: 'Notification',
        description: 'You successfully updated project details',
      });
      setEdit(false);
    } else {
      toast({
        title: 'Notification',
        description: errors ? String(errors) : 'An error occured',
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
  }, [isLoading, projectDetails, reset]);

  console.log(projectDetails);

  const details = watch(); // Watch all form values
  const projectLocation = `${projectDetails?.state}, ${projectDetails?.city_town}`;
  const title = projectDetails?.project_title;
  const status = projectDetails?.status;
  const image_url = projectDetails?.image_url;

  console.log(image_url);

  const [isHovered, setHovered] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { uploadPhoto } = useUpdateProjectImage();

  // Image change handler
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // Create FormData to send the image file
      const formData = new FormData();
      formData.append('image', file);

      // Call uploadPhoto to upload the image
      const response = await uploadPhoto({ data: formData, projectId: id });
      if (response) {
        toast({
          variant: 'default',
          title: 'Notification',
          description: response || 'You successfully added a project access',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Notification',
          description: typeof errors
            ? String(errors)
            : 'There was an error uploading the image',
        });
      }
    }
  };

  return (
    <>
      {/* Header */}
      <div className='w-full flex flex-row justify-between'>
        <div className='flex flex-row  items-start gap-4'>
          <div
            className='relative h-[75px] w-[75px] md:h-[125px] md:w-[125px] bg-darkgray-600 cursor-pointer'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => document.getElementById('fileInput')?.click()} // Trigger file input on image click
          >
            <img
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile)
                  : image_url ??
                    'https://media.istockphoto.com/id/1217618992/photo/3d-house.jpg?s=612x612&w=0&k=20&c=brVxRkoQX9q-2TwiyjgjYyNJrBCs-j41J34fLVp3pdA='
              }
              alt='project image'
              className='object-contain h-full w-full'
            />
            {isHovered && (
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xs font-semibold'>
                Change Photo
              </div>
            )}
            <input
              type='file'
              id='fileInput'
              accept='image/*'
              onChange={handleImageChange}
              style={{ display: 'none' }} // Hide the input
            />
          </div>
          <div className='flex flex-col'>
            <h1 className='text-lg text-maroon-600 font-bold'>{title}</h1>
            <h2 className='text-sm text-darkgray-600 '>{projectLocation}</h2>
          </div>
        </div>
        <div className=''>
          <div
            className={cx(
              'text-xs px-2 py-1 rounded-lg drop-shadow-sm tracking-wider text-white font-semibold',
              {
                'bg-green-500': status === 'finished',
                'bg-yellow-500': status === 'on-hold',
                'bg-gray-300': status === 'ongoing',
              }
            )}
          >
            {status}
          </div>
        </div>
      </div>
      <Separator className='my-2' />
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(processForm)}
          className='grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
        >
          {/* Header */}
          <div className='col-span-1 md:col-span-2 lg:col-span-4 flex justify-between items-center'>
            <p className='font-semibold text-maroon-600'>Project Details</p>
            {!isEdit && (
              <Button
                className='hover:bg-maroon-700 bg-maroon-600 text-sm hover:text-white '
                onClick={() => setEdit(!isEdit)}
                size={'sm'}
              >
                <FaRegEdit className='text-lg mr-2' /> Edit
              </Button>
            )}
          </div>
          {isEdit ? (
            <>
              <div className='col-span-1 md:col-span-2 lg:col-span-4 text-darkgray-600 font-semibold text-xs italic flex items-end '>
                Basic Details
              </div>
              <FormInput
                name={'client_name'}
                label={'Client Name'}
                inputType={'search'}
                validationRules={undefined}
                errorMessage={errors.client_id?.message}
                register={register}
              />
              <FormInput
                name={'project_title'}
                label={'Project Title'}
                inputType={'default'}
                validationRules={undefined}
                errorMessage={errors.project_title?.message}
                register={register}
              />
              <div className='col-span-1 md:col-span-2 lg:col-span-4 text-darkgray-600 font-semibold text-xs italic flex items-end '>
                Location
              </div>
              <LocationSelector control={control} cityMunName={'city_town'} />
              <FormInput
                name={'street'}
                label={'Street'}
                inputType={'default'}
                validationRules={undefined}
                errorMessage={errors.street?.message}
                register={register}
              />
              <FormInput
                name={'zip_code'}
                label={'Zip Code'}
                inputType={'default'}
                register={register}
                errorMessage={errors.zip_code?.message}
                validationRules={{ valueAsNumber: true }}
              />
              <div className='col-span-1 md:col-span-2 lg:col-span-4 text-darkgray-600 font-semibold text-xs italic flex items-end '>
                Duration
              </div>
              <FormInput
                name={'start_date'}
                label={'Start Date'}
                inputType={'date'}
                control={control}
                validationRules={undefined}
                errorMessage={errors.start_date?.message}
                register={register}
              />
              <FormInput
                name={'end_date'}
                label={'End Date'}
                inputType={'date'}
                control={control}
                validationRules={undefined}
                errorMessage={errors.end_date?.message}
                register={register}
              />
            </>
          ) : (
            <>
              <div className='col-span-1 md:col-span-2 lg:col-span-4 text-darkgray-600 font-semibold text-xs italic flex items-end'>
                Basic Details
              </div>
              <FormLabel label={'Client Name'} value={details?.client_name} />
              <FormLabel
                label={'Project Title'}
                value={details?.project_title}
              />

              <div className='col-span-1 md:col-span-2 lg:col-span-4 text-darkgray-600 font-semibold text-xs italic flex items-end'>
                Project Location
              </div>
              <FormLabel label={'City/Town'} value={details?.city_town} />
              <FormLabel label={'Street'} value={details?.street} />
              <FormLabel label={'State'} value={details?.state} />
              <FormLabel label={'Zip Code'} value={details?.zip_code} />

              <div className='col-span-1 md:col-span-2 lg:col-span-4 text-darkgray-600 font-semibold text-xs italic flex items-end'>
                Duration
              </div>
              <FormLabel
                label={'Start Date'}
                value={
                  details?.start_date
                    ? details.start_date.toLocaleDateString()
                    : ''
                }
              />
              <FormLabel
                label={'End Date'}
                value={
                  details?.end_date ? details.end_date.toLocaleDateString() : ''
                }
              />

              {details?.finish_date && (
                <FormLabel
                  label={'Finish Date'}
                  value={new Date(details.finish_date).toLocaleDateString()}
                />
              )}
            </>
          )}

          {isEdit && (
            <div className='w-full flex justify-end items-end col-span-1 md:col-span-2 lg:col-span-4 gap-2'>
              <Button onClick={() => setEdit(false)} variant={'outline'}>
                Cancel
              </Button>
              <GeneralDialog
                message={"Do you confirm to update this task's details?"}
                title={'Edit Task Details'}
                variant={'text'}
                type={'submit'}
                btnText={'Save Details'}
                onClick={handleSubmit(processForm)}
                className={
                  'bg-maroon-600 hover:bg-maroon-700 text-white hover:text-white'
                }
              />
            </div>
          )}
        </form>
      </FormProvider>
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
    <div className='flex flex-col gap-4 justify-center mt-5'>
      <div className='justify-center w-full shadow-md flex flex-col border-[1px] border-darkgray-200 rounded-xl p-4'>
        {/* Project Details */}
        <div className='w-full '>
          <ProjectDetails id={id} edit={edit} />
        </div>
        {/*Project Access Details */}
        {/* <div className='w-full'>
          <EditProjectAccess id={id} edit={edit} />
        </div> */}
      </div>
    </div>
  );
}
