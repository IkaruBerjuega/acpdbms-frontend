import { Label } from '@/components/ui/label';

export default function FormLabel({
  label,
  value,
  indent,
}: {
  label: string;
  value?: string | number | Date | File;
  indent?: boolean;
}) {
  return (
    <div className={`flex flex-col mt-1 ${indent && 'ml-2'}`}>
      <Label
        htmlFor='firstName'
        className={'font-semibold text-xs text-darkgray-500 '}
      >
        {label}
      </Label>
      <p className='text-xs md:text-base text-darkgray-800 font-semibold'>
        {value as string}
      </p>
    </div>
  );
}
