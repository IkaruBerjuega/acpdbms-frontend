'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import FileFilters from './file-filters';
import FilesTableHeaderActions from './file-table-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PiCardsThreeLight } from 'react-icons/pi';
import { VscListSelection } from 'react-icons/vsc';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../tabs';
import type { FileListResponseInterface } from '@/lib/definitions';
import FilesTable from './file-table';
import { useProjectList } from '@/hooks/general/use-project';
import { useFilesList } from '@/hooks/general/use-files';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function FileList<T extends FileListResponseInterface>({
  isArchived,
  initialData,
}: {
  isArchived: boolean;
  initialData: T[];
}) {
  const [filters, setFilters] = useState<{
    projectId: number | null;
    project_title: string | null;
  }>({
    projectId: null,
    project_title: null,
  });
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(true);

  const selectedProjectId = filters.projectId;
  const projectId = selectedProjectId ? selectedProjectId.toString() : '';

  const {
    data: projects = [],
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjectList({
    isArchived,
    initialData: [],
  });

  const {
    data: files = [],
    isLoading: filesLoading,
    error: filesError,
  } = useFilesList({
    projectId,
    isArchived,
    initialData,
    enabled: Boolean(selectedProjectId),
  });

  const handleFilterChange = (newFilters: {
    projectId: number | null;
    project_title: string | null;
  }) => {
    setFilters(newFilters);
  };

  const isLoading = projectsLoading || (selectedProjectId && filesLoading);
  const hasError = projectsError || filesError;

  if (hasError) {
    return (
      <div className='p-8 text-center'>
        <p className='text-red-500'>
          Error loading data: {(projectsError || filesError)?.toString()}
        </p>
      </div>
    );
  }

  return (
    <div className='flex lg:flex-row w-full h-full gap-4'>
      <Tabs defaultValue='list' className='flex flex-col flex-grow gap-2'>
        <FilesTableHeaderActions
          components={
            <TabsList className='flex h-full'>
              <TabsTrigger value='list'>
                <VscListSelection className='h-5 w-5 text-gray-500' />
              </TabsTrigger>
              <TabsTrigger value='card'>
                <PiCardsThreeLight className='h-5 w-5 text-gray-500' />
              </TabsTrigger>
            </TabsList>
          }
        />
        <main className='w-full h-full flex-col-start gap-2 bg-white-primary rounded-b-lg shadow-md system-padding'>
          {isLoading ? (
            <Skeleton className='h-[600px] w-full' />
          ) : !selectedProjectId ? (
            <div className='text-center py-8'>
              Please select a project from the filters panel to view files.
            </div>
          ) : files.length === 0 ? (
            <div className='text-center py-8'>
              No files found. Upload files to get started.
            </div>
          ) : (
            <>
              <TabsContent value='list'>
                <div className='flex-grow'>
                  <FilesTable
                    isArchived={isArchived}
                    initialData={files}
                    projectId={projectId}
                  />
                </div>
              </TabsContent>
              <TabsContent value='card'>
                <div className='flex-grow'>
                  {/* Card view implementation */}
                </div>
              </TabsContent>
            </>
          )}
        </main>
      </Tabs>
      <div
        className={cn(
          'lg:w-80 transition-all duration-300 ease-in-out',
          filtersPanelOpen ? 'block' : 'hidden lg:block'
        )}
      >
        <Card className='h-full'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Filters</h3>
              <Button
                variant='outline'
                size='sm'
                className='lg:hidden'
                onClick={() => setFiltersPanelOpen(true)}
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <Skeleton className='h-[400px] w-full' />
            ) : (
              <FileFilters
                onFilterChange={handleFilterChange}
                currentFilters={filters}
                projects={projects}
                className='flex flex-col gap-1'
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
