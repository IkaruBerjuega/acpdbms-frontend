'use client';

import { FaRegUser } from 'react-icons/fa';
import Users from './user-content';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/api-calls/admin/use-dashboard';

interface User {
  profile?: string;
  name: string;
  role: string;
}

export default function UserComponent() {
  const { onlineUsers } = useDashboard();

  // Show skeletons if loading or if data hasn't been fetched yet.
  if (onlineUsers.isLoading || !onlineUsers.data) {
    return (
      <div className='flex flex-col bg-white-primary rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-shadow p-6 h-1/2'>
        <div className='flex rounded-full justify-between mb-4'>
          <p className='text-xl font-bold text-primary'>User</p>
          <Skeleton className='bg-darkgray-200 w-[60px] h-[35px] rounded-xl' />
        </div>
        <div className='overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 p-4 flex-grow border-[1px] rounded-xl space-y-2'>
          {[1, 2, 3, 4].map((index) => (
            <Skeleton
              key={index}
              className='bg-gray-400 h-[50px] rounded-xl w-full'
            />
          ))}
        </div>
      </div>
    );
  }

  // Cast the fetched data to the expected User array.
  const users = onlineUsers.data as User[];

  return (
    <div className='flex flex-col bg-white-primary rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-shadow p-6 h-1/2'>
      <div className='flex justify-between mb-4'>
        <p className='text-xl font-bold text-primary'>User</p>
        <div className='rounded-full bg-white-primary w-[60px] h-[35px] flex justify-evenly items-center'>
          <FaRegUser className='text-green-600' />
          <p className='text-green-600'>{users.length}</p>
        </div>
      </div>
      <div className='overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 p-4 flex-grow border-[1px] rounded-xl space-y-2'>
        {users.length === 0 ? (
          <p className='text-center text-gray-500'>No Online User</p>
        ) : (
          users.map((user, index) => (
            <div
              key={index}
              className='flex justify-start items-center space-x-3 mb-3'
            >
              <Users
                profile={user.profile || ''}
                name={user.name}
                position={user.role}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
