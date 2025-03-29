import Image from 'next/image';

export function Logo() {
  return (
    <div className='flex justify-center '>
      <Image
        src='/photos/logo_red_large.png'
        width={100}
        height={100}
        alt='Logo'
      />
    </div>
  );
}
