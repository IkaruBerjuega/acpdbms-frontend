'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import Cookies from 'js-cookie';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/general/use-profile';
import { Card, CardContent } from '@/components/ui/card';
import { useFormContext, useWatch } from 'react-hook-form';
import { MapPin } from 'lucide-react';

export function Photo() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { uploadPhoto } = useProfile();
  const image_url = Cookies.get('image_url') || '';

  const { control } = useFormContext();
  const firstName = useWatch({ control, name: 'first_name' });
  const middleName = useWatch({ control, name: 'middle_name' });
  const lastName = useWatch({ control, name: 'last_name' });
  const cityTown = useWatch({ control, name: 'city_town' });
  const state = useWatch({ control, name: 'state' });
  const street = useWatch({ control, name: 'street' });

  useEffect(() => {
    if (image_url) {
      setSelectedImage(image_url);
    }
  }, [image_url]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const formData = new FormData();
        formData.append('profile_picture', file);

        const response = await uploadPhoto(formData);
        console.log('API Response:', response);

        if (response && response.profile_picture_url) {
          Cookies.set('image_url', response.profile_picture_url, {
            expires: 7,
          });
          setSelectedImage(response.profile_picture_url);
          toast({
            title: 'Success!',
            description: 'Photo uploaded successfully.',
            variant: 'default',
          });
        } else {
          toast({
            title: 'Error!',
            description: 'Photo upload failed. Please try again.',
            variant: 'destructive',
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className='border-none shadow-md w-auto md:min-w-[414px] md:min-h-[468px]'>
      <div className='bg-eerieblack rounded-t-lg h-auto md:max-h-[220px]'>
        <CardContent className='p-8'>
          <div className='flex flex-col items-center gap-4'>
            <label
              htmlFor='picture'
              className='cursor-pointer'
            >
              <div className='w-56 h-56 bg-gray-200 rounded-full border-4 border-white-primary mt-12 overflow-hidden relative group'>
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt='Profile Preview'
                    className='object-cover w-full h-full'
                  />
                ) : (
                  <img
                    src='/no-profile.png'
                    alt='Default Placeholder'
                    className='object-cover w-full h-full'
                  />
                )}
                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300'>
                  <span className='text-white-primary font-bold text-lg'>
                    Upload Photo
                  </span>
                </div>
              </div>
            </label>
            <Input
              id='picture'
              type='file'
              onChange={handleImageChange}
              className='hidden'
            />
          </div>
          <p className='mt-1 text-center text-xl font-semibold'>
            {firstName} {middleName} {lastName}
          </p>
          <div className='flex flex-row items-center justify-center'>
            <MapPin className='h-4 w-4 text-primary' />
            <p className='mt-1 text-center text-sm'>
              {state}
              {', '}
              {cityTown}
              {', '}
              {street}
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
