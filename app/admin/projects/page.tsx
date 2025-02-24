import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageTitle from '@/components/ui/general/project-title';
import { PiCardsThreeLight } from 'react-icons/pi';
import { VscListSelection } from 'react-icons/vsc';
import ProjectTable from '@/components/ui/general/data-table-components/project-table';

import {
  BtnAdd,
  BtnArchive,
  BtnArchivedItems,
  BtnGenerateReport,
} from '@/components/ui/general/data-table-components/table-buttons';

export default async function Page({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const query = searchParams?.query || '';
  return (
    <>
      <Tabs
        defaultValue='list'
        className='flex flex-col w-full h-auto gap-4'
      >
        <PageTitle pageTitle='Projects' />
        <div className='flex flex-col w-full h-full gap-4'>
          <div className='flex flex-col lg:flex-row w-full justify-between h-auto p-4 gap-4 rounded-md shadow-md'>
            <div className='flex flex-row rounded-l-md gap-2 items-center w-full lg:w-1/2'></div>
            <div className='flex flex-col md:flex-row gap-4  md:justify-between'>
              <div className='flex flex-row gap-2 overflow-x-auto'>
                <BtnArchive label={'Archived Items'} />
                <BtnArchivedItems label={'Archived Items'} />
                <BtnGenerateReport label={'Generate Report'} />
              </div>
              <div className='flex flex-row gap-2'>
                <BtnAdd
                  label='Add Project'
                  classname='flex-1 md:flex-none'
                  href='/admin/projects/create'
                />
                <TabsList className='h-9 sm:h-11 flex-1'>
                  <TabsTrigger
                    value='list'
                    className='h-8 rounded-md px-2 sm:px-4 w-1/2'
                  >
                    <VscListSelection className='h-5 w-5 text-gray-500 ' />
                  </TabsTrigger>
                  <TabsTrigger
                    value='card'
                    className='h-8 rounded-md px-2 sm:px-4 w-1/2'
                  >
                    <PiCardsThreeLight className='h-5 w-5 text-gray-500' />
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
          </div>
          <div className='flex-1 rounded-md'>
            <TabsContent value='card'></TabsContent>
            <TabsContent value='list'>
              <ProjectTable />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </>
  );
}
