import React from 'react';
import { Input } from '@/components/ui/input';

interface TelephoneNumbersProps {
  telephoneNumbers: string[];
  onAddTelephoneNumber: () => void;
  onInputChange: (index: number, value: string) => void;
  onRemoveTelephoneNumber: (index: number) => void;
}

export function TelephoneNumbers({
  telephoneNumbers,
  onAddTelephoneNumber,
  onInputChange,
  onRemoveTelephoneNumber,
}: TelephoneNumbersProps) {
  return (
    <div className='space-y-4'>
      <h2 className={' text-maroon-700 text-base'}>Telephone Numbers</h2>
      {telephoneNumbers.map((number, index) => (
        <div key={index} className='flex items-center '>
          <Input
            type='text'
            value={number}
            onChange={(e) => onInputChange(index, e.target.value)}
            placeholder='XXXXXXX'
            className='h-8'
          />
          <button
            onClick={() => onRemoveTelephoneNumber(index)}
            className='p-2 rounded-full'
          >
            −
          </button>
        </div>
      ))}
      <div className='flex'>
        <Input className='h-8' disabled placeholder='XXXXXXX' />
        <button onClick={onAddTelephoneNumber} className='p-2 rounded-full'>
          +
        </button>
      </div>
    </div>
  );
}
