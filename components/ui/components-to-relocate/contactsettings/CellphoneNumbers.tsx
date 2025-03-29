import React from 'react';
import { Input } from '@/components/ui/input';

interface CellphoneNumbersProps {
  phoneNumbers: string[];
  onAddPhoneNumber: () => void;
  onInputChange: (index: number, value: string) => void;
  onRemovePhoneNumber: (index: number) => void;
}

export function CellphoneNumbers({
  phoneNumbers,
  onAddPhoneNumber,
  onInputChange,
  onRemovePhoneNumber,
}: CellphoneNumbersProps) {
  return (
    <div className='space-y-4'>
      <h2 className={' text-maroon-700 text-base'}>Cellphone Numbers</h2>
      {phoneNumbers.map((number, index) => (
        <div key={index} className='flex items-center '>
          <Input
            type='text'
            value={number}
            onChange={(e) => onInputChange(index, e.target.value)}
            placeholder='XXX-XXXX'
            className='h-8'
          />
          <button
            onClick={() => onRemovePhoneNumber(index)}
            className='p-2 rounded-full'
          >
            −
          </button>
        </div>
      ))}
      <div className='flex'>
        <Input className='h-8' disabled placeholder='XXX-XXXX' />
        <button onClick={onAddPhoneNumber} className='p-2 rounded-full'>
          +
        </button>
      </div>
    </div>
  );
}
