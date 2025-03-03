'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MouseEventHandler, useState } from 'react';
import TooltipBtnIcon from './use-tooltip';

export function GeneralDialog({
  title,
  message,
  onClick,
  type,
  btnText,
  className,
  disabled,
  variant,
  icon,
}: {
  message: string | JSX.Element;
  title: string;
  variant: 'icon' | 'text' | 'iconText';
  type: 'button' | 'submit' | 'reset' | undefined;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  btnText: string;
  className: string;
  disabled?: boolean;
  icon?: React.ReactNode | string;
}) {
  const [isOpen, setOpen] = useState<boolean>();
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === 'text' ? (
          <Button variant='outline' className={className} disabled={disabled}>
            {btnText}
          </Button>
        ) : variant === 'iconText' ? (
          <Button
            variant='outline'
            className={`px-2 ${className}`}
            disabled={disabled}
          >
            {icon} {btnText}
          </Button>
        ) : (
          <TooltipBtnIcon
            icon={icon}
            tooltipContent={title}
            className={className}
            variant={'outline'}
          />
        )}
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-maroon-700'>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>

        <DialogFooter className='mt-5'>
          <Button
            onClick={(event) => {
              if (onClick) onClick(event); // Pass the event correctly
              setOpen(false); // Close the dialog
            }}
            className={
              'p-2 bg-maroon-600 hover:bg-maroon-700 text-white hover:text-whtie'
            }
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
