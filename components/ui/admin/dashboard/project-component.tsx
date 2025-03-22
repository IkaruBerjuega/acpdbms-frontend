'use client';

import ProjectUpdate from './project-updates-user';

export default function ProjectUpdates() {
  return (
    <div className='flex flex-col w-full bg-white-primary rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-shadow p-6 h-1/2'>
      <div className='text-primary mb-4'>
        <p className='text-xl font-bold'>Project Updates</p>
      </div>
      <div className='overflow-y-auto rounded-xl h-1 flex-grow border-[1px] max-w-full p-4'>
        <ProjectUpdate />
      </div>
    </div>
  );
}
