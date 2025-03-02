'use client';

import { useRouter } from 'next/navigation';
import DataTableHeader from '../general/data-table-components/table-header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VscListSelection } from 'react-icons/vsc';
import { PiCardsThreeLight } from 'react-icons/pi';
import { Button } from '../button';

interface ProjectsTableHeaderActionsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export default function ProjectsTableHeaderActions({
  activeTab,
  setActiveTab,
}: ProjectsTableHeaderActionsProps) {
  const router = useRouter();

  const handleAddProject = () => {
    router.push('/admin/projects/create');
  };

  // tabslist for project view
  const tabsElement = (
    <div className='w-full flex items-center '>
      {/* add project button */}
      <Button
        className='ml-4 mr-6'
        onClick={handleAddProject}
      >
        + Add Project
      </Button>
      <TabsList className='flex h-9 sm:h-11 '>
        <TabsTrigger
          value='list'
          className='h-8 rounded-md px-2 sm:px-4 w-1/2'
          onClick={() => setActiveTab('list')}
        >
          <VscListSelection className='h-5 w-5 text-gray-500 ' />
        </TabsTrigger>
        <TabsTrigger
          value='card'
          className='h-8 rounded-md px-2 sm:px-4 w-1/2'
          onClick={() => setActiveTab('card')}
        >
          <PiCardsThreeLight className='h-5 w-5 text-gray-500' />
        </TabsTrigger>
      </TabsList>
    </div>
  );

  return (
    <DataTableHeader
      tableName='Project'
      onArchive={() => {}}
      onShowArchive={() => {}}
      onGenerateReport={() => {}}
      additionalElement={tabsElement}
    />
  );
}
