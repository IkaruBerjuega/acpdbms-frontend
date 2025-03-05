'use client';

import { FaTriangleExclamation } from 'react-icons/fa6';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import { ProjectFormSchemaType } from '@/lib/form-constants/project-constants';
import { Dialog } from '../../general/dialog-custom';
import StepperIndicator from './stepper';
import ProjectDetails from './project-details';
import { toast } from '@/hooks/use-toast';
import { useAddProject } from '@/hooks/api-calls/admin/use-add-project';

const defaultValues: ProjectFormSchemaType = {
  client_id: undefined,
  client_name: '',
  project_title: '',
  state: '',
  city_town: '',
  street: '',
  zip_code: undefined,
  status: 'ongoing',
  image_url:
    'https://scontent.fcrk1-5.fna.fbcdn.net/v/t39.30808-6/422698331_877393341058901_3120897789009871049_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=qOLzxf2J41MQ7kNvgEn7eAO&_nc_zt=23&_nc_ht=scontent.fcrk1-5.fna&_nc_gid=AIJFexT1K0_qCR78m0kJimG&oh=00_AYDWysoIAWi2w9PjRNRWoRzsLvd4CkFpYMLta3efL1j_qg&oe=6715A93A',
  start_date: undefined,
  end_date: undefined,
};

const steps = [
  {
    id: 'Step 1',
    name: 'Project Details',
    fields: [
      'client_name',
      'project_title',
      'state',
      'city_town',
      'street',
      'zip_code',
      'start_date',
      'end_date',
    ],
  },
];

function getStepContent(step: number) {
  if (step === 0) {
    return <ProjectDetails />;
  }
  return 'Unknown step';
}

export default function HookMultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const constRouter = useRouter();

  const methods = useForm<ProjectFormSchemaType>({
    mode: 'onSubmit',
    defaultValues,
  });

  const {
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;

  const resetForm = () => {
    constRouter.push('/admin/projects');
    toast({
      title: 'Notification',
      description: 'New Project Added.',
    });
  };

  const { mutate: handleAddProject } = useAddProject();

  const processForm: SubmitHandler<ProjectFormSchemaType> = (data) => {
    const formData = new FormData();

    // Append fields to FormData
    formData.append('client_id', data.client_id?.toString() || '');
    formData.append('client_name', data.client_name);
    formData.append('project_title', data.project_title);
    formData.append('state', data.state);
    formData.append('city_town', data.city_town);
    formData.append('street', data.street);
    formData.append('zip_code', data.zip_code?.toString() || '');
    formData.append(
      'start_date',
      data.start_date ? data.start_date.toISOString().split('T')[0] : ''
    );
    formData.append(
      'end_date',
      data.end_date ? data.end_date.toISOString().split('T')[0] : ''
    );
    formData.append('status', data.status);
    formData.append('image_url', data.image_url);

    console.log('FormData entries:', Array.from(formData.entries()));

    handleAddProject(formData, {
      onSuccess: () => {
        resetForm();
      },
      onError: (error) => {
        console.error('Error adding project', error);
      },
    });
  };

  type FieldName = keyof ProjectFormSchemaType;
  type FieldPath = FieldName; // Only step 1 fields are used

  const next = async () => {
    // Validate current step fields
    const fields: FieldPath[] = steps[currentStep].fields as FieldPath[];
    const values = methods.getValues(fields);
    console.log('Field Values:', values);

    const output = await trigger(fields, { shouldFocus: true });
    console.log('Validation Output:', output);
    console.log('Validation Errors:', methods.formState.errors);

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Submitting Form');
      handleSubmit(processForm)();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepLabels = ['Project Details'];

  return (
    <FormProvider {...methods}>
      <div className='lg:px-10'>
        <StepperIndicator
          stepLabels={stepLabels}
          activeStep={currentStep + 1}
        />
        {errors.root?.formError && (
          <Alert
            variant='destructive'
            className='mt-[28px]'
          >
            <FaTriangleExclamation className='h-4 w-4' />
            <AlertTitle>Form Error</AlertTitle>
            <AlertDescription>
              {errors.root?.formError?.message}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(processForm)}>
          {getStepContent(currentStep)}
          <div className='flex justify-end space-x-[20px] h-[100px] items-end'>
            {currentStep !== 0 && (
              <Button
                type='button'
                className='w-[100px]'
                variant='secondary'
                onClick={prev}
              >
                Back
              </Button>
            )}
            {currentStep === steps.length - 1 ? (
              <Dialog
                label={'Submit'}
                dialogTitle={'Are you sure you want to add this project?'}
                dialogDescription={
                  'Make sure to confirm everything before submitting.'
                }
                className='w-[100px] bg-gray-800 hover:bg-primary text-white-primary hover:text-white-primary'
                dialogCancel={'Cancel'}
                dialogAction={'Submit'}
                onClick={next}
              />
            ) : (
              <Button
                type='button'
                className='w-[100px] bg-gray-800 hover:bg-primary text-white-primary hover:text-white-primary'
                onClick={next}
              >
                Next
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
