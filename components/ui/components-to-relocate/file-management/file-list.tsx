'use client';
import { useSearchParams, useRouter } from 'next/navigation';
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
import { cn, formatFileSize, formatFileType, formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import FileTileView from './file-cards';
import { useState } from 'react';

interface Project {
  id: number;
  project_title: string;
}

export default function FileList<T extends FileListResponseInterface>({
  isArchived,
  initialData,
  projects,
}: {
  isArchived: boolean;
  initialData?: T[];
  projects: Project[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Get projectId from query params, default to null if not present
  const selectedProjectId = searchParams.get('projectId')
    ? Number(searchParams.get('projectId'))
    : null;
  const projectId = selectedProjectId ? selectedProjectId.toString() : '';

  const files = initialData || [];

  // Format the files data before passing to child components
  const formattedFiles = files.map((file) => ({
    ...file,
    uploaded_at: formatDate(file.uploaded_at),
    type: formatFileType(file.type),
    size: formatFileSize(file.size),
  }));

  const handleFilterChange = (newFilters: { projectId: number | null }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newFilters.projectId) {
      params.set('projectId', newFilters.projectId.toString());
    } else {
      params.delete('projectId');
    }

    router.push(`?${params.toString()}`);
  };

  const [filtersPanelOpen, setFiltersPanelOpen] = useState(true);

  const isLoading = false;
  const hasCriticalError = false;
  const isFilesNotFound = selectedProjectId && files.length === 0;

  if (hasCriticalError) {
    return (
      <div className='p-8 text-center'>
        <p className='text-red-500'>Error loading data</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col lg:flex-row w-full h-full gap-4'>
      <Tabs defaultValue='list' className='flex flex-col flex-1 w-full gap-2'>
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
        <main className='w-full flex-1 flex flex-col gap-2 bg-white-primary rounded-b-lg shadow-md system-padding'>
          {isLoading ? (
            <div className='flex-grow'>
              <Skeleton className='h-[600px] w-full' />
            </div>
          ) : !selectedProjectId ? (
            <div className='text-center py-8'>
              Please select a project from the filters panel to view files.
            </div>
          ) : isFilesNotFound || files.length === 0 ? (
            <div className='text-center py-8'>
              No files found. Upload files to get started.
            </div>
          ) : (
            <>
              <TabsContent value='list' className='flex-1 h-full'>
                <div className='h-full'>
                  <FilesTable
                    isArchived={isArchived}
                    initialData={formattedFiles}
                    projectId={projectId}
                  />
                </div>
              </TabsContent>
              <TabsContent value='card' className='flex-1 h-full'>
                <div className='h-full'>
                  <FileTileView
                    isArchived={isArchived}
                    initialData={formattedFiles}
                    projectId={projectId}
                  />
                </div>
              </TabsContent>
            </>
          )}
        </main>
      </Tabs>
      <div
        className={cn(
          'lg:w-80 transition-all duration-300 ease-in-out shrink-0',
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
            <FileFilters
              onFilterChange={handleFilterChange}
              currentFilters={{
                projectId: selectedProjectId,
              }}
              projects={projects}
              className='flex-grow'
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
