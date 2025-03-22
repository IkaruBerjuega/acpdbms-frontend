'use client';
import { useFormContext } from 'react-hook-form';
import FormInput from '../../general/form-components/form-input';
import { Card, CardContent } from '@/components/ui/card';
import { firstLogin } from '@/lib/form-constants/form-constants';
import { requireError } from '@/lib/utils';

export function Address() {
  const {
    register,
    formState: { errors },
  } = useFormContext<firstLogin>();

  return (
    <Card className='border-none shadow-md w-auto md:min-w-[414px] md:min-h-[468px]'>
      <CardContent className='p-8'>
        <div>
          <p className='font-semibold text-md text-primary w-full'>Address</p>
        </div>
        <div className='flex flex-col w-full gap-4 mt-4'>
          {/* State */}
          <FormInput
            name='state'
            label='State'
            inputType='default'
            placeholder='Ex. California'
            register={register}
            validationRules={{ required: requireError('State') }}
            required={true}
          />
          {/* City/Town */}
          <FormInput
            name='city_town'
            label='City/Town'
            inputType='default'
            register={register}
            placeholder='Ex. Los Angeles'
            validationRules={{ required: requireError('City/Town') }}
            required={true}
          />
          {/* Street */}
          <FormInput
            name='street'
            label='Street'
            inputType='default'
            register={register}
            placeholder='Ex. 123 Sunset Blvd'
            validationRules={{ required: requireError('Street') }}
            required={true}
          />
          {/* Zip Code */}
          <FormInput
            name='zip_code'
            label='Zip Code'
            inputType='default'
            register={register}
            placeholder='90028'
            dataType='number'
            validationRules={{
              valueAsNumber: true,
              required: requireError('Phone Number'),
            }}
            required={true}
          />
        </div>
      </CardContent>
    </Card>
  );
}
