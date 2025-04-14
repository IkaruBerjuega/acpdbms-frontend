import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import FormInput from '../../general/form-components/form-input';
import {
  useAccountSettings,
  getAccountSettings,
} from '@/hooks/general/use-account-settings';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent } from '../../popover';
import { useQueryClient } from '@tanstack/react-query';
import { LoginSchemaType } from '@/lib/form-constants/form-constants';
import { emailPattern } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../card';
import { AlertDialog } from '@radix-ui/react-alert-dialog';
import { AlertDialogContent } from '../../alert-dialog';
import { UserInfoInterface } from '@/lib/definitions';

export default function AccountSecurity() {
  const { getUser } = getAccountSettings<any>();
  const { checkEmail, send2FA, update2FA, changePass } =
    useAccountSettings<any>();

  const [editMode, setEditMode] = useState(false);
  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [emailToUpdate, setEmailToUpdate] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const { data, isLoading, error } = getUser;
  const queryClient = useQueryClient();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      new_email: '',
      twoFactorCode: '',
      current_password: '',
      new_password: '',
      confirm_new_password: '', // Added new field
    },
  });

  const {
    register,
    watch,
    handleSubmit,
    setError,
    resetField,
    formState: { errors },
  } = methods;

  const watchedEmail = watch('new_email');
  const watchedNewPassword = watch('new_password');
  const watchedConfirmPassword = watch('confirm_new_password');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchedEmail && emailPattern.test(watchedEmail)) {
        checkEmail.mutate(
          { new_email: watchedEmail },
          {
            onSuccess: () => {
              setIsEmailValid(true);
            },
            onError: (err) => {
              setIsEmailValid(false);
              setError('new_email', {
                type: 'manual',
                message: err.message || 'Email is already taken',
              });
            },
          }
        );
      } else {
        setIsEmailValid(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [watchedEmail]);

  const handleSend2FA = (email: string) => {
    try {
      // Call the send2FA API mutation to send the code
      send2FA.mutate({ email });

      // If successful, update the UI to reflect that the code was sent
      setCodeSent(true);
      setEmailToUpdate(email);
      alert('2FA code sent successfully to your email.');
    } catch (error: any) {
      // Check if error has a response and handle accordingly
      if (error?.response?.status === 422) {
        // This could be a validation error or email already in use
        if (error?.response?.data?.message) {
          alert(error?.response?.data?.message);
        } else {
          alert('Invalid email format. Please enter a valid email.');
        }
      } else if (error?.response?.status === 429) {
        // Handle too many requests error (waiting for previous code to expire)
        const remainingSeconds = error?.response?.data?.remaining_seconds;
        alert(
          `Please wait for ${remainingSeconds} seconds before requesting a new code.`
        );
      } else if (error?.response?.status === 500) {
        // Server error while sending the email
        alert('Failed to send 2FA code. Please try again later.');
      } else {
        // General catch for any other error
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleUpdateEmail = (formData: any) => {
    update2FA.mutate(
      {
        new_email: formData.new_email,
        two_factor_code: formData.twoFactorCode,
      },
      {
        onSuccess: (data) => {
          alert(data.message);
          queryClient.invalidateQueries({ queryKey: ['user'] });
          setEditMode(false);
          setCodeSent(false);
          setEmailToUpdate('');
          resetField('new_email');
          resetField('twoFactorCode');
        },
        onError: (err) => {
          setError('twoFactorCode', {
            type: 'manual',
            message: err.message || 'Invalid 2FA code',
          });
        },
      }
    );
  };

  const handleUpdatePassword = (formData: any) => {
    // Check if passwords match before submitting
    if (formData.new_password !== formData.confirm_new_password) {
      setError('confirm_new_password', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    changePass.mutate(
      {
        current_password: formData.current_password,
        new_password: formData.new_password,
      },
      {
        onSuccess: (data) => {
          alert(data.message);
          queryClient.invalidateQueries({ queryKey: ['user'] });
          setPasswordEditMode(false);
          resetField('current_password');
          resetField('new_password');
          resetField('confirm_new_password');
        },
        onError: (err: any) => {
          const errorData = err?.message as {
            current_password?: string[];
            new_password?: string[];
          };

          if (errorData?.current_password?.[0]) {
            setError('current_password', {
              type: 'manual',
              message: errorData.current_password[0],
            });
          }

          if (errorData?.new_password?.[0]) {
            setError('new_password', {
              type: 'manual',
              message: errorData.new_password[0],
            });
          }
        },
      }
    );
  };

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg'>Email</CardTitle>
            {!editMode && (
              <Button className='flex' onClick={() => setEditMode(true)}>
                Change Email
              </Button>
            )}
          </div>
          <CardDescription>Current Email: {data?.email}</CardDescription>
        </CardHeader>

        {editMode && (
          <CardContent className='space-y-4'>
            <form
              onSubmit={handleSubmit(handleUpdateEmail)}
              className='space-y-4'
            >
              <FormInput
                name='new_email'
                dataType='email'
                inputType='default'
                label='New Email'
                placeholder='Enter new email'
                register={register}
                required
                errorMessage={errors.new_email?.message}
              />

              {!watchedEmail && (
                <p className='text-sm text-muted-foreground ml-1'>
                  Please enter your new email.
                </p>
              )}

              {watchedEmail && !errors.new_email && isEmailValid && (
                <p className='text-sm text-green-600 ml-1'>
                  Email is available!
                </p>
              )}

              <Button
                type='button'
                disabled={!watchedEmail || !!errors.new_email || !isEmailValid}
                onClick={() => handleSend2FA(watchedEmail)}
              >
                Send 2FA to Email
              </Button>

              {codeSent && (
                <FormInput
                  name='twoFactorCode'
                  label='2FA Code'
                  inputType='default'
                  placeholder='Enter 2FA code'
                  register={register}
                  required
                  errorMessage={errors.twoFactorCode?.message}
                />
              )}

              {codeSent && <Button type='submit'>Update Email</Button>}
            </form>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg'>Password</CardTitle>
            {!passwordEditMode && (
              <Button onClick={() => setPasswordEditMode(true)}>
                Change Password
              </Button>
            )}
          </div>
        </CardHeader>

        {passwordEditMode && (
          <CardContent className='space-y-4'>
            <form
              onSubmit={handleSubmit(handleUpdatePassword)}
              className='space-y-4'
            >
              <FormInput
                name='current_password'
                dataType='password'
                inputType='default'
                label='Current Password'
                placeholder='Enter current password'
                register={register}
                required
                errorMessage={errors.current_password?.message}
              />

              <FormInput
                name='new_password'
                dataType='password'
                inputType='default'
                label='New Password'
                placeholder='Enter new password'
                register={register}
                required
                errorMessage={errors.new_password?.message}
              />

              <FormInput
                name='confirm_new_password'
                dataType='password'
                inputType='default'
                label='Confirm New Password'
                placeholder='Re-enter new password'
                register={register}
                required
                errorMessage={errors.confirm_new_password?.message}
              />

              {watchedNewPassword &&
                watchedConfirmPassword &&
                watchedNewPassword === watchedConfirmPassword &&
                !errors.new_password &&
                !errors.confirm_new_password && (
                  <p className='text-sm text-green-600 ml-1'>
                    Passwords match!
                  </p>
                )}

              <Button type='submit'>Update Password</Button>
            </form>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
