'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import type { FileListResponseInterface } from '@/lib/definitions';

// Replace the getFileIcon function with this updated version that uses React Icons
import {
  AiFillFileImage,
  AiFillFilePdf,
  AiFillFileZip,
  AiFillFileWord,
  AiFillFileExcel,
  AiFillFilePpt,
  AiFillFileText,
  AiFillFileUnknown,
} from 'react-icons/ai';
import { FaFileVideo } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';

function getFileIcon(type: string) {
  const iconSize = 40;

  // Extract file extension if type contains a slash (like 'application/pdf')
  const fileType = type.includes('/') ? type.split('/')[1] : type;

  switch (fileType.toLowerCase()) {
    // Images
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
      return <AiFillFileImage size={iconSize} className='text-blue-500' />;

    // Documents
    case 'pdf':
      return <AiFillFilePdf size={iconSize} className='text-red-500' />;
    case 'doc':
    case 'docx':
      return <AiFillFileWord size={iconSize} className='text-blue-700' />;
    case 'xls':
    case 'xlsx':
      return <AiFillFileExcel size={iconSize} className='text-green-600' />;
    case 'ppt':
    case 'pptx':
      return <AiFillFilePpt size={iconSize} className='text-orange-600' />;
    case 'txt':
      return <AiFillFileText size={iconSize} className='text-gray-600' />;

    // Archives
    case 'zip':
    case 'rar':
      return <AiFillFileZip size={iconSize} className='text-amber-500' />;

    // Media
    case 'mp4':
    case 'mov':
      return <FaFileVideo size={iconSize} className='text-purple-500' />;

    // Default
    default:
      return <AiFillFileUnknown size={iconSize} className='text-gray-500' />;
  }
}

export default function FileCard({
  file,
  isLoading = false,
}: {
  file?: FileListResponseInterface; // Single file instead of an array
  isLoading?: boolean; // Optional loading prop for skeleton
}) {
  if (isLoading) {
    return <Skeleton className='h-32 w-full max-w-xs rounded-md' />;
  }

  if (!file) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        No File Data Available
      </div>
    );
  }

  return (
    <Card className='overflow-hidden hover:shadow-md transition-all duration-200 hover:translate-y-[-1px] border-gray-200 group max-w-xs'>
      <div className='relative bg-gray-50 p-8 flex justify-center items-center group-hover:bg-gray-100 transition-colors'>
        {getFileIcon(file.type)}
        {file.is_archived && (
          <Badge
            variant='destructive'
            className='absolute top-1 left-0 ml-auto shrink-0 text-xs scale-75'
          >
            Archived
          </Badge>
        )}
        {file.task_version_number && (
          <div className='absolute top-2 right-2 flex items-center text-xs'>
            <Tag className='h-3 w-3 mr-1' />
            <span>v{file.task_version_number}</span>
          </div>
        )}
      </div>
      <CardHeader className='p-2 pb-0 flex items-center'>
        <div className='flex justify-center items-start w-full'>
          <CardTitle className='text-sm font-medium truncate pr-1 leading-tight text-center'>
            {file.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='p-2 pt-1 text-xs flex justify-center'>
        <div className='flex flex-wrap gap-1 justify-center items-center'>
          {file.task_name && (
            <Badge
              variant='outline'
              className='text-xs scale-90 whitespace-nowrap'
            >
              {file.task_name}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
