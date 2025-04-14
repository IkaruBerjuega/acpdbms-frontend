'use client';

import { useState } from 'react';
import { Camera, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Dropzone from '../drop-zone';
import { useAccountSettings } from '@/hooks/general/use-account-settings';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '../../avatar';
import { Button } from '@/components/ui/button';

export default function ProfilePictureSettings({
  profile,
  fname,
  size = 200,
}: {
  profile?: string | null;
  fname?: string;
  size?: number;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { updatePicture } = useAccountSettings<any>();
  const queryClient = useQueryClient();

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]); // Only accept one
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('profile_picture', selectedFile);

    updatePicture.mutate(formData, {
      onSuccess: (response: { message: string }) => {
        toast({
          variant: 'default',
          title: 'Profile Picture Updated',
          description: response.message || 'Upload Successful!',
        });
        queryClient.invalidateQueries({ queryKey: ['user'] });
        setSelectedFile(null); // reset for next upload
      },
      onError: (response: { message: string }) => {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: response.message || 'Something went wrong.',
        });
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  };

  return (
    <div className='flex flex-col items-center gap-4'>
      <div
        className={cn(
          'relative rounded-full overflow-hidden shadow-md transition-transform',
          isSubmitting && 'opacity-100'
        )}
        style={{ width: size, height: size }}
      >
        <Avatar style={{ width: size, height: size }}>
          {profile ? (
            <AvatarImage src={profile} alt='Profile' />
          ) : (
            <AvatarFallback>{fname}</AvatarFallback>
          )}
        </Avatar>

        {isSubmitting && (
          <div className='absolute inset-0 bg-black/30 flex items-center justify-center'>
            <div className='w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin' />
          </div>
        )}
      </div>

      {/* Dropzone + Preview + Submit */}
      <form onSubmit={handleSubmit} className='w-full max-w-md space-y-2'>
        {!selectedFile ? (
          <Dropzone
            onDrop={handleDrop}
            accept={{
              'image/jpeg': [],
              'image/png': [],
              'image/webp': [],
              'image/svg+xml': [],
            }}
            showImages={true}
            maxSize={2 * 1024 * 1024}
          />
        ) : (
          <div className='flex flex-col items-center gap-2'>
            <p className='text-sm'>Selected Image:</p>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt='Preview'
              className='w-32 h-32 rounded-full object-cover'
            />
            <div className='flex gap-2'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Uploading...' : 'Submit Photo'}
              </Button>
              <Button
                variant='outline'
                type='button'
                onClick={() => setSelectedFile(null)}
                disabled={isSubmitting}
              >
                <ImagePlus className='w-4 h-4 mr-1' />
                Replace
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
