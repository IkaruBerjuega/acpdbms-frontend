'use client';

import { SearchInput } from '@/components/ui/input';
import { AiOutlineSearch } from 'react-icons/ai'; // Import the search icon from react-icons
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export function Search({
  className,
  placeholder,
}: {
  className: string;
  placeholder: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // State to hold the current search query
  const [query, setQuery] = useState<string>(searchParams.get('query') ?? '');

  // Debounced callback to handle search input changes
  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching...${term}`);
    const params = new URLSearchParams(searchParams);
    term ? params.set('query', term) : params.delete('query');
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  // Update local state when searchParams change
  useEffect(() => {
    setQuery(searchParams.get('query') ?? '');
  }, [searchParams]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    handleSearch(e.target.value);
  };

  return (
    <SearchInput
      type='text'
      placeholder={placeholder}
      className={`text-xs md:text-sm ${className}`}
      icon={<AiOutlineSearch className='h-5 w-5 text-gray-500' />}
      value={query} // Controlled input value
      onChange={handleChange}
    />
  );
}
import * as React from 'react';
import { Check } from 'lucide-react';
import { RiArrowDropDownLine, RiCloseLine } from 'react-icons/ri';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Item {
  value: string | number;
  label: string;
  element?: JSX.Element | string;
}

interface FormInputSearchProps {
  items?: Item[];
  onSelect?: (item: Item) => void | string;
  placeholder: string;
  emptyMessage: string;
  onBlur?: () => void;
  value?: string | number | undefined;
  className?: string;
  initialPopoverState?: boolean;
  align?: 'center' | 'end' | 'start' | undefined;
  clearFn?: () => void;
  allowNewValue?: boolean;
  disabled?: boolean; // New disabled prop
}
export function FormInputSearch({
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
}: FormInputSearchProps) {
  const [open, setOpen] = React.useState(initialPopoverState || false);
  const [selectedValue, setSelectedValue] = React.useState<
    string | number | undefined
  >(value);
  const [inputValue, setInputValue] = React.useState<string>('');

  React.useEffect(() => {
    setSelectedValue(value); // Update local state when value prop changes
  }, [value]);

  const handleClear = () => {
    if (disabled) return; // Prevent clear action if disabled
    setSelectedValue(undefined);
    if (onSelect) onSelect({ label: '', value: '' });
    if (onBlur) onBlur();
    if (clearFn) clearFn();
  };

  const handleInputSelect = () => {
    if (disabled) return; // Prevent select action if disabled
    setSelectedValue(inputValue); // Set the entered input as the selected value
    if (onSelect) onSelect({ label: inputValue, value: '' }); // Trigger onSelect with custom input
    setInputValue(''); // Clear the input after selection
    setOpen(false); // Close the popover
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
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            `w-full flex justify-between items-center text-xs sm:text-sm ${className} overflow-hidden`,
            selectedValue ? 'text-darkgray-800' : 'text-darkgray-400',
            disabled ? 'cursor-not-allowed opacity-50' : '' // Add disabled styles
          )}
          disabled={disabled} // Disable the button if disabled prop is true
        >
          <div className='flex-1 truncate flex justify-start'>
            {selectedValue || placeholder}
          </div>
          {selectedValue && value !== 'All Projects' && !disabled ? (
            <Button
              variant='ghost'
              className='text-sm px-2'
              onClick={(e) => {
                e.stopPropagation(); // Prevent popover from opening
                handleClear();
              }}
              disabled={disabled} // Disable the clear button if disabled
            >
              <RiCloseLine className='h-5 w-5 shrink-0' />
            </Button>
          ) : (
            <RiArrowDropDownLine
              className={`ml-2 h-5 w-5 shrink-0 ${
                disabled ? 'text-gray-400' : 'text-maroon-700'
              }`} // Adjust icon color when disabled
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`w-full p-0 h-52 ${disabled ? 'pointer-events-none' : ''}`} // Prevent interaction when disabled
        side='bottom'
        align={align || undefined}
      >
        <Command className='w-full relative'>
          <CommandInput
            className='w-full pr-10' // Add padding to the right for the button
            placeholder='Search or add new...'
            value={inputValue} // Bind the state to the input
            onValueChange={setInputValue} // Update input value
            disabled={disabled} // Disable input when disabled
          />
          {allowNewValue && inputValue && !disabled && (
            <button
              onClick={handleInputSelect}
              className='absolute right-2 top-2 px-2 py-1 bg-blue-500 text-white rounded'
            >
              Add
            </button>
          )}
          <CommandList className='w-full'>
            <CommandEmpty className='w-full flex justify-start px-4 py-2 text-sm text-darkgray-600 mt-1'>
              {emptyMessage}...
            </CommandEmpty>
            <CommandGroup className='w-full'>
              {items?.map((item) => (
                <CommandItem
                  key={item.value} // Use value as the unique key
                  value={String(item.value)} // Ensure that the value is used here
                  keywords={[item.label]}
                  onSelect={() => {
                    if (disabled) return; // Prevent selection if disabled
                    setSelectedValue(item.label); // Select by value
                    if (onSelect) onSelect(item); // Call onSelect with item
                    setOpen(false);
                  }}
                  className={`w-full ${disabled ? 'cursor-not-allowed' : ''}`} // Add disabled styles
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedValue === item.value ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <div className='flex flex-col'>
                    <div>
                      {item.label} {item.element && '-'}
                    </div>
                    <div className='font-semibold'>{item.element}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
