'use client';
import React from 'react';
import { CiClock1 } from 'react-icons/ci';
import { MdAccountCircle } from 'react-icons/md';
import Image from 'next/image';

import { TicketData } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/api-calls/admin/use-dashboard';

const ProjectUpdatesList = () => {
  const { ticketsWithDetails } = useDashboard();

  // Show skeletons while loading or if data is not available
  if (ticketsWithDetails.isLoading || !ticketsWithDetails.data) {
    return (
      <div className='flex flex-col space-y-2 w-full'>
        {[1, 2, 3].map((index) => (
          <Skeleton
            key={index}
            className='bg-darkgray-200 h-[50px] rounded-xl w-full'
          />
        ))}
      </div>
    );
  }

  // Display error message if there is an error
  if (ticketsWithDetails.error) {
    return <p className='text-red-500'>{ticketsWithDetails.error.message}</p>;
  }

  // Cast the fetched data to the expected TicketData array
  const tickets = ticketsWithDetails.data as TicketData[];

  if (!Array.isArray(tickets)) {
    return (
      <div className='flex flex-col space-y-2 w-full'>
        {[1, 2, 3].map((index) => (
          <Skeleton
            key={index}
            className='bg-darkgray-200 h-[50px] rounded-xl w-full'
          />
        ))}
      </div>
    );
  }

  // Show a fallback if there are no tickets
  if (tickets.length === 0) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        <p className='text-center text-gray-500'>No Projects Update</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col space-y-3 w-full'>
      {tickets.map((ticket) => (
        <div
          key={ticket.ticket_id}
          className='flex w-full flex-col space-y-2 hover:bg-[#2222] p-1'
        >
          <div className='flex justify-center items-center space-x-3'>
            {/* If user_name is not provided, show a placeholder image; otherwise show the account icon */}
            {!ticket.user_name ? (
              <Image
                src='https://via.placeholder.com/35'
                alt='User Profile'
                width={35}
                height={35}
                className='rounded-full'
              />
            ) : (
              <MdAccountCircle className='text-maroon-700 text-4xl' />
            )}
            <div className='flex flex-col flex-1'>
              <p className='font-medium text-[15px]'>
                {ticket.user_name || 'User'}
              </p>
              <p className='font-light text-[14px]'>{ticket.content}</p>
              <div className='flex items-center space-x-1'>
                <CiClock1 className='w-[14px]' />
                <p className='text-[12px] text-[#7B7B7B]'>{ticket.date}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectUpdatesList;
