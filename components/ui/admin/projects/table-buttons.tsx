'use client';

import TooltipBtnIcon from '@/components/ui/general/tooltip-custom';
import { Button, ButtonLink } from '@/components/ui/button';
import { MouseEventHandler } from 'react';
import { IoAddOutline } from 'react-icons/io5';
import { IoArchiveOutline } from 'react-icons/io5';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { MdOutlineEdit, MdOutlineRemoveRedEye } from 'react-icons/md';
import { SlDrawer } from 'react-icons/sl';
import { FcCancel } from 'react-icons/fc';

export function BtnAdd({
  label,
  href,
  onClick,
  classname,
  textColor,
  variant,
}: {
  label?: string;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
  classname?: string;
  textColor?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
    | undefined;
}) {
  return (
    <ButtonLink
      className={`bg-maroon-600 hover:bg-maroon-700 space-x-1 h-8 sm:h-11 sm:p-2 ${classname}`}
      size={'sm'}
      href={href || ''}
      onClick={onClick}
      variant={variant}
    >
      <IoAddOutline className='text-xs md:text-lg' />
      <p className={'hidden md:flex text-xs md:text-sm font-semibold'}>
        {label}
      </p>
      <p className={'flex md:hidden text-xs md:text-sm font-semibold '}>
        {label}
      </p>
    </ButtonLink>
  );
}

export function BtnArchivedItems({ label }: { label: string }) {
  return (
    <TooltipBtnIcon
      tooltipContent={label}
      variant='outline'
      className='h-9 rounded-md px-2 sm:h-11 sm:rounded-md sm:px-4 flex-1 md:flex-none'
      icon={<SlDrawer className='text-base md:text-xl text-gray-500' />}
    />
  );
}

export function BtnGenerateReport({ label }: { label: string }) {
  return (
    <TooltipBtnIcon
      tooltipContent={label}
      variant='outline'
      className='h-9 rounded-md px-2 lg:h-11 sm:h-11 sm:rounded-md sm:px-4 flex-1 md:flex-none'
      icon={
        <IoDocumentTextOutline className='text-base md:text-xl text-gray-500' />
      }
    />
  );
}

export function BtnArchive({
  label,
  onClick,
}: {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement> | undefined;
}) {
  return (
    <TooltipBtnIcon
      tooltipContent={label}
      variant='outline'
      onClick={onClick}
      className='bg-red-100 hover:bg-red-700 h-9 rounded-md px-2 sm:h-11 sm:rounded-md sm:px-4 '
      icon={<IoArchiveOutline className='text-base md:text-xl text-white' />}
      textColor='text-white'
    />
  );
}

export function BtnWithinArchive({ label }: { label: string }) {
  return (
    <TooltipBtnIcon
      tooltipContent={label}
      variant='outline'
      className='bg-red-100 hover:bg-red-700 p-2 flex-1 md:flex-none'
      textColor='text-white'
      icon={<IoArchiveOutline className='text-base text-white-100 ' />}
    />
  );
}
export function BtnWithinEdit({
  label,
  href,
  onClick,
  className,
}: {
  label: string;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;
}) {
  return (
    <TooltipBtnIcon
      tooltipContent={label}
      variant='outline'
      className={` p-2 ${className}`}
      icon={<MdOutlineEdit className='text-base ' />}
      href={href}
      onClick={onClick}
    />
  );
}

export function BtnWithinView({
  label,
  onClick,
  className,
  href,
}: {
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;
  href?: string;
}) {
  return (
    <TooltipBtnIcon
      onClick={onClick}
      tooltipContent={label}
      variant='outline'
      className={` p-2 ${className}`}
      icon={<MdOutlineRemoveRedEye className='text-base ' />}
      href={href}
    />
  );
}

export function BtnWithinCancel({
  label,
  onClick,
  className,
  href,
}: {
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;
  href?: string;
}) {
  return (
    <TooltipBtnIcon
      onClick={onClick}
      tooltipContent={label}
      variant='outline'
      className={` p-2 ${className}`}
      icon={<FcCancel className='text-base text-red-500' />}
      href={href}
    />
  );
}
