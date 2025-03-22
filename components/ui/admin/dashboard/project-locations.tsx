'use client';
import BarGraph from './bar-graph';

export default function ProjectLocations() {
  return (
    <div className='flex justify-center items-center flex-col bg-white-primary rounded-lg border border-gray-300 h-[300px] shadow-sm hover:shadow-md transition-shadow p-6'>
      <div className='flex flex-row py-1 justify-start w-full text-maroon-700'>
        <p className='text-xl font-bold'>Project Locations</p>
      </div>
      <div className='flex justify-center items-center my-1 w-full flex-grow h-1'>
        <BarGraph />
      </div>
    </div>
  );
}
