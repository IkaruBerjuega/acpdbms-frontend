import { useForm, Controller, useFormContext } from 'react-hook-form';
import { IoWarningOutline } from 'react-icons/io5';
import { useAccounts } from '@/hooks/api-calls/admin/use-account';
import FormInput from '../../general/form-components/form-input';
import { ProjectFormSchemaType } from '@/lib/form-constants/project-constants';
import { ClientInterface } from '@/lib/definitions';

type StepInputs = ProjectFormSchemaType;

interface ClientItem {
  value: string;
  label: string;
}

export default function ProjectDetails() {
  const {
    control,
    formState: { errors },
    register,
    setValue,
  } = useFormContext<StepInputs>();

  const {
    data: clientAccounts,
    isPending,
    error,
  } = useAccounts<ClientInterface>({
    role: 'client',
    isArchived: false,
  });

  const clientItems: ClientItem[] =
    clientAccounts?.map((client) => ({
      value: String(client.id), // Convert number to string
      label: client.full_name,
    })) || [];

  return (
    <main className='flex flex-col gap-8 mb-5 w-full'>
      {/* Client Details */}
      <div className='w-full'>
        <div className='flex flex-col gap-4 w-full'>
          <div>
            <p className='font-semibold text-md text-maroon-600'>
              Client Details
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            <div className='flex flex-col col-span-1 md:col-span-2'>
              <FormInput
                control={control}
                name={'client_name'}
                label={'Client Name'}
                inputType={'search'}
                register={register}
                placeholder='Select Client'
                required={true}
                items={clientItems}
                onSelect={(item: ClientItem) => {
                  console.log('Selected item:', item);
                  console.log('Setting client_id:', Number(item.value));
                  // Convert the string id to a number for client_id
                  setValue('client_id', Number(item.value));
                  setValue('client_name', item.label);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Project Title */}
      <div className='w-full'>
        <div className='flex flex-col gap-4 w-full'>
          <div>
            <p className='font-semibold text-md text-maroon-600'>
              Project Title
            </p>
          </div>
          <div className='w-full'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
              <div className='flex flex-col col-span-1 md:col-span-2'>
                <FormInput
                  name={'project_title'}
                  label={'Project Title'}
                  inputType={'default'}
                  register={register}
                  required={true}
                  placeholder='Enter Project Title'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Location */}
      <div className='w-full'>
        <div className='flex flex-col gap-4'>
          <div>
            <p className='font-semibold text-md text-maroon-600'>
              Project Location
            </p>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
            {/* State */}
            <FormInput
              name={'state'}
              label={'State'}
              inputType={'default'}
              register={register}
              placeholder='Enter State'
              required={true}
            />
            {/* City/Town */}
            <FormInput
              name={'city_town'}
              label={'City/Town'}
              inputType={'default'}
              placeholder='Enter City/Town'
              register={register}
              required={true}
            />
            {/* Street */}
            <FormInput
              name={'street'}
              label={'Street'}
              inputType={'default'}
              placeholder='Enter Street'
              register={register}
              required={true}
            />
            {/* Zip Code */}
            <FormInput
              name={'zip_code'}
              label={'Zip Code'}
              inputType={'default'}
              placeholder='Enter Zip Code'
              register={register}
              required={true}
            />
          </div>
        </div>
      </div>

      {/* Project Date */}
      <div className='w-full'>
        <div className='flex flex-col gap-4'>
          <div>
            <p className='font-semibold text-md text-maroon-600'>
              Project Date
            </p>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
            {/* Start Date */}
            <FormInput
              name={'start_date'}
              label={'Start Date'}
              register={register}
              control={control}
              inputType={'date'}
              placeholder='Start Date'
              required={true}
            />
            {/* End Date */}
            <FormInput
              name={'end_date'}
              label={'End Date'}
              register={register}
              control={control}
              inputType={'date'}
              placeholder='End Date'
              required={true}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
