"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { RiArrowDropDownLine, RiCloseLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ItemInterface } from "@/lib/filter-types";

interface ComboboxInterface {
  items?: ItemInterface[];
  onSelect?: (item: ItemInterface) => void | string;
  placeholder: string;
  emptyMessage: string;
  onBlur?: () => void;
  value?: string | number | undefined;
  className?: string;
  initialPopoverState?: boolean;
  align?: "center" | "end" | "start" | undefined;
  clearFn?: () => void;
  allowNewValue?: boolean;
  disabled?: boolean; // New disabled prop
}

export function Combobox({
  items = [],
  onSelect,
  placeholder,
  emptyMessage,
  value,
  onBlur,
  className,
  initialPopoverState,
  align,
  clearFn,
  allowNewValue = false,
  disabled = false, // Default disabled state to false
}: ComboboxInterface) {
  const [open, setOpen] = React.useState(initialPopoverState || false);
  const [selectedValue, setSelectedValue] = React.useState<
    string | number | undefined
  >(value);

  const [inputValue, setInputValue] = React.useState<string>("");

  React.useEffect(() => {
    setSelectedValue(value); // Update local state when value prop changes
  }, [value]);

  /**
   * Clears the selected value and resets related states.
   */
  const handleClear = () => {
    if (disabled) return; // Prevent clear action if disabled
    setSelectedValue(undefined);
    if (onSelect) onSelect({ label: "", value: "" });
    if (onBlur) onBlur();
    if (clearFn) clearFn();
  };

  /**
   * Handles selecting a custom input value when "Enter" is pressed.
   */
  const handleInputSelect = () => {
    if (disabled) return; // Prevent select action if disabled
    const newValue = inputValue.trim(); // Ensure no leading/trailing spaces

    if (newValue) {
      setSelectedValue(newValue); // Set the entered input as the selected value
      if (onSelect) onSelect({ label: newValue, value: newValue }); // Trigger onSelect with custom input
      setInputValue(""); // Clear the input after selection
      setOpen(false); // Close the popover
    }
  };

  return (
    <Popover
      open={open && !disabled} // Prevent opening if disabled
      onOpenChange={(isOpen) => {
        if (disabled) return; // Prevent opening if disabled
        setOpen(isOpen);
        if (!isOpen && onBlur) {
          onBlur();
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            `w-full flex justify-between items-center text-xs sm:text-sm ${className} overflow-hidden`,
            selectedValue ? "text-darkgray-800" : "text-darkgray-400",
            disabled ? "cursor-not-allowed opacity-50" : "" // Add disabled styles
          )}
          disabled={disabled} // Disable the button if disabled prop is true
        >
          <div
            className={`flex-1 truncate flex justify-start ${
              !selectedValue && "text-gray-400"
            }`}
          >
            {selectedValue || placeholder}
          </div>
          {selectedValue && value !== "All Projects" && !disabled ? (
            <span
              className="text-sm px-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Prevent popover from opening
                handleClear();
              }}
            >
              <RiCloseLine className="h-5 w-5 shrink-0" />
            </span>
          ) : (
            <RiArrowDropDownLine
              className={`ml-2 h-5 w-5 shrink-0 ${
                disabled ? "text-gray-400" : "text-maroon-700"
              }`}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`w-full p-0 h-52 ${disabled ? "pointer-events-none" : ""}`} // Prevent interaction when disabled
        side="bottom"
        align={align || undefined}
      >
        <Command className="w-full relative">
          <CommandInput
            className="w-full pr-10" // Add padding to the right for the button
            placeholder="Search or add new..."
            value={inputValue} // Bind the state to the input
            onValueChange={setInputValue} // Update input value
            disabled={disabled} // Disable input when disabled
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleInputSelect(); // Trigger the select action on Enter
              }
            }}
          />
          {allowNewValue && inputValue && !disabled && (
            <button
              tabIndex={0}
              onClick={handleInputSelect}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleInputSelect();
                }
              }}
              className="absolute right-2 top-3 px-2 py-1 bg-black-primary hover:bg-black-secondary text-white-secondary text-xs rounded"
            >
              Add
            </button>
          )}
          <CommandList className="w-full" autoFocus={false}>
            <CommandEmpty className="w-full flex justify-start px-4 py-2 text-sm text-darkgray-600 mt-1">
              {emptyMessage}...
            </CommandEmpty>
            <CommandGroup className="w-full" autoFocus={false}>
              {items?.map((item, index) => {
                const highlightColor = item.highlight?.initialColor;

                return (
                  <CommandItem
                    key={index} // Use value as the unique key
                    value={String(item.value)} // Ensure that the value is used here
                    autoFocus={false}
                    keywords={[item.label]}
                    color=""
                    onSelect={() => {
                      if (disabled) return; // Prevent selection if disabled
                      setSelectedValue(item.label); // Select by value
                      if (onSelect) onSelect(item); // Call onSelect with item
                      setOpen(false);
                    }}
                    className={`
                  ${
                    highlightColor &&
                    `text-${highlightColor}-600 hover:!text-${highlightColor}-600 !bg-${highlightColor}-200 hover:!bg-${highlightColor}-300`
                  }
                  `}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedValue === item.value
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    <div className="flex flex-col">
                      <div>
                        {item.label} {item.element && "-"}
                      </div>
                      <div className="font-semibold">{item.element}</div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
