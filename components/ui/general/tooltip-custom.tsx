import { Button, ButtonLink } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';

type ButtonVariant =
  | 'link'
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | null;

interface TooltipBtnIconProps {
  icon: React.ReactNode | string;
  tooltipContent: string;
  className?: string;
  variant?: ButtonVariant;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  disabled?: boolean;
  href?: string;
  responsive?: boolean;
  textColor?: string;
}

export default function TooltipBtnIcon({
  icon,
  tooltipContent,
  className,
  variant,
  onClick,
  disabled,
  href,
  textColor,
}: TooltipBtnIconProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          {!href ? (
            <Button
              variant={variant}
              onClick={onClick}
              className={`${className} relative`}
              disabled={disabled}
            >
              {typeof icon === 'string' ? (
                <Image
                  src={icon}
                  alt={tooltipContent}
                  layout='fill' // Makes the image take up all the available space
                  objectFit='cover'
                />
              ) : (
                icon
              )}
              <p className={`ml-2 md:hidden  text-xs md:text-sm ${textColor}`}>
                {tooltipContent}
              </p>
            </Button>
          ) : (
            <ButtonLink
              variant={variant}
              href={href}
              className={`${className} relative`}
              disabled={disabled}
            >
              {typeof icon === 'string' ? (
                <Image
                  src={icon}
                  alt={tooltipContent}
                  layout='fill' // Makes the image take up all the available space
                  objectFit='cover'
                />
              ) : (
                icon
              )}
              <p className={`ml-2 md:hidden  text-xs md:text-sm ${textColor}`}>
                {tooltipContent}
              </p>
            </ButtonLink>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
