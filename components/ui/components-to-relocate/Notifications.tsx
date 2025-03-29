import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Notifications() {
  const [isSystemEnabled, setIsSystemEnabled] = useState(false);
  const [isEmailEnabled, setIsEmailEnabled] = useState(false);

  const handleSystemToggle = () => {
    setIsSystemEnabled((prev) => !prev);
  };

  const handleEmailToggle = () => {
    setIsEmailEnabled((prev) => !prev);
  };

  return (
    <div className='flex flex-col w-full mx-auto gap-5'>
      <div className='w-full p-2 border-2 border-darkgray-300 rounded-lg'>
        <div className={' text-maroon-700 grid grid-row-1 md:grid-cols-4'}>
          <div className='flex flex-col gap-2 col-span-3'>
            <h3 className='text-base font-bold'>Enable system notifications</h3>
            <p className='text-sm'>
              Enabling this will allow the system to update you about the
              resistance using the notifications dropdown
            </p>
          </div>
          <div className='col-span-1 flex justify-end'>
            <Button
              variant={isSystemEnabled ? 'outline' : 'default'}
              className={`px-8 h-8 justify-end mt-4 md:mt-12 ${
                isSystemEnabled
                  ? 'hover:text-maroon-700 hover:bg-white-100 border-maroon-700'
                  : 'bg-maroon-700 hover:bg-maroon-700'
              }`}
              onClick={handleSystemToggle}
            >
              {isSystemEnabled ? 'Enable' : 'Disable'}
            </Button>
          </div>
        </div>
      </div>

      <div className='w-full p-2 border-2 border-darkgray-300 rounded-lg'>
        <div className={' text-maroon-700 grid grid-row-1 md:grid-cols-4'}>
          <div className='flex flex-col gap-2 col-span-3'>
            <h3 className='text-base font-bold'>Enable email notifications</h3>
            <p className='text-sm'>
              Enabling this will allow the system to send you updates about your
              residence to your email
            </p>
          </div>
          <div className='col-span-1 flex justify-end'>
            <Button
              variant={isEmailEnabled ? 'outline' : 'default'}
              className={`px-8 h-8 justify-end mt-4 md:mt-12 ${
                isEmailEnabled
                  ? 'hover:text-maroon-700 hover:bg-white-100 border-maroon-700'
                  : 'bg-maroon-700 hover:bg-maroon-700'
              }`}
              onClick={handleEmailToggle}
            >
              {isEmailEnabled ? 'Enable' : 'Disable'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
