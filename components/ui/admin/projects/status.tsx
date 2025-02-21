import { cx } from 'class-variance-authority';

interface StatusProps {
  statuses: [string, string][]; // array of status and corresponding color class
  value?: string; // current status value
}

export default function Status({ statuses, value }: StatusProps) {
  // Find the matching status color from the statuses array
  const matchingStatus = statuses.find(([status]) => status === value);
  const statusColorClass = matchingStatus ? matchingStatus[1] : 'bg-gray-500'; // default to gray if not found

  return (
    <div
      className={cx(
        'text-xs px-2 py-1 w-auto rounded-lg drop-shadow-sm tracking-wider flex justify-center items-center text-white font-semibold',
        statusColorClass // dynamically apply the color class
      )}
    >
      {value}
    </div>
  );
}
