import Image from 'next/image';
import LoginForm from '../../components/ui/login/login-form';

export default function Login() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-[url("/bg.png")] bg-cover'>
      <div className='flex w-full max-w-lg sm:max-md:min-h-80 lg:max-w-4xl p-8'>
        <div className='flex w-full rounded-lg bg-white-primary overflow-hidden'>
          <div className='flex-column w-full p-4 lg:w-1/2 lg:p-6'>
            <div className='flex justify-center mx-0'>
              <Image
                src='/red-logo-name.svg'
                width={150}
                height={0}
                draggable={false}
                alt='Logo'
              />
            </div>
            <div className='flex justify-center mx-auto mt-8'>
              <h1 className='block text-xl lg:text-2xl text-maroon-800'>
                WELCOME BACK
              </h1>
            </div>
            <LoginForm />
          </div>
          {/* right side of the login page */}
          <div className='hidden lg:flex lg:w-1/2 bg-eerieblack'>
            <div className='ml-auto -mr-8'>
              <Image
                src='/login-building.png'
                width={442}
                height={600}
                style={{ objectFit: 'contain' }}
                draggable={false}
                alt='Building'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
