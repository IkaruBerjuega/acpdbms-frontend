import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

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
          "pointer-events-none opacity-50": disabled,
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
ButtonLink.displayName = "ButtonLink";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ButtonTooltipInterface {
  tooltip: string;
  iconSrc?: string;
  className?: string;
}

const ButtonTooltip = ({
  tooltip,
  iconSrc,
  className,
}: ButtonTooltipInterface) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={1}>
        <TooltipTrigger className={`p-2 border-[1px] rounded-md ${className}`}>
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

export { Button, ButtonLink, ButtonTooltip, buttonVariants };
