'use client';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/api-calls/admin/use-dashboard';
import { TicketData } from '@/lib/definitions';
import { Avatar, AvatarImage, AvatarFallback } from '../../avatar';
import { getInitialsFallback } from '@/lib/utils';

function capitalizeFirstLetter(text: string) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function ProjectUpdates() {
  const ProjectUpdate = () => {
    const { ticketsWithDetails } = useDashboard();

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

    const tickets = ticketsWithDetails.data as unknown as TicketData[];

    if (tickets.length === 0) {
      return (
        <div className='w-full h-full flex justify-center items-center text-lg text-gray-500'>
          <p>No Data Available</p>
        </div>
      );
    }

    return (
      <div className='flex flex-col space-y-3'>
        {tickets.map((ticket) => {
          const status = ticket.status?.toLowerCase();
          const statusClass =
            status === 'new'
              ? 'text-blue-500 font-semibold'
              : 'text-slate-500 font-normal';

          return (
            <div
              key={ticket.ticket_id}
              className='flex items-start space-x-3 p-3 rounded-md hover:bg-gray-100 transition-colors'
            >
              {/* Avatar */}
              <Avatar className='w-8 h-8 border'>
                {ticket.profile_picture_url ? (
                  <AvatarImage
                    src={ticket.profile_picture_url}
                    alt='User'
                  />
                ) : (
                  <AvatarFallback>
                    {getInitialsFallback(ticket.user_name || 'User')}
                  </AvatarFallback>
                )}
              </Avatar>

              {/* Content Column */}
              <div className='flex-1 flex flex-col'>
                <div className='flex justify-between items-center'>
                  <p className='font-medium text-[15px]'>
                    {ticket.user_name || 'User'}
                  </p>
                </div>

                {/* Main Content */}
                <p className='font-light text-sm mt-1'>{ticket.content}</p>

                {/* Category • Date */}
                <div className='flex items-center space-x-1 text-[12px] mt-1'>
                  <p className='text-primary'>
                    {capitalizeFirstLetter(ticket.category || '')}
                  </p>
                  <span className='text-gray-500'>•</span>
                  <span className='text-gray-500'>{ticket.date}</span>
                  <span className='text-gray-500'>•</span>
                  <span className={`text-[12px] ${statusClass}`}>
                    {capitalizeFirstLetter(status || '')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className='h-[440px] flex flex-col bg-white-primary rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow p-6'>
      <div className='text-primary mb-4'>
        <p className='text-lg font-bold'>System Updates</p>
      </div>
      <div className='overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 px-4 py-2 flex-grow border border-gray-200 rounded-md'>
        <ProjectUpdate />
      </div>
    </div>
  );
}
