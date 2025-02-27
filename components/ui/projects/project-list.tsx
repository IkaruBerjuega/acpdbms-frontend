'use client';

import { useState } from 'react';
import ProjectsTableHeaderActions from '@/components/ui/projects/table-header';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import Table from '@/components/ui/projects/table';
import ProjectCards from '../general/data-table-components/project-cards';

export default function ProjectList() {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={setActiveTab}
      className='flex flex-col w-full h-auto gap-4'
    >
      {/* header actions */}
      <ProjectsTableHeaderActions
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* main content view table */}
      <main className='w-full h-full flex-col-start gap-2'>
        <TabsContent value='list'>
          <div className='flex-grow bg-white-primary rounded-b-lg shadow-md system-padding'>
            <Table />
          </div>
        </TabsContent>
        {/* main content view cards */}
        <TabsContent value='card'>
          <div className='flex-grow bg-white-primary rounded-b-lg shadow-md system-padding'>
            <ProjectCards query={''} />
          </div>
        </TabsContent>
      </main>
    </Tabs>
  );
}
