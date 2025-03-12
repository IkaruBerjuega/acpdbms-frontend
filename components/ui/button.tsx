'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none  focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2 rounded-md',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href: string;
  disabled?: boolean;
  id?: string;
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    { className, variant, size, asChild = false, href, disabled, id, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : Link;

    // const handleClick = (
    //   event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    // ) => {
    //   if (disabled) {
    //     event.preventDefault();
    //     event.stopPropagation();
    //   }
    // };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), {
          'pointer-events-none opacity-50': disabled,
        })}
        ref={ref}
        href={href}
        // onClick={handleClick}
        aria-disabled={disabled}
        id={id}
        {...props}
      />
    );
  }
);
ButtonLink.displayName = 'ButtonLink';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ButtonTooltipInterface {
  tooltip: string;
  iconSrc?: string;
  className?: string;
  href?: string;
  onClick?: () => void;
}

const ButtonTooltip = ({
  tooltip,
  iconSrc,
  className = '',
  href,
  onClick,
}: ButtonTooltipInterface) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Execute any additional onClick logic if provided
    onClick?.();
    // If an href is provided, navigate to it
    if (href) {
      e.preventDefault();
      router.push(href);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={1}>
        <TooltipTrigger
          onClick={handleClick}
          className={`px-2 py-1 border-[1px] rounded-md hover:bg-white-secondary ${className}`}
        >
          {iconSrc ? (
            <Image
              src={iconSrc}
              alt={`${tooltip} button`}
              width={18}
              height={18}
            />
          ) : (
            <>{tooltip}</>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

import { useState } from 'react';
import { LoadingCircle } from './general/loading-circle';

interface ButtonIconTooltipDialog {
  iconSrc: string;
  alt: string;
  tooltipContent: string;
  dialogTitle: string;
  dialogDescription: string;
  dialogContent?: React.JSX.Element;
  submitType: 'button' | 'submit' | 'reset' | undefined;
  submitTitle?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const ButtonIconTooltipDialog = ({
  iconSrc,
  alt,
  tooltipContent,
  dialogTitle,
  dialogDescription,
  dialogContent,
  submitType = 'button',
  submitTitle = 'Submit',
  className,
  onClick,
  disabled,
}: ButtonIconTooltipDialog) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e); // Calls onClick if it exists
    setOpen(false); // Close the dialog
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        asChild
        className={`${disabled ? 'pointer-events-none opacity-50' : ''}`}
      >
        <button
          className={`border-[1px] px-2 py-1 ${className} rounded-md hover:bg-white-secondary cursor-pointer flex-col-center ${
            disabled ? 'cursor-not-allowed' : ''
          }`}
          onClick={() => setOpen(true)}
          disabled={disabled}
        >
          <TooltipProvider>
            <Tooltip delayDuration={1}>
              <TooltipTrigger asChild>
                <Image
                  src={iconSrc}
                  alt={alt}
                  width={18}
                  height={18}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipContent}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {dialogContent}
        <DialogFooter>
          <Button
            type={submitType}
            onClick={handleSubmit}
          >
            {submitTitle}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface BtnDialogProps {
  btnTitle: string;
  alt: string;
  dialogTitle: string;
  dialogDescription: string;
  dialogContent?: React.JSX.Element;
  submitType: 'button' | 'submit' | 'reset' | undefined;
  submitTitle?: string;
  className?: string;
  isLoading?: boolean;
  onClick?: (e?: React.BaseSyntheticEvent) => Promise<void>;
  disabled?: boolean;
  variant?: 'ghost' | 'outline' | 'default';
}

const BtnDialog = (props: BtnDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default form submission
    if (props.onClick) {
      await props.onClick(); // ✅ Call the submit function passed via props
    }
    setOpen(false); // Close the dialog
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant={props.variant}
          disabled={props.disabled || props.isLoading}
        >
          {props.isLoading ? (
            <>
              Submitting
              <LoadingCircle
                color='border-white-secondary'
                size={15}
              />
            </>
          ) : (
            props.btnTitle
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] text-sm'>
        <DialogHeader>
          <DialogTitle>{props.dialogTitle}</DialogTitle>
          <DialogDescription>{props.dialogDescription}</DialogDescription>
        </DialogHeader>
        {props.dialogContent}
        <DialogFooter>
          <Button
            type={props.submitType}
            onClick={handleSubmit}
          >
            {props.submitTitle}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface AddBtn {
  onClick?: () => void;
  href?: string;
  label: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  dark: boolean;
}

const AddBtn = ({ variant, onClick, label, href, className, dark }: AddBtn) => {
  const router = useRouter();

  const imgAddSrc = dark
    ? '/button-svgs/table-header-add.svg'
    : '/button-svgs/table-header-add-dark.svg';

  return (
    <Button
      onClick={
        onClick ??
        (() => {
          if (href) router.push(href);
        })
      }
      className={`flex-row-center ${className} ${
        !dark &&
        'bg-white-primary hover:!bg-white-secondary text-black-secondary hover:!text-black-primary'
      }`}
      variant={variant}
    >
      <Image
        src={imgAddSrc}
        alt={label}
        width={10}
        height={10}
      />
      {label}
    </Button>
  );
};

export {
  Button,
  ButtonLink,
  AddBtn,
  ButtonTooltip,
  ButtonIconTooltipDialog,
  buttonVariants,
  BtnDialog,
};
