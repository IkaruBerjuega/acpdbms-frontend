"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "./calendar";
import { SelectSingleEventHandler } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  onSelect: (date: Date) => void;
  selectedDate?: Date;
  placeholder?: string;
  onBlur?: () => void;
  value?: Date;
  side?: "top" | "right" | "bottom" | "left" | undefined;
}

export function DatePicker({
  side,
  onSelect,
  selectedDate,
  placeholder,
  onBlur,
  value,
}: DatePickerProps) {
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const onDateSelect: SelectSingleEventHandler = (date) => {
    if (date) {
      onSelect(date);
      triggerRef.current?.click();
    }
  };

  return (
    <Popover onOpenChange={(value) => !value && onBlur && onBlur()}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal text-xs sm:text-sm relative hover:bg-transparent hover:border-primary",
            !selectedDate && "text-muted-foreground text-darkgray-400"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, "PPP")
          ) : (
            <span>{placeholder ?? "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto p-0"
        side={side}
        sideOffset={20}
      >
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          selected={selectedDate}
          onSelect={onDateSelect}
          fromYear={1960}
          toYear={2030}
        />
      </PopoverContent>
    </Popover>
  );
}
