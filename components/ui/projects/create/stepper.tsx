import clsx from 'clsx';
import { Check } from 'lucide-react';
import React, { Fragment } from 'react';
import { Separator } from '@/components/ui/separator';

interface StepperIndicatorProps {
  activeStep: number;
  stepLabels: string[];
  className?: string;
  separatorWidth?: string;
  textSize?: string;
  lineStyle?: boolean;
}

const StepperIndicator = ({
  activeStep,
  stepLabels,
  className,
  separatorWidth,
  textSize,
  lineStyle,
}: StepperIndicatorProps) => {
  return (
    <div className='mb-10'>
      <div className='flex justify-start items-center gap-2 mb-5'>
        {stepLabels.map((step, index) => (
          <Fragment key={step}>
            {!lineStyle ? (
              <>
                <div className='flex flex-row items-center gap-1'>
                  <div
                    className={clsx(
                      'w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] flex justify-center items-center  border-[2px] rounded-full transition-all duration-200',
                      index + 1 < activeStep && 'bg-maroon-700 text-white-100',
                      index + 1 === activeStep &&
                        'border-maroon-700 text-maroon-700',
                      className
                    )}
                  >
                    {index + 1 >= activeStep ? (
                      <p>{index + 1}</p>
                    ) : (
                      <Check className='h-5 w-5' />
                    )}
                  </div>
                  <p
                    className={clsx(
                      'text-xs md:text-sm ',
                      index + 1 === activeStep
                        ? 'text-maroon-700 font-semibold'
                        : 'text-maroon-700 font-normal',
                      textSize
                    )}
                  >
                    {stepLabels[index + 1 - 1]}
                  </p>
                </div>
                {index + 1 !== stepLabels.length && (
                  <Separator
                    orientation='horizontal'
                    className={clsx(
                      'w-[20px] md:w-[75px] h-[2px] transition-all duration-200',
                      index + 1 <= activeStep - 1 && 'bg-maroon-600',
                      separatorWidth
                    )}
                  />
                )}
              </>
            ) : (
              <div className='flex-1 flex flex-col items-center justify-center'>
                <Separator
                  orientation='horizontal'
                  className={clsx(
                    'w-full transition-all duration-200 h-1 rounded-md',
                    index + 1 <= activeStep - 1 && 'bg-maroon-600'
                  )}
                />
                <p
                  className={clsx(
                    'text-xs md:text-sm ',
                    index + 1 === activeStep
                      ? 'text-maroon-700 font-semibold'
                      : 'text-maroon-700 font-normal',
                    textSize
                  )}
                >
                  {stepLabels[index + 1 - 1]}
                </p>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepperIndicator;
