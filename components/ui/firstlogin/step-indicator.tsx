interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [0, 1, 2, 3, 4];

  return (
    <div className='flex space-x-12 mb-8 items-center'>
      {steps.map((step) => (
        <div
          key={step}
          className={`w-4 h-4 rounded-full ${
            step === currentStep ? 'bg-primary  w-9 h-9' : 'bg-primary w-6 h-6'
          }`}
        ></div>
      ))}
    </div>
  );
}
