import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  User,
  MoreVertical,
  ExternalLink,
  Edit,
  Archive,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getStatusColor } from './general/data-table-components/create-table-columns';
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
      className='group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200'
      onClick={() =>
        fn(
          row.getValue('id') as string,
          row.getValue('project_title') as string
        )
      }
    >
      {/* Image Section */}
      <div className='relative w-full aspect-video overflow-hidden'>
        {/* {row.getValue('image_url') ? ( */}
        <Image
          loader={customLoader}
          src={
            // row.getValue('image_url') ||
            'https://media.istockphoto.com/id/1217618992/photo/3d-house.jpg?s=612x612&w=0&k=20&c=brVxRkoQX9q-2TwiyjgjYyNJrBCs-j41J34fLVp3pdA='
          }
          alt={`${row.getValue('project_title')} Project`}
          className='object-cover transition-transform duration-300 group-hover:scale-105'
          layout='fill'
          priority
        />
        {/* ) : (
          <Image
            loader={customLoader}
            src='https://media.istockphoto.com/id/1217618992/photo/3d-house.jpg?s=612x612&w=0&k=20&c=brVxRkoQX9q-2TwiyjgjYyNJrBCs-j41J34fLVp3pdA='
            alt='Default Project Image'
            className='object-cover transition-transform duration-300 group-hover:scale-105'
            layout='fill'
            priority
          />
        )} */}

        {/* Status Badge */}
        <div className='absolute top-3 left-3'>
          <Badge
            className={`${getStatusColor(
              row.getValue('status')
            )} px-2 py-1 text-xs font-medium`}
          >
            {row.getValue('status')}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className='flex flex-col flex-grow p-4'>
        <div className='flex justify-between items-start mb-3'>
          <div>
            <h3 className='text-lg font-semibold text-maroon-700 group-hover:text-maroon-800'>
              {row.getValue('project_title')}
            </h3>
            <div className='flex items-center text-slate-500 mt-1'>
              <MapPin className='h-3.5 w-3.5 mr-1' />
              <p className='text-sm line-clamp-1'>{row.getValue('location')}</p>
            </div>
          </div>

          <div onClick={(e) => e.stopPropagation()} className='ml-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-8 w-8 p-0 rounded-full hover:bg-slate-100'
                >
                  <MoreVertical className='h-4 w-4' />
                  <span className='sr-only'>Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side='bottom' align='end' className='w-48'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer'>
                  <Link
                    href={`/admin/projects/${row.getValue('id')}/view`}
                    className='flex items-center w-full'
                  >
                    <ExternalLink className='h-4 w-4 mr-2' />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer'>
                  <div className='flex items-center w-full'>
                    <Edit className='h-4 w-4 mr-2' />
                    Edit Project
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer'>
                  <div className='flex items-center w-full'>
                    <Archive className='h-4 w-4 mr-2' />
                    Archive
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className='mt-1 space-y-2 flex-grow'>
          <div className='flex items-start'>
            <User className='h-4 w-4 text-slate-400 mt-0.5 mr-2' />
            <div>
              <p className='text-xs text-slate-500'>Client</p>
              <p className='text-sm font-medium'>
                {row.getValue('client_name')}
              </p>
            </div>
          </div>

          <div className='flex items-start'>
            <Calendar className='h-4 w-4 text-slate-400 mt-0.5 mr-2' />
            <div>
              <p className='text-xs text-slate-500'>Timeline</p>
              <p className='text-sm'>
                {row.getValue('start_date')} - {row.getValue('end_date')}
              </p>
            </div>
          </div>

          {row.getValue('finish_date') && (
            <div className='flex items-start'>
              <Calendar className='h-4 w-4 text-emerald-500 mt-0.5 mr-2' />
              <div>
                <p className='text-xs text-slate-500'>Completed</p>
                <p className='text-sm'>{row.getValue('finish_date')}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Indicator */}
      <div
        className={`h-1 w-full ${getStatusColor(row.getValue('status'))}`}
      ></div>
    </div>
  );
}
