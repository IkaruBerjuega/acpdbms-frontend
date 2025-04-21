'use client';

import React from 'react';
import { FaRegUser } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/api-calls/admin/use-dashboard';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getInitialsFallback } from '@/lib/utils';

export default function UserComponent() {
  const { onlineUsers } = useDashboard();

  const UserItem = ({
    profile,
    name,
    position,
  }: {
    profile: string | null;
    name: string;
    position: string;
  }) => (
    <div className='flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition-colors'>
      <div className='relative mr-3'>
        <Avatar className='w-10 h-10 border'>
          {profile ? (
            <AvatarImage
              src={profile}
              alt={`${name}'s avatar`}
            />
          ) : (
            <AvatarFallback>{getInitialsFallback(name)}</AvatarFallback>
          )}
        </Avatar>
        <span className='absolute top-0 right-0 block w-2 h-2 bg-green-500 rounded-full border-2 border-white-primary' />
      </div>
      <div className='flex flex-col'>
        <p className='font-medium text-[15px] text-sm text-gray-900'>{name}</p>
        <p className='text-xs text-gray-500'>{position}</p>
      </div>
    </div>
  );

  // loading skeleton
  if (onlineUsers.isLoading || !onlineUsers.data) {
    return (
      <div className='h-[435px] flex flex-col bg-white-primary rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow p-6'>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-lg font-bold text-primary'>Online Users</p>
          <Skeleton className='bg-gray-300 w-[60px] h-[35px] rounded-md' />
        </div>
        <div className='overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 px-4 py-2 flex-grow border border-gray-200 rounded-md space-y-3'>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              className='bg-gray-300 h-12 rounded-md w-full'
            />
          ))}
        </div>
      </div>
    );
  }

  const users = Array.isArray(onlineUsers.data) ? onlineUsers.data : [];

  return (
    <div className='h-[435px] flex flex-col bg-white-primary rounded-lg border border-gray-300 shadow hover:shadow-md transition-shadow p-6'>
      <div className='flex items-center justify-between mb-4'>
        <p className='text-lg font-bold text-primary'>Online Users</p>
        <div className='rounded-lg bg-white-primary w-[60px] h-[35px] flex justify-evenly items-center'>
          <FaRegUser className='text-green-600' />
          <p className='text-green-600'>{users.length}</p>
        </div>
      </div>
      <div className='overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 px-4 py-2 flex-grow border border-gray-200 rounded-md space-y-3'>
        {users.length === 0 ? (
          <div className='w-full h-full flex justify-center items-center text-lg text-gray-500'>
            <p>No Online Users</p>
          </div>
        ) : (
          users.map((user, idx) => (
            <UserItem
              key={idx}
              profile={user.profile_picture_url ?? null}
              name={user.name}
              position={user.role}
            />
          ))
        )}
      </div>
    </div>
  );
}
