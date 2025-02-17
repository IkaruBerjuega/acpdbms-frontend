'use client';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import FormInput from '@/components/ui/general/form-components/input';
import { Checkbox } from '@/components/ui/checkbox';
import LoginButton from './login-button';
import {
  LoginSchemaType,
  loginSchema,
} from '../../../lib/form-constants/login-constants';

export default function LoginForm({}) {
  const methods = useForm<LoginSchemaType>({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  // This is a placeholder for Login Hook, remove pag meron na
  const useLogin = () => {
    return {
      login: async ({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) => {
        console.log('Logging in with', email, password);
        return { success: true };
      },
      loading: false,
      error: null,
    };
  };

  const { handleSubmit, register } = methods;

  const { login, loading, error } = useLogin();

  const processForm: SubmitHandler<LoginSchemaType> = async (data) => {
    const response = await login(data);
  };

  const emailValidation = {
    required: 'Email is required',
  };

  const passwordValidation = {
    required: 'Password is required',
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(processForm)}>
        <div className='text-red-500 justify-center text-center h-6 text-sm mt-2'>
          {error && <p>{error}</p>}
        </div>

        <div className='mt-8'>
          <FormInput
            name={'email'}
            dataType='email'
            inputType='default'
            validationRules={emailValidation}
            label={''}
            placeholder={'Enter Email'}
            register={register}
            required={false}
          />
        </div>
        <div className='mt-4'>
          <FormInput
            name={'password'}
            dataType='password'
            inputType='default'
            validationRules={passwordValidation}
            label={''}
            placeholder={'Enter Password'}
            register={register}
            required={false}
          />
        </div>

        <div className='flex items-center justify-between mt-4'>
          <div className='flex items-center'>
            <Checkbox
              id='remember-me'
              {...register('rememberMe')}
              className='border-black rounded data-[state=checked]:bg-eerieblack'
            />
            <label
              htmlFor='remember-me'
              className='text-xs ml-2 text-gray-800 hover:underline leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Remember Me
            </label>
          </div>
        </div>

        <div className='mt-6'>
          <LoginButton loading={loading} />
        </div>
      </form>
    </FormProvider>
  );
}
