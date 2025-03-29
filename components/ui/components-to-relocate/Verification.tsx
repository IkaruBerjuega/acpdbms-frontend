import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface VerificationProps {
  onSuccess: () => void; // onSuccess prop
}

export function Verification({ onSuccess }: VerificationProps) {
  const methods = useForm<{ email: string; password: string }>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = methods;

  const handleFormSubmit = (data: { email: string; password: string }) => {
    console.log(data);
    // Call onSuccess after successful form submission
    onSuccess();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className='p-4'>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-semibold text-maroon-700'
          >
            Admin Email
          </label>
          <Input
            type='email'
            id='email'
            placeholder='Email'
            className='w-full border-darkgray-600 rounded-lg focus:border-maroon-700 focus:outline-none focus:ring-2 focus:ring-maroon-700 pl-4 pr-10'
            {...register('email', { required: 'Required' })}
            onBlur={() => trigger('email')}
          />
          <div className='min-h-5'>
            {errors.email?.message && (
              <span className='text-destructive block pt-1 text-xs'>
                {errors.email.message}
              </span>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-semibold text-maroon-700 mt-4'
          >
            Password
          </label>
          <Input
            type='password'
            id='password'
            placeholder='Password'
            className='border-darkgray-600 rounded-lg focus:border-maroon-700 focus:outline-none focus:ring-2 focus:ring-maroon-700'
            {...register('password', { required: 'Required' })}
            onBlur={() => trigger('password')}
          />
          <div className='min-h-5'>
            {errors.password?.message && (
              <span className='text-destructive block pt-1 text-xs'>
                {errors.password.message}
              </span>
            )}
          </div>
        </div>

        <Button
          type='submit'
          className='mt-4 w-full bg-maroon-700 hover:bg-maroon-800'
        >
          Update
        </Button>
      </form>
    </FormProvider>
  );
}
