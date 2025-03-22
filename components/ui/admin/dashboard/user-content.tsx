import { MdAccountCircle } from 'react-icons/md';
import Image from 'next/image';

interface UserData {
  profile: string;
  name: string;
  position: string;
}

const Users = ({ profile, name, position }: UserData) => {
  return (
    <div className='flex flex-col  w-full space-y-3  items-center rounded-xl'>
      <div className='flex justify-between items-center space-x-3 w-full  hover:bg-[#2222] p-1'>
        <div className='relative'>
          {profile ? (
            <Image
              src={profile}
              alt='User Profile'
              width={35}
              height={35}
              className='rounded-full'
            />
          ) : (
            <MdAccountCircle className='text-maroon-700 text-4xl' />
          )}
          <div className='absolute top-1 right-1 pl-2 w-2 h-2 bg-green-500 rounded-full border border-white'></div>
        </div>
        <div className='flex flex-col  flex-1 '>
          <p className='font-medium text-[15px]'>{name}</p>
          <p className='font-extralight text-[14px] text-[#7B7B7B]'>
            {position}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Users;
