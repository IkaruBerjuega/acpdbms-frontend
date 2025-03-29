import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Verification } from './Verification';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FaCheckCircle } from 'react-icons/fa';

export function DropZone() {
  const [backgroundImage, setBackgroundImage] = useState<string>(
    '/photos/logo_red_large.png'
  );
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false); // New state for success dialog

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setBackgroundImage(URL.createObjectURL(acceptedFiles[0]));
    },
  });

  const handleSuccess = () => {
    setIsVerificationOpen(false);
    setIsSuccessOpen(true); // Open success dialog
  };

  return (
    <>
      <div className='flex flex-col items-center'>
        <div
          {...getRootProps()}
          className='relative w-full h-[300px] mx-auto border border-darkgray-400 rounded-sm p-6 flex flex-col'
        >
          <div
            className='absolute inset-0 bg-gray opacity-50'
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <input {...getInputProps()} />
          <div className='flex-grow' />
          <div className='z-10 text-center'>
            {isDragActive ? (
              <p className='text-red-500 font-semibold'>
                Drop the image here ...
              </p>
            ) : (
              <p className='text-maroon-700 font-semibold'>
                <span className='underline decoration-maroon-700'>
                  Click to Upload
                </span>{' '}
                or Drag and Drop
              </p>
            )}
          </div>
        </div>

        <Dialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
          <DialogTrigger asChild>
            <Button
              className='w-full bg-maroon-700 hover:bg-maroon-800 mt-8'
              onClick={() => setIsVerificationOpen(true)}
            >
              Update
            </Button>
          </DialogTrigger>
          <DialogContent className='w-full max-w-md'>
            <DialogHeader>
              <DialogTitle>Admin Verification</DialogTitle>
              <Verification onSuccess={handleSuccess} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className='max-w-64 justify-center items-center mx-auto'>
          <DialogHeader>
            <DialogTitle className='justify-center items-center mx-auto'>
              <FaCheckCircle className='text-maroon-700 text-8xl' />
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogDescription className='text-stone-950 font-semibold'>
              Logo Updated
            </DialogDescription>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
