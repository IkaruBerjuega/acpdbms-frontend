import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PiDotsThreeVerticalBold } from 'react-icons/pi';
import cx from 'classnames';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default function Card({
  row,
  fn,
}: {
  row: any;
  isClient: boolean;
  fn: (projectId?: string, projectName?: string) => void;
}) {
  const customLoader = ({ src }: { src: string }) => {
    return src;
  };
  return (
    <div
      key={row.id}
      className='flex flex-col col-span-1 h-[300px] cursor-pointer sm:h-[350px] bg-white shadow-md rounded-xl overflow-hidden '
      onClick={() =>
        fn(
          row.getValue('id') as string,
          row.getValue('project_title') as string
        )
      }
    >
      <div className='w-full h-[74%] bg-gray shadow-sm'>
        <div className='relative w-full h-[70%] flex justify-center items-center'>
          {row.getValue('image_url') ? (
            <Image
              loader={customLoader}
              src={
                'https://media.istockphoto.com/id/1217618992/photo/3d-house.jpg?s=612x612&w=0&k=20&c=brVxRkoQX9q-2TwiyjgjYyNJrBCs-j41J34fLVp3pdA='
              }
              alt='Project'
              className='object-cover' // Ensures the image covers the parent div
              layout='fill' // Use layout='fill' to fill the parent div
            />
          ) : (
            <p className='text-white font-semibold'>No Image</p>
          )}
        </div>

        <div className='w-full h-[30%] bg-white flex flex-row py-2 justify-between'>
          <div className='flex flex-col px-4'>
            <p className='text-md sm:text-lg font-semibold text-maroon-700'>
              {row.getValue('project_title')}
            </p>
            <p className='text-darkgray-400 text-sm sm:text-md'>
              {row.getValue('location')}
            </p>
          </div>

          <div className='px-2' onClick={(e) => e.stopPropagation()}>
            {/* Prevent click event from bubbling up */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className='h-8 w-8'>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <PiDotsThreeVerticalBold className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side='bottom' align='end' sideOffset={8}>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents card click
                    navigator.clipboard.writeText(row.getValue('project_id'));
                  }}
                >
                  <Link href={`/admin/projects/${row.getValue('id')}/view`}>
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <DropdownMenuSeparator />
      <div className='w-full h-[25%] flex flex-row px-4 py-2 text-sm'>
        <div className='flex flex-col w-[80%] h-full'>
          <p className='font-semibold'>
            Client Name:{' '}
            <span className='font-normal'>{row.getValue('client_name')}</span>
          </p>
          <p className='font-semibold'>
            Project Timeline:{' '}
            <span className='font-normal'>
              {row.getValue('start_date')} - {row.getValue('end_date')}
            </span>
          </p>
          {row.getValue('finish_date') ? (
            <p className='font-semibold'>
              Date Finished:{' '}
              <span className='font-normal'>{row.getValue('finish_date')}</span>
            </p>
          ) : null}
        </div>
      </div>

      <div className='h-[1%] w-full rounded-b-xl'>
        <div
          className={cx('w-full h-full rounded-b-md', {
            'bg-green-500': row.getValue('status') === 'finished',
            'bg-yellow-500': row.getValue('status') === 'ongoing',
            'bg-darkgray-500': row.getValue('status') === 'on-hold',
            'bg-red-500': row.getValue('status') === 'cancelled',
            'bg-red-300': row.getValue('status') === 'archived',
          })}
        ></div>
      </div>
    </div>
  );
}
