import * as React from "react";

import { cn } from "../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode; // Add an optional icon prop
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center border border-input rounded-md bg-background h-[40px] px-3 py-2",
          className
        )}
      >
        {icon && <span className="mr-2 text-muted-foreground">{icon}</span>}
        <input
          type={type}
          className={cn(
            "flex-1 h-[40px] rounded-md px-3 bg-transparent py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput, Input };
