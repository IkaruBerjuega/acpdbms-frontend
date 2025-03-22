'use client';
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from 'react-icons/io';

interface NavigationButtonsProps {
  step: number;
  handleNextStep: () => void;
  prevStep: () => void;
  isDisabled?: boolean;
}

export function NavigationButtons({
  step,
  handleNextStep,
  prevStep,
  isDisabled = false,
}: NavigationButtonsProps) {
  const nextLabel = step === 0 ? 'PROCEED' : step === 4 ? 'SAVE' : 'CONTINUE';

  const nextButtonClasses = `text-gray-500 flex items-center text-xl gap-2 transition duration-200 transform ${
    !isDisabled ? 'hover:scale-110 text-primary' : ''
  }`;

  return (
    <div className='flex flex-nowrap items-center justify-between w-full max-w-sm mx-auto mt-4 gap-12 lg:max-w-lg'>
      <div
        className={`flex-1 ${
          step === 0 ? 'flex justify-end mt-[168px]' : 'flex justify-between'
        }`}
      >
        {step > 0 && (
          <button
            onClick={prevStep}
            className='text-primary flex items-center text-xl gap-2 transition duration-200 transform hover:scale-110'
          >
            <IoIosArrowDropleftCircle className='text-3xl' />
            <span className='font-semibold'>BACK</span>
          </button>
        )}

        <button
          onClick={handleNextStep}
          className={nextButtonClasses}
          disabled={isDisabled}
        >
          <span className='font-semibold'>{nextLabel}</span>
          <IoIosArrowDroprightCircle className='text-3xl' />
        </button>
      </div>
    </div>
  );
}
