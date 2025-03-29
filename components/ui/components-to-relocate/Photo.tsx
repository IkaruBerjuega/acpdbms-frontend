'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/app/api/use-profile';

export function Photo() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { uploadPhoto } = useProfile();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append('profile-picture', file); // Replace "profile-picture" with the expected key

      const isSuccessful = await uploadPhoto(formData);

      if (isSuccessful) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className='flex flex-col items-center gap-4'>
      <h2 className='block justify-start text-lg font-semibold text-maroon-700'>
        Profile Photo Preview
      </h2>
      <div className='w-64 h-64 bg-gray-200 rounded-full overflow-hidden'>
        {selectedImage ? (
          <img
            src={selectedImage}
            alt='Profile Preview'
            className='object-cover w-full h-full'
          />
        ) : (
          <img
            src='/Photos/avatarplaceholder.png'
            alt='Default Placeholder'
            className='object-cover w-full h-full'
          />
        )}
      </div>

      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label
          htmlFor='picture'
          className='block justify-start text-sm font-semibold text-maroon-700'
        >
          Upload a New Photo
        </Label>
        <Input id='picture' type='file' onChange={handleImageChange} />
      </div>
    </div>
  );
}
