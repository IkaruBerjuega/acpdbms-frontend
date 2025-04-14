'use client';
import React from 'react';
import { CiClock1 } from 'react-icons/ci';
import { MdAccountCircle } from 'react-icons/md';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/api-calls/admin/use-dashboard';
import { TicketData } from '@/lib/definitions';

export default function ProjectUpdates() {
  const ProjectUpdate = () => {
    const { ticketsWithDetails } = useDashboard();

    // skeletons
    if (ticketsWithDetails.isLoading) {
      return (
        <div className='space-y-3'>
          {[1, 2, 3, 4, 5].map((index) => (
            <Skeleton
              key={index}
              className='bg-gray-300 h-12 rounded-md w-full'
            />
          ))}
        </div>
      );
    }

    if (ticketsWithDetails.error) {
      return <p className='text-red-500'>{ticketsWithDetails.error.message}</p>;
    }

    const tickets = ticketsWithDetails.data as TicketData[];

    if (tickets.length === 0) {
      return (
        <div className='w-full h-full flex justify-center items-center text-lg text-gray-500'>
          <p>No Data Available</p>
        </div>
      );
    }

    // render the list of tickets
    return (
      <div className='flex flex-col w-full space-y-3'>
        {tickets.map((ticket) => (
          <div
            key={ticket.ticket_id}
            className='flex flex-col p-3 rounded-md hover:bg-gray-100 transition-colors'
          >
            <div className='flex justify-between'>
              <div className='flex items-center space-x-3'>
                {!ticket.user_name ? (
                  <Image
                    src='https://via.placeholder.com/35'
                    alt='User Profile'
                    width={35}
                    height={35}
                    className='rounded-full'
                  />
                ) : (
                  <MdAccountCircle className='text-primary text-4xl' />
                )}
                <p className='font-medium text-[15px]'>
                  {ticket.user_name || 'User'}
                </p>
              </div>

              <div className='flex flex-col items-center'>
                <span className='text-[12px] text-gray-600'>
                  {ticket.status}
                </span>
              </div>
            </div>

            <div className='flex flex-col mt-2'>
              <p className='text-xs text-primary'>
                <strong>Category: </strong>
                {ticket.category}
              </p>
              <p className='font-light text-sm'>{ticket.content}</p>
              <div className='flex items-center space-x-1'>
                <CiClock1 className='w-[14px]' />
                <p className='text-[12px] text-gray-500'>{ticket.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='h-[440px] flex flex-col bg-white-primary rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow p-6'>
      <div className='text-primary mb-4'>
        <p className='text-lg font-bold'>System Updates</p>
      </div>
      <div className='overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 px-4 py-2 flex-grow border border-gray-200 rounded-md space-y-3'>
        <ProjectUpdate />
      </div>
    </div>
  );
}
